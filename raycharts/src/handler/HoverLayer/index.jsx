import React, { Component } from 'react';
import styles from './index.less';
import _ from 'lodash';

import { color } from '../../utils';

function BorderColor(colorText) {
    return /linear-gradient/.test(colorText)
        ? {
              borderImage: `${colorText} 10 10`,
          }
        : {
              borderColor: colorText,
          };
}

class HoverLayer extends Component {
    constructor(props) {
        super();
        this.state = {
            state: 'hide',
            top: 0,
            left: 0,
            titleText: '',
            hasIcon: true,
            labelList: null,
        };
        this.defaultState = {
            state: 'hide',
            top: 0,
            left: 0,
            titleText: '',
            hasIcon: true,
            labelList: null,
        };
        this.cardDom = React.createRef();
        props.onRef(this);
    }
    componentWillUnmount() {
        // console.log('HoverLayer Unmount !!!');
    }
    /**
     * @method addHoverAction
     * @description 针对传入元素绑定 hover 事件，依据传入数据，取得对应的数据列表
     * @param {ZrenderElement} sub Zrender Element
     * @param {Object} config
     * config: {
     *   // 数据展示
     *   cid: {Any} // 类别id
     *   sid: {Any} // 系列id
     *   title: {String} // 自定义标题，传入覆盖值
     *   hasIcon: {Boolean} // 是否展示Icon，默认为true
     *   labelList: {Array} [
     *      colorIndex, {Num} // 色彩列表的索引
     *      keyName, // 左侧字段
     *      value, // 右侧字段
     *   ]
     *   // 位置修改
     *   offset = [offsetX = 0, offsetY = 20] 弹窗基于指针位置的偏移量，只修改一个的时候使用 null 占位
     * }
     * @returns {ZrenderElement} Zrender Element
     */
    addHoverAction = (sub, config) => {
        const me = this;
        let isFirst = true;
        sub.on('mousemove', function(event) {
            // 依据开关状态 进入不同的代码逻辑
            // 总开关关闭
            if (me.props.configData.handle.open === false) {
                event?.target?.attr('cursor', 'default');
                return;
            }
            // 开启 弹窗
            if (me.props.configData.handle.popover.open === true) {
                // setState 置于 原生回调中导致
                isFirst && me.setCardListData(config);
                me.moveTo(event, config);
            }
            isFirst || (isFirst = false);
        }).on('mouseout', function(event) {
            me.reset();
            isFirst = true;
        });
        return sub;
    };
    // private
    moveTo({ target, offsetX: X, offsetY: Y }, config) {
        target.attr('cursor', 'pointer');
        const { width: cardW, height: cardH } = this.cardDom.current.getBoundingClientRect();
        const { width: boxW, height: boxH } = this.props.boxSize;
        const urbanOffsetX = 10;
        const urbanOffsetY = 24;
        const baseOffsetX =
            X + cardW + urbanOffsetX > boxW && X > boxW / 2 ? -(cardW + urbanOffsetX / 2) : urbanOffsetX;
        const baseOffsetY =
            Y + cardH + urbanOffsetY > boxH && Y > boxH / 2 ? -(cardH + urbanOffsetY / 6) : urbanOffsetY;
        const [offsetX, offsetY] = config?.offset ?? [];
        this.setState({
            state: 'show',
            left: X + (offsetX ?? baseOffsetX),
            top: Y + (offsetY ?? baseOffsetY),
        });
    }
    setCardListData(config) {
        let resData = {};
        // 图表数据
        const {
            // 系列列表
            seriesList,
            // 类别列表
            categoryList,
            // 基于系列的数据
            dataBaseSeries,
            // 基于类别的数据
            dataBaseCategory,
            // 基于系列的最值
            ultraBaseSeries,
        } = this.props.chartData;
        // 添加图表数据 判断初次加载
        if (this.state.labelList === null) {
            // 根据系列类别进行数据添加
            if (_.has(config, 'cid')) {
                const cid = config.cid;
                const categoryName = categoryList.find(({ cid: id }) => id === cid)?.categoryName ?? '';
                const seriesLine = dataBaseCategory?.[cid] ?? [];
                if (_.has(config, 'sid')) {
                    const sid = config.sid;
                    const seriesIndex = seriesList.findIndex(({ sid: id }) => id === sid);
                    resData = {
                        ...resData,
                        titleText: categoryName,
                        labelList: [
                            {
                                colorIndex: seriesIndex === -1 ? null : seriesIndex,
                                keyName: seriesList?.[seriesIndex].seriesName ?? null,
                                value: seriesLine?.[seriesIndex] ?? null,
                            },
                        ],
                    };
                } else {
                    resData = {
                        ...resData,
                        titleText: categoryName,
                        labelList: seriesLine.map((data, index) =>
                            data === null
                                ? null
                                : {
                                      colorIndex: index,
                                      keyName: seriesList[index].seriesName,
                                      value: data,
                                  },
                        ),
                    };
                }
            } else if (_.has(config, 'sid')) {
                const sid = config.sid;
                const seriesIndex = seriesList.findIndex(({ sid: id }) => id === sid);
                const seriesName = seriesList?.[seriesIndex].seriesName ?? '';
                const categoryLine = dataBaseSeries?.[sid] ?? [];
                resData = {
                    ...resData,
                    titleText: seriesName,
                    labelList: categoryLine.map((data, index) =>
                        data === null
                            ? null
                            : {
                                  colorIndex: seriesIndex === -1 ? null : seriesIndex,
                                  keyName: categoryList[index].categoryName,
                                  value: data,
                              },
                    ),
                };
            }
            // 自定义值 覆盖输入值
            if (_.has(config, 'title')) {
                resData = { ...resData, titleText: config.title };
            }
            if (_.has(config, 'hasIcon')) {
                resData = { ...resData, hasIcon: config.hasIcon };
            }
            if (_.has(config, 'labelList') && _.isArray(config.labelList)) {
                resData = { ...resData, labelList: config.labelList };
            }
        }
        this.setState(resData);
    }
    reset() {
        this.setState(this.defaultState);
    }
    // 绘制
    renderTextBlock(textConfig, textColor) {
        const {
            font: {
                font_family: Popover_FontFamily,
                font_size: Popover_FontSize,
                font_style: Popover_FontStyle,
                text_decoration: Popover_TextDecoration,
                font_weight: Popover_FontWeight,
            },
        } = textConfig;
        const { text_color: Popover_TextColor } = textColor;
        const board_style = {
            lineHeight: `${Popover_FontSize}px`,
            color: color(Popover_TextColor, 'css'),
            fontFamily: Popover_FontFamily,
            fontSize: `${Popover_FontSize}px`,
            fontStyle: Popover_FontStyle,
            textDecoration: Popover_TextDecoration,
            fontWeight: Popover_FontWeight,
        };
        return (child) => <span style={board_style}>{child}</span>;
    }
    renderBoardCard(configData) {
        const {
            handle: {
                open: HandleAct,
                popover: {
                    open: PopoverAct,
                    shape: Popover_Shape,
                    event_type: Popover_EventType,
                    border: {
                        // 属性值：solid（实线，默认）、dashed（虚线）
                        line_type: PopoverBorder_LineType,
                        // 字段释义：tleft:top_left、tright:top_right、bright:bottom_right、bleft:bottom_left
                        radius: {
                            tleft: PopoverBorderR_TLeft,
                            tright: PopoverBorderR_TReft,
                            bright: PopoverBorderR_BReft,
                            bleft: PopoverBorderR_BLeft,
                        },
                        line_width: PopoverBorder_LineWidth,
                    },
                    outset: { h: PopoverOutset_h, v: PopoverOutset_v, blur: PopoverOutset_Blur },
                    value: Popover_Value_Style,
                    series: Popover_Series_Style,
                    label: Popover_Label_Style,
                },
            },
            default_theme: {
                graph: { colors: Series_ColorsList },
                handle: {
                    popover: {
                        // board
                        color: Popover_FillColor,
                        border: Popover_BorderColor,
                        outset: Popover_OutsetColor,
                        // text
                        value: Popover_Value_Color,
                        series: Popover_Series_Color,
                        label: Popover_Label_Color,
                    },
                },
            },
        } = configData;
        // 所有的间隔都是基于 Series_Style font_size
        const gapSpace = Math.floor((Popover_Series_Style?.font?.font_size ?? 14) / 2);
        const board_style = {
            padding: `${gapSpace}px ${gapSpace}px ${gapSpace}px ${gapSpace}px`,
            // fill
            background: color(Popover_FillColor, 'css'),
            // border
            borderStyle: PopoverBorder_LineType,
            borderWidth: `${PopoverBorder_LineWidth}px`,
            borderTopLeftRadius: `${PopoverBorderR_TLeft}px`,
            borderTopRightRadius: `${PopoverBorderR_TReft}px`,
            borderBottomRightRadius: `${PopoverBorderR_BReft}px`,
            borderBottomLeftRadius: `${PopoverBorderR_BLeft}px`,
            ...BorderColor(color(Popover_BorderColor, 'css')),
            // outset
            boxShadow: `${PopoverOutset_h}px ${PopoverOutset_v}px ${PopoverOutset_Blur}px ${color(
                Popover_OutsetColor,
                'css',
            )}`,
        };
        const row_style = {
            marginBottom: `${gapSpace}px`,
        };
        const item_style = {
            marginRight: `${gapSpace}px`,
        };
        const icon_size = Math.floor(((Popover_Series_Style?.font?.font_size ?? 14) * 2) / 3);
        const icon_style = {
            width: `${icon_size}px`,
            height: `${icon_size}px`,
            borderRadius: `${icon_size}px`,
        };
        const { renderTextBlock } = this;
        const { titleText = '', hasIcon = true, labelList = [] } = this.state;
        return (
            <ul className={styles.hover_item} style={board_style} ref={this.cardDom}>
                <li className={styles.row_line} style={row_style}>
                    {renderTextBlock(Popover_Label_Style, Popover_Label_Color)(titleText)}
                </li>
                {labelList &&
                    labelList.map((item, index) => {
                        if (_.isEmpty(item)) return null;
                        const { colorIndex = null, keyName, value } = item;
                        const icon_color = color(
                            Series_ColorsList?.[colorIndex % Series_ColorsList.length] ?? 'transparent',
                            'css',
                        );
                        // background: 'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(0, 0, 0) 100%)';
                        return (
                            <li key={index} className={styles.row_line} style={row_style}>
                                {hasIcon ? (
                                    colorIndex === null ? null : (
                                        <span style={{ ...item_style, ...icon_style, background: icon_color }}></span>
                                    )
                                ) : null}
                                <div style={item_style}>
                                    {renderTextBlock(Popover_Series_Style, Popover_Series_Color)(`${keyName}:`)}
                                </div>
                                <div>{renderTextBlock(Popover_Value_Style, Popover_Value_Color)(value)}</div>
                            </li>
                        );
                    })}
            </ul>
        );
    }
    render() {
        const { top, left, state } = this.state;
        const { chartData, configData } = this.props;
        if ((configData?.handle?.popover?.open ?? false) === false) return null;
        return (
            <div
                className={styles.hover_layer}
                style={{ opacity: state === 'hide' ? '0' : '1', transform: `translate(${left}px,${top}px)` }}
            >
                {this.renderBoardCard(configData, chartData)}
            </div>
        );
    }
}

export default HoverLayer;
