import * as zrender from 'zrender';
import { Group, Rect, Text } from '../shape';
import { color } from '../utils/color';
import { G_NAME, G_INDEX } from '../utils/common';
// import DataBoxClass from '../charts/Scatter/DataBox';

const renderLineType = (type) => (type !== 'solid' ? [2, 2, 2, 2] : '');
const limitValue = (per, limit) => (limit * per) / 100;
/**
 * @method dataBox
 * @description 渲染生成端点
 * @param {Object} configData 配置项
 * @param {Object} config 设置参数
 * @returns {sub} 数据盒组 返回的图形在定位点中心
 * @example
 *
 * config: {
 *  name: 元素名称，不传为空
 *  dataText: 数据盒文字
 *  isMin: 是否为最小值
 *  isMax: 是否为最大值
 *  _baseZ: 图形层级, 不传使用默认层级
 * }
 */
// const dataBox = (configData) => (config) => {
//     const node = new DataBoxClass({
//         originStyle: configData,
//         text: config.dataText,
//         isMin: config.isMin,
//         isMax: config.isMax,
//     });
//     return node.render();
// };
function dataBox(configData) {
    const {
        visible: DataBox_Visible, // 文字的显示隐藏
        font: {
            font_family: DataBoxText_FontFamily, // 字体的名称
            font_size: DataBoxText_FontSize, // 字体的大小
            font_style: DataBoxText_FontStyle, // 字体的样式
            // text_decoration: DataBoxText_Decoration, // 字体的装饰
            font_weight: DataBoxText_FontWeight, // 字体的粗细
        },
        show: DataBox_Filter, // 显示方式（全部，最大等）
        type: DataBox_Format, // 显示的数值格式(数字 百分比)
        // text_stroke: {
        //     visible: tip_stroke_visible, // 提示文字描边的显示隐藏
        //     line_width: tip_stroke_width, // 提示文字的宽度
        // },
        position: DataBox_PositionType, // 气泡的位置（上， 中， 下）
        bubble: {
            // 气泡相关
            visible: DataBoxBG_Visible, // 气泡的显示隐藏
            // shape: DataBoxBG_Shape, // 气泡图形
            border: {
                line_type: DataBoxBG_BorderType, // 气泡的边框样式
                radius: {
                    tleft: DataBoxBG_BR_TLeft,
                    tright: DataBoxBG_BR_TRight,
                    bright: DataBoxBG_BR_BRight,
                    bleft: DataBoxBG_BR_BLeft,
                }, // 气泡的边框圆角
                line_width: DataBoxBG_BorderWidth, // 气泡的边框宽度
            },
            // lead_wire: {
            //     line_type: bubble_leadW_type, // 气泡引线的样式
            //     line_width: bubble_leadW_lineW, // 气泡引线的宽度
            // },
        },
    } = configData?.data;

    // 提示文字【颜色】
    const {
        text_color: DataBoxText_Color, // 柱子提示文字的颜色
        text_stroke: DataBoxText_BorderColor, // 文字描边的颜色
        bubble: {
            // 提示文字的气泡
            border: DataBoxBG_BorderColor, // 气泡边框颜色
            color: DataBoxBG_Color, // 气泡背景色
            // lead_wire: DataBoxBG_LeadColor, // 气泡引线颜色
        },
    } = configData?.default_theme?.data;

    return (config) => {
        const { name: baseName, _baseZ, dataText, isMin, isMax } = config;

        // 容器组
        const DataBoxGroup = new Group({ name: `${G_NAME.data} ${baseName}` });

        // 判断是否渲染
        if (DataBox_Visible === false) return DataBoxGroup;
        if (DataBox_Filter === 'min' && isMin === false) return DataBoxGroup;
        if (DataBox_Filter === 'max' && isMax === false) return DataBoxGroup;
        if (DataBox_Filter === 'ex' && isMin === false && isMax === false) return DataBoxGroup;

        // 文字
        const textFontsize = Math.abs(DataBoxText_FontSize) || 1;
        const textLineHeight = textFontsize;
        const textPadding = textLineHeight / 5;
        const textRectify = textLineHeight / 8;

        // 文字样式
        const dataTextStyle = {
            text: `${dataText}`,
            fill: color(DataBoxText_Color),
            stroke: color(DataBoxText_BorderColor),
            // 样式
            fontStyle: DataBoxText_FontStyle,
            fontWeight: DataBoxText_FontWeight,
            fontFamily: DataBoxText_FontFamily,
            fontSize: textFontsize,
            // 行内布局
            align: 'center',
            // verticalAlign: 'middle', // 与 padding 冲突
            lineHeight: textLineHeight,
            // 盒模型
            padding: [
                textPadding + textRectify,
                textPadding,
                textPadding - textRectify,
                textPadding,
            ],
        };

        // 获取 文字节点 size
        const { width: textWidth, height: textHeight } = new zrender.Text({
            style: dataTextStyle,
        }).getBoundingRect();

        // 盒子大小
        const boxWidth = Math.max(textWidth, textHeight * 2);
        const boxHeight = textHeight;

        // 盒子坐标
        const boxX = -boxWidth / 2;
        const boxY = -boxHeight / 2;

        // 描边宽
        const lineWidth = limitValue(DataBoxBG_BorderWidth, Math.min(boxWidth, boxHeight));

        // 绘制节点
        DataBoxGroup.add(
            new Text({
                name: `DataBox ${baseName}`,
                silent: true,
                z2: 1,
                z: G_INDEX.data,
                x: 0,
                y: boxY,
                style: {
                    ...dataTextStyle,
                },
            }),
        );

        // 背景盒子
        DataBoxBG_Visible &&
            DataBoxGroup.add(
                new Rect({
                    name: `DataBox-BG ${baseName}`,
                    silent: true,
                    z2: 0,
                    z: G_INDEX.bubble,
                    shape: {
                        x: boxX,
                        y: boxY,
                        width: boxWidth,
                        height: boxHeight,
                        r: [
                            limitValue(DataBoxBG_BR_TLeft, boxWidth),
                            limitValue(DataBoxBG_BR_TRight, boxWidth),
                            limitValue(DataBoxBG_BR_BRight, boxWidth),
                            limitValue(DataBoxBG_BR_BLeft, boxWidth),
                        ],
                    },
                    style: {
                        fill: color(DataBoxBG_Color),
                        stroke: color(DataBoxBG_BorderColor),
                        lineWidth: lineWidth,
                        lineDash: renderLineType(DataBoxBG_BorderType),
                        lineCap: 'square',
                    },
                }),
            );

        return DataBoxGroup;
    };
}

export default dataBox;
