/**
 *  属性面板字段对应的配置文件：/raycharts/src/configSet/defaultConfig.js
 *
 */
import {
    get_maxText,
    getFontWidth,
    get_Rad,
    getY_max,
    getY_min,
    roundUp,
    getData_maxLen,
    setAnimTime,
    getAverageLine,
    getStackedRanges,
    getSeries_max_min,
    getCategory_max_min,
    getMaxMin,
    handleDec,
} from './guide_common';
import * as zrender from 'zrender';

// 坐标系横向展示的类型---[条形图, 条形堆叠图]
const HORIZONTAL_TYPE = ['h_bar', 'h_stacked', ''];
// 坐标系特殊处理---[盒须图]
const SPECIAL_TYPE = ['boxplot'];

// 轴值叠加处理的类型---[柱形堆叠图、 条形堆叠图、 折线堆叠图、 河流图]
const SUPER_VALUE_TYPE = ['v_stacked', 'h_stacked', 'stack_line', 'line_stacked', 'river'];

// 两个坐标轴都是数值的类型 ---[直方图]
const AXIOS_ALL_LIMIT = ['histogram'];

// 处理轴线的坐标信息
export default function position_info(props) {
    const { maxHeight: rootH, maxWidth: rootW, chartData, configData, zoom } = props;
    // console.log(props);

    // 数据显示方式 （数值或百分比）
    const { type: analysis_type } = configData.analysis;
    const {
        _type,
        guide: {
            xaxis: { text_visible: xaxis_label_visible },
            draw_coor: {
                text_visible: coor_visible,
                v_offset: coor_v,
                h_offset: coor_h,
                scale: {
                    range: { open: scale_open, max: scale_max, min: scale_min },
                },
                division: {
                    a_div: {
                        visible: a_div_visible,
                        num: a_div_num,
                        radial_offset: a_div_radial_offset,
                        line_width: a_div_line_width,
                        line_length: a_div_line_length,
                        value: a_div_lin_value,
                    },
                    b_div: {
                        visible: b_div_visible,
                        num: b_div_num,
                        radial_offset: b_div_radial_offset,
                        line_width: b_div_line_width,
                        line_length: b_div_line_length,
                    },
                },
            },
        },
        _mirror_axes,
    } = configData;

    // 判断坐标系展示方向
    const dir = HORIZONTAL_TYPE.indexOf(configData._type) === -1 ? true : false;
    // 轴标签集合 --- 数据量最多的一组的标签字符
    const { maxData: yAxis_name_ary } = getData_maxLen(chartData);
    let axis_label_ary = [];

    if (SPECIAL_TYPE.indexOf(configData._type) !== -1) {
        axis_label_ary = special_axis_label_ary(chartData);
    } else {
        if (yAxis_name_ary && yAxis_name_ary.length) {
            for (let i = 0; i < yAxis_name_ary.length; i++) {
                axis_label_ary.push(String(yAxis_name_ary[i].x));
            }
        }
    }

    // 数据中的最大值和最小值
    const { max, min } = getMaxMin(chartData.data);
    // 轴标签最大占位高度
    const x_axis_label_maxH = xaxis_label_visible ? rootH * 0.25 : 0;
    // 轴标签上下边距
    const x_axis_paddingT = xaxis_label_visible ? 6 * zoom : 0;
    const x_axis_paddingB = xaxis_label_visible ? 6 * zoom : 0;
    // const x_axis_paddingT = 6 * zoom;
    // const x_axis_paddingB = 6 * zoom;

    const x_axis_title_H = getX_titleH(props);

    // 自定义刻度线的长度
    const scale_len = get_scale_height(props);
    // y轴最高度
    let y_axis_max_height =
        rootH -
        x_axis_title_H -
        x_axis_label_maxH -
        x_axis_paddingT -
        x_axis_paddingB -
        (dir ? 0 : scale_len);

    let params = {
        _type,
        max,
        min,
        zoom,
        rootW,
        rootH,
        chartData,
        configData,
        dir,
        axis_label_ary,
        y_axis_max_height,
    };

    // 轴值相关的信息
    const {
        total_alines, // 均分线数量
        smaller, // 数值绝对值较小的一方
        larger, // 数值绝对值较大的一方
        zeroIndex, // 零轴的序列
        act_zeroIndex, // 均分线有小数时零轴的序列
        average_every_value, // 均分每一段的值
        forwardMax, // 正向最大值
        minusMin, // 负向最小值
        roundUp_larger, // 较大的值向上取值
    } = getDividingLines(params);

    // 轴值均分线小数部分
    const { t_isPoint, t_point_val } = get_t_isPoint(total_alines);
    // 获取数据气泡高度
    const { bubble_height, bubble_width } = getBubble_height({
        configData,
        forwardMax,
        minusMin,
    });

    params = {
        ...params,
        total_alines,
        average_every_value,
        larger,
        forwardMax,
        minusMin,
        roundUp_larger,
        configData,
        t_isPoint,
        t_point_val,
        bubble_width,
        bubble_height,
        act_zeroIndex,
        zeroIndex,
    };

    // 轴数值集合
    const axis_value_ary = get_axisValue_ary(params);
    // 获取 x轴线的开始位置， y轴标题的宽度， y轴标签的宽度
    const { startX, reserveX, y_title_width, y_label_width } = getStartX({
        ...params,
        axis_value_ary,
    });
    // x轴的均分线坐标列表和预留空间
    const { rulesX_ary, zero_reserveX, x_axis_every_space } = dir
        ? v_getXAxis_rulesX_ary({ ...params, startX })
        : h_getXAxis_rulesX_ary({ ...params, startX, reserveX });

    // x轴标签旋转占位高度
    const x_axis_label_H = getXAxisH({ ...params, x_axis_every_space });

    // y轴开始的位置
    const { startY, reserveY } = getStartY(params);

    // y轴线最大高度
    const fix_y_axis_max_height =
        rootH -
        x_axis_title_H -
        x_axis_label_H -
        x_axis_paddingT -
        x_axis_paddingB -
        (dir ? 0 : scale_len) -
        reserveY;

    // y轴的均分线坐标列表和预留空间
    const { rulesY_ary, zero_reserveY, y_axis_every_space } = dir
        ? v_getYAxis_rulesY_ary({
              ...params,
              startY,
              reserveY,
              y_axis_max_height: fix_y_axis_max_height,
          })
        : h_getYAxis_rulesY_ary({
              ...params,
              startY,
              reserveY,
              y_axis_max_height: fix_y_axis_max_height,
          });

    params = {
        ...params,
        startX,
        startY,
        rulesX_ary,
        rulesY_ary,
        x_axis_every_space,
        y_axis_every_space,
        axis_value_ary,
        y_axis_max_height: fix_y_axis_max_height,
        reserveY,
    };

    // 坐标系原点的位置
    const { zero_pos, act_zero_pos } = getZeroPos(params);
    params = { ...params, zero_pos, act_zero_pos };
    // 单位像素
    const { pixelRatioValue, slotOffset } = getPerUnit(params);

    // 坐标轴的标签列表(所有系列中数据源量最多的一组
    const { categoryList: axis_most_list } = chartData;

    // 动画时间
    const animTime = setAnimTime(total_alines);

    // 整合轴标签的坐标列表
    const positionList = getPosList(params);

    // 轴均分线的间隔
    const categoryMaxWeight = dir ? x_axis_every_space : y_axis_every_space;

    // 槽位的最大高度（或者宽度）

    let valueMaxHeight = dir
        ? rulesY_ary[rulesY_ary.length - 1] - rulesY_ary[0]
        : rulesX_ary[rulesX_ary.length - 1] - rulesX_ary[0];

    const _coorInfo = coor_info(params);

    return {
        startX, // x轴开始位置
        startY,
        y_axis_max_height: fix_y_axis_max_height, // y轴最大高度
        y_title_width, // y轴标题宽度
        y_label_width, // y轴标签宽度
        x_axis_label_H, // x轴标签高度
        x_axis_title_H, // x轴标题高度
        x_axis_paddingT, // x轴上边距
        x_axis_paddingB, // x轴的下边距
        reserveX, // x轴预留
        reserveY, // y轴预留
        rulesY_ary, // y轴的坐标集合
        rulesX_ary, // x轴的坐标集合
        zeroIndex, // 原点坐标线序列 零轴的序列，整数就在均分线上, 小数不再均分线上
        zero_pos, // 原点坐标
        act_zero_pos,
        zero_reserveX, // 条形图全负值 零轴预留高度
        zero_reserveY, // 柱形图全负值 零轴预留高度
        forwardMax, // 正向的最大值
        minusMin, // 负方向最小值
        larger,
        smaller,
        roundUp_larger, // 向上取整较大的值
        total_alines, // 均分线数量
        average_every_value, // 轴数值平均值
        dir,
        axis_most_list,
        animTime,
        pixelRatioValue, // 单位像素
        positionList, // 系列数据量最多的轴标签坐标列表
        slotOffset, // 值轴最顶端到 零轴的最大偏移量 px
        categoryMaxWeight, // 轴线间隔
        valueMaxHeight, // 槽位的最大高度（或者宽度）
        t_isPoint, // 轴均分线是否存在小数
        t_point_val, // 轴均分线小数部分的值
        y_axis_every_space, // y轴均分线高度(像素距离)
        x_axis_every_space, // x轴均分线高度(像素距离)
        _coorInfo, // 图形区域裁切 自定义刻度
        axis_value_ary, // 轴数值集合
        axis_label_ary, // 轴标签集合
        scale_len, // 自定义刻度线的长度
    };

    // 横条图自定义刻度轴线数量
    function get_scale_len() {
        let scale_len = 0;
        if (!dir) {
            if (scale_open) {
                if (a_div_visible && b_div_visible) {
                    scale_len = Math.max(a_div_line_length, b_div_line_length);
                }

                if (a_div_visible && !b_div_visible) {
                    scale_len = a_div_line_length;
                }
            }
        }
        return scale_len;
    }
}

// 获取自定义分度线的高度
function get_scale_height(props) {
    const { configData } = props;
    const {
        draw_coor: {
            scale: {
                range: { open: scale_open },
            },
            division: {
                a_div: { visible: a_div_visible, line_length: a_div_line_length },
                b_div: { visible: b_div_visible, line_length: b_div_line_length },
            },
        },
    } = configData.guide;

    let scale_len = 0;

    // 如果显示分度
    if (scale_open && a_div_visible) {
        if (b_div_visible && b_div_line_length - 0 > a_div_line_length - 0) {
            scale_len = b_div_line_length;
        } else {
            scale_len = a_div_line_length;
        }
    }
    return scale_len;
}

// 特殊处理的轴标签集合
function special_axis_label_ary(chartData) {
    let axis_label_ary = [];
    const { DEPRECATED_data } = chartData;
    DEPRECATED_data.forEach((item) => {
        if (axis_label_ary.indexOf(item.x) === -1) {
            axis_label_ary.push(item.x);
        }
    });

    // if (yAxis_name_ary && yAxis_name_ary.length) {
    //     for (let i = 0; i < yAxis_name_ary.length; i++) {
    //         axis_label_ary.push(String(yAxis_name_ary[i].x));
    //     }
    // }
    return axis_label_ary;
}

// 判断轴线是否存在小数(自定义刻度造成不能均分)
function get_t_isPoint(total_alines) {
    const t_isPoint = String(total_alines).indexOf('.') !== -1;
    // 轴线小数部分的值
    let t_point_val = 0;
    if (t_isPoint) {
        t_point_val = total_alines - Math.floor(total_alines);
    }
    return {
        t_isPoint,
        t_point_val,
    };
}

// 获取数据气泡高度
function getBubble_height(props) {
    const { configData, forwardMax, minusMin } = props;
    const {
        font: {
            font_family: tip_fontFamily, // 字体的名称
            font_size: tip_fontSize, // 字体的大小
            font_style: tip_fontStyle, // 字体的样式
            text_decoration: tip_dec, // 字体的装饰
            font_weight: tip_fontWeight, // 字体的粗细
        },
        bubble: {
            // 气泡相关
            visible: DataBoxBG_Visible, // 气泡的显示隐藏
            // shape: DataBoxBG_Shape, // 气泡图形
            border: {
                line_width: DataBoxBG_BorderWidth, // 气泡的边框宽度
            },
        },
    } = configData.data;
    const DataBoxTextConfig = {
        style: {
            text: forwardMax || minusMin,
            fontSize: Math.abs(tip_fontSize) || 1,
            textLineHeight: Math.abs(tip_fontSize) || 1,
            fontFamily: tip_fontFamily,
            fontStyle: tip_fontStyle,
            fontWeight: tip_fontWeight,
            textFill: '#fff',
            textStroke: '#fff',
        },
    };

    const { width: Text_Width, height: Text_Height } = new zrender.Text(
        DataBoxTextConfig,
    ).getBoundingRect();
    const _DataBoxPadding = Text_Height / 6;
    const BoxWidth = Math.max(Text_Width + _DataBoxPadding * 2, Text_Height * 2);
    let BoxHeight = Text_Height + _DataBoxPadding * 2; // 气泡高度
    const limitValue = (per, limit) => (limit * per) / 100;
    const limitLineWidth = DataBoxBG_Visible
        ? limitValue(DataBoxBG_BorderWidth, Math.min(BoxWidth, BoxHeight))
        : 0;
    BoxHeight += limitLineWidth;

    return {
        bubble_width: BoxWidth,
        bubble_height: BoxHeight,
    };
}

// 图形区域裁切 自定义刻度
function coor_info(props) {
    const {
        rootW,
        dir,
        startX,
        startY,
        reserveY, // 气泡数据 预留高度
        y_axis_max_height,
        rulesX_ary,
        rulesY_ary,
        configData,
        zero_pos,
        forwardMax,
        minusMin,
        bubble_width,
        bubble_height,
    } = props;

    const {
        guide: {
            draw_coor: {
                scale: {
                    range: {
                        open: coor_open, // 量程开关
                    },
                },
            },
        },
        data: {
            visible: tipText_visible, // 文字的显示隐藏
            font: {
                font_size: tip_fontSize, // 字体的大小
            },
            baseline: tip_baseline, // 气泡的位置（上， 中， 下）
            bubble: {
                // 气泡相关
                visible: bubble_visible, // 气泡的显示隐藏
            },
        },
    } = configData;

    let s_x = 0; // x开始坐标
    let s_y = 0; // y开始坐标
    let y_h = y_axis_max_height + reserveY; // y轴线最大高度
    let x_w = 0; // x最大宽度

    if (dir) {
        s_x = startX;
        x_w = rootW - startX;

        // 如果开启自定义量程
        if (coor_open) {
            if (tipText_visible && tip_baseline === 'end') {
                if (forwardMax && minusMin >= 0) {
                    // 全正值
                    // s_y = startY + 1;
                } else if (forwardMax <= 0 && minusMin) {
                    // 全负值
                    s_y = rulesY_ary[0];
                    y_h -= 1;
                } else if (forwardMax && minusMin) {
                    // 正负值
                    // s_y = startY + 1;
                    y_h -= 2;
                }
            }
        }
    } else {
        y_h = zero_pos.y;
        s_x = rulesX_ary[0];
        x_w = rulesX_ary[rulesX_ary.length - 1] - rulesX_ary[0];
    }

    return {
        s_x,
        s_y,
        y_h,
        x_w,
    };
}

// x轴线的开始位置
function getStartX(props) {
    const {
        max,
        min,
        rootW,
        configData,
        dir,
        zoom,
        axis_value_ary,
        axis_label_ary,
        bubble_width,
        forwardMax,
        minusMin,
        larger,
    } = props;
    // 镜像坐标

    const {
        yaxis: {
            text_visible: y_label_visible, // 标签显隐，默认显示
            font: { font_family: y_font_family, font_size: y_font_size },
            title: {
                visible: y_title_visible, // 属性值：true(显示)，false（不显示，默认）
                width: y_t_w,
            },
        },
        draw_coor: {
            scale: {
                range: { open: scale_open },
            },
            division: {
                a_div: { visible: a_div_visible, line_length: a_div_line_length },
                b_div: { visible: b_div_visible, line_length: b_div_line_length },
            },
        },
    } = configData.guide;

    const {
        visible: tipText_visible, // 文字的显示隐藏
        font: {
            font_family: tip_fontFamily, // 字体的名称
            font_size: tip_fontSize, // 字体的大小
        },
        baseline: tip_baseline, // 气泡的位置（上， 中， 下）
        bubble: {
            // 气泡相关
            visible: bubble_visible, // 气泡的显示隐藏
        },
    } = configData.data;

    // y轴数据显示方式 （数值或百分比）
    const { type: analysis_type } = configData.analysis;

    let startX = 0;
    let reserveX = 0; // 数值预留宽度
    let y_title_width = 0;
    let y_label_width = 0;

    const paddingLR = 2 * zoom;

    // 轴标签最长的字符串
    let { get_maxStr: max_labelStr } = get_maxText(axis_label_ary);
    // 轴数值最长的字符串
    let { get_maxStr: max_ValStr } = get_maxText(axis_value_ary);

    // 柱形竖图百分比最长字符串为100%
    if (analysis_type === 'percent' && dir) {
        max_labelStr = '100%';
    }

    // 柱形竖图
    if (dir) {
        startX = 0;
        // 如果显示分度
        if (scale_open && a_div_visible) {
            if (b_div_visible && b_div_line_length - 0 > a_div_line_length - 0) {
                startX += b_div_line_length;
            } else {
                startX += a_div_line_length;
            }
        }
    } else {
        // 存在数值提示 和气泡的情况
        reserveX = 0;
        if (!scale_open) {
            if (tipText_visible && tip_baseline === 'end') {
                let _reserveX = getFontWidth(`${max_ValStr}`, tip_fontSize, tip_fontFamily);
                if (bubble_visible) {
                    _reserveX = bubble_width;
                    _reserveX += _reserveX * 0.2;
                }

                // 全正值
                if (forwardMax && minusMin >= 0) {
                    if (Number(max) === forwardMax) {
                        reserveX = _reserveX;
                    }
                } else if (forwardMax <= 0 && minusMin) {
                    // 全负值
                    if (Number(min) === minusMin) {
                        reserveX = _reserveX;
                    }
                } else if (forwardMax && minusMin) {
                    // 较大值是正值还是负值，正值取forwardMax, 负值取minusMin
                    let cur_large = Math.abs(larger.forward > 0 ? forwardMax : minusMin);
                    if (Number(max) === cur_large && Number(min) === -cur_large) {
                        reserveX = _reserveX * 2;
                    } else if (Number(max) === cur_large) {
                        reserveX = _reserveX;
                    } else if (Number(min) === -cur_large) {
                        reserveX = _reserveX;
                    }
                }
            }
        }
    }

    y_label_width = getFontWidth(`${dir ? max_ValStr : max_labelStr}`, y_font_size, y_font_family);
    y_title_width = (y_t_w / 100) * rootW * 0.2 + paddingLR * 2;
    // let x_value_width = getFontWidth(`${max_ValStr}`, x_font_size, x_font_family);

    if (y_label_visible) {
        startX += y_title_visible ? y_title_width + y_label_width : y_label_width;
    } else {
        startX += y_title_visible ? y_title_width : 0;
    }
    startX = startX > rootW / 3 ? rootW / 3 : startX + paddingLR;

    return {
        reserveX, // 预留位置
        startX, // x轴起始位置
        y_title_width, // y轴标题文字宽度
        y_label_width, // y轴标签的宽度
    };
}

// y轴线开始的位置
function getStartY(props) {
    const { configData, rootH, dir, bubble_height, forwardMax, minusMin } = props;

    const {
        yaxis: {
            text_visible: yaxis_visible, // y轴文字显示
            font: { font_size: yaxis_font_size },
        },
        draw_coor: {
            scale: {
                range: { open: scale_open },
            },
        },
    } = configData.guide;

    const {
        visible: tipText_visible, // 文字的显示隐藏
        font: {
            font_size: tip_fontSize, // 字体的大小
        },
        baseline: tip_baseline, // 气泡的位置（上， 中， 下）
        align: tip_align, // 文字对齐方式
        bubble: {
            // 气泡相关
            visible: bubble_visible, // 气泡的显示隐藏
        },
    } = configData.data;

    let startY = 0;
    // 数值提示 预留高度
    let reserveY = yaxis_visible ? yaxis_font_size / 2 : 0;

    if (dir) {
        if (tipText_visible && tip_baseline === 'end' && tip_align === 'end') {
            const _fontSize = tip_fontSize;
            // const _fontSize = tip_fontSize >= rootH * 0.1 ? rootH * 0.1 : tip_fontSize;

            let data_height = _fontSize + _fontSize * 0.2;
            if (bubble_visible) {
                // 气泡的内边距

                // const _bubbleH = bubble_height >= rootH * 0.1 ? rootH * 0.1 : bubble_height;
                const _bubbleH = bubble_height;

                data_height = _bubbleH;
            }
            if (data_height < reserveY) {
                data_height = reserveY;
            }
            reserveY = data_height;
        }

        // 全正值
        if (forwardMax && minusMin >= 0) {
            startY = reserveY;
        } else if (forwardMax <= 0 && minusMin) {
            // 全负值
            startY = yaxis_visible ? yaxis_font_size / 2 : 0;
            reserveY += startY;
        } else {
            // 正负都有值
            startY = reserveY;
            reserveY += startY;
        }
    } else {
        startY = 0;
    }

    return {
        startY,
        reserveY,
    };
}

// 获取轴值集合
function get_axisValue_ary(props) {
    const {
        _type,
        total_alines, // 均分线数量
        average_every_value,
        larger,
        forwardMax,
        minusMin,
        configData,
        t_isPoint,
    } = props;

    const {
        draw_coor: {
            scale: {
                range: {
                    open: coor_open, // 量程开关
                    max: coor_max, // 量程最大值
                    min: coor_min, // 量程最小值
                },
            },
        },
    } = configData.guide;

    // 数据显示方式 （数值或百分比）
    const { type: analysis_type } = configData.analysis;
    /** ---------------值集合------------------- */
    let len = total_alines;
    // 开启自定义刻度
    let coor_arr = [];
    if (coor_open && AXIOS_ALL_LIMIT.indexOf(_type) === -1) {
        for (let i = 0; i < len; i++) {
            let curText = 0;
            curText = coor_min + i * average_every_value;
            curText = handleDec(curText);
            // 刻度均分存在小数
            if (i === Math.ceil(len) - 1) {
                curText = coor_max;
            }

            coor_arr.push(curText);
        }
        coor_arr.reverse();
    }
    let axis_value_ary = [];
    for (let i = 0; i < len; i++) {
        let curText = '';
        if (coor_open && AXIOS_ALL_LIMIT.indexOf(_type) === -1) {
            curText = coor_arr[i];
        } else {
            // 全正值
            if (forwardMax && minusMin >= 0) {
                if (average_every_value > 0 && average_every_value < 1) {
                    const _forwardMax = handleDec(forwardMax, len, i);
                    const every_val = _forwardMax / (len - 1);
                    curText = handleDec(_forwardMax - every_val * i, len, i);
                    // console.log(_forwardMax - every_val * i);
                } else {
                    curText = forwardMax - average_every_value * i;
                }
            }
            // 全负值
            if (forwardMax <= 0 && minusMin) {
                const _minusMin = handleDec(minusMin, len, i);
                const every_val = _minusMin / (len - 1);
                // console.log(_minusMin, every_val);
                if (average_every_value > 0 && average_every_value < 1) {
                    curText = handleDec(forwardMax + every_val * i, len, i);
                    // console.log(curText);
                } else {
                    curText = forwardMax - average_every_value * i;
                }
            }
            // 正负都有
            if (forwardMax > 0 && minusMin < 0) {
                // 较大值为正
                if (larger.val > 0) {
                    if (average_every_value > 0 && average_every_value < 1) {
                        curText = handleDec(forwardMax - average_every_value * i);
                    } else {
                        curText = forwardMax - average_every_value * i;
                    }
                } else {
                    // 较大值为负
                    if (average_every_value > 0 && average_every_value < 1) {
                        curText = handleDec(minusMin + average_every_value * (len - 1 - i));
                    } else {
                        curText = minusMin + average_every_value * (len - 1 - i);
                    }
                }
            }
        }
        // 小于正负10坐标处理
        const absText = Math.abs(curText);
        if (absText < 10 && absText > 1) {
            curText = curText.toFixed(1) - 0;
        }

        curText = String(curText);
        if (analysis_type === 'percent') {
            curText += '%';
        }
        axis_value_ary.push(curText);
    }
    return axis_value_ary;
}

// tools-- 获取x轴--文字的高度
function getXAxisH(props) {
    const { rootH, configData, dir, axis_label_ary, x_axis_every_space } = props;
    // 字体配置
    const {
        xaxis: {
            text_visible,
            text_angle,
            word_break: {
                open: word_break_open, // 轴标签是否换行
                width: limit_width, // 调节范围0~100，百分比
                height: limit_height, // 调节范围0~100，百分比
            },

            font: { font_family, font_size },
        },
    } = configData.guide;

    // 数据显示方式 （数值或百分比）
    const { type: analysis_type } = configData.analysis;

    if (!text_visible || !font_size) return 0;

    let x_axis_H = font_size;

    if (!dir) {
        return x_axis_H;
    }

    const basic_w = x_axis_every_space;
    const basic_H = rootH * 0.25;
    const limit_w = (basic_w * limit_width) / 100;
    const limit_h = (basic_H * limit_height) / 100;
    if (word_break_open) {
        x_axis_H = limit_h;
    }

    // x轴字体旋转后的弧度
    let rad = get_Rad(text_angle);

    if (rad) {
        let { get_maxStr: maxStr } = get_maxText(axis_label_ary);
        if (analysis_type === 'percent' && !dir) {
            maxStr = '-100%';
        }

        // 文字宽度
        let fontW = 0;
        let fontH = 0;
        // 限制轴标签的宽高
        if (word_break_open && (limit_width || limit_height)) {
            fontW = limit_w || 0;
            fontH = limit_h || 0;
        } else {
            fontW = getFontWidth(maxStr, font_size, font_family);
            fontH = font_size;
        }

        //轴标签描边宽度
        const stroke_lineW = 2;
        // 获取字体旋转后各个顶点的位置
        let vt = getRotateWH(text_angle, fontW + stroke_lineW * 2, fontH + stroke_lineW * 2);
        let { minY, maxY } = vt;
        x_axis_H = maxY - minY;
        x_axis_H = x_axis_H > basic_H ? basic_H : x_axis_H;
    }
    return x_axis_H;
}

// x轴标题的占位高度
function getX_titleH(props) {
    const { maxHeight: rootH, maxWidth: rootW, chartData: pData, configData, dir, zoom } = props;
    // 字体配置
    const {
        xaxis: {
            title: {
                visible,
                width: title_width,
                height: title_height,
                background: {
                    border: {
                        line_width: title_line_width, // 边框的宽度
                    },
                },
            },
        },
    } = configData.guide;

    const rectW = (title_width / 100) * rootW;
    // 包围盒的高度
    const rectH = (title_height / 100) * rootH * 0.1;
    // 较小的边作为边框的基数
    // const borderMin = Math.min(rectW, rectH);
    // 边框的宽度
    // const borderW = (title_line_width / 100) * borderMin;
    // x轴标题的高度
    let x_axis_title_H = 0;
    if (visible) {
        x_axis_title_H = (title_height / 100) * rootH * 0.2;
    }
    return x_axis_title_H;
}

/**
 * 轴标签文字旋转后的占的宽高
 * @param {number} angle  角度  -90 -- 90之间的角度
 * @param {number} width  字体的宽度
 * @param {number} height 字体的高度
 */
export function getRotateWH(angle, width, height) {
    let a = Number(angle);
    // zrender 角度--- 负值为顺时针 正值为逆时针, 修正角度
    a = -a;
    if (a > 90 || a < -90) {
        a = 0;
    }
    if (typeof a !== 'number') return;
    // 计算对角线的长度
    let dl = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    // 对角线一半长度
    let rl = dl / 2;
    // 水平线和对角线的夹角
    let b = Math.atan2(height, width) / (Math.PI / 180);

    /**
     * 计算旋转时，相对于原点，四个顶点的坐标
     * 把文字当做矩形，
     * 逆时针旋转 --- a，
     * 对角线和水平辅助线夹角为---- b,
     * 对角线的一半长度为 ---- rl
     * 四个顶点 --- 坐标
     * rt 右上角
     * rb 右下角
     * lt 左上角
     * lb 左下角
     * 0--90 之间用以右上角 rt 为旋转点， -90---0 之间以左上角 lt 为旋转点
     */

    let rt = 0;
    let lt = 0;
    let rb = 0;
    let lb = 0;

    // 负值 左上角为圆心
    let _a = Math.abs(a);
    if (a > -90 && a < 0) {
        // console.log(-a + b);
        lt = {
            x: 0,
            y: 0,
        };
        rt = {
            x: Math.cos((_a * Math.PI) / 180) * width,
            y: Math.sin((_a * Math.PI) / 180) * width,
        };
        lb = {
            x: Math.cos((b * Math.PI) / 180) * height,
            y: Math.sin((b * Math.PI) / 180) * height,
        };
        rb = {
            x: Math.cos(((_a + b) * Math.PI) / 180) * dl,
            y: Math.sin(((_a + b) * Math.PI) / 180) * dl,
        };
        // rt = {
        //     x: Math.cos((_a * Math.PI) / 180) * dl,
        //     y: Math.sin((_a * Math.PI) / 180) * dl,
        // };
        // lb = {
        //     x: Math.cos(((90 - 2 * b - _a) * Math.PI) / 180) * height,
        //     y: Math.sin(((90 - 2 * b - _a) * Math.PI) / 180) * height,
        // };
        // rb = {
        //     x: Math.cos(((_a + b) * Math.PI) / 180) * dl,
        //     y: Math.sin(((_a + b) * Math.PI) / 180) * dl,
        // };
    } else if (a > 0 && a < 90) {
        // 右上角为圆心
        _a = 180 + _a;
        rt = {
            x: 0,
            y: 0,
        };
        lt = {
            x: Math.cos((_a * Math.PI) / 180) * width,
            y: Math.sin((_a * Math.PI) / 180) * width,
        };
        lb = {
            x: Math.cos(((_a + b) * Math.PI) / 180) * dl,
            y: Math.sin(((_a + b) * Math.PI) / 180) * dl,
        };
        rb = {
            x: Math.cos((_a * Math.PI) / 180) * height,
            y: Math.sin((_a * Math.PI) / 180) * height,
        };
    } else if (a === 0) {
        lt = {
            x: 0,
            y: 0,
        };
        rt = {
            x: width,
            y: 0,
        };
        lb = {
            x: 0,
            y: height,
        };
        rb = {
            x: width,
            y: height,
        };
    } else if (a === 90 || a === -90) {
        lt = {
            x: 0,
            y: 0,
        };
        rt = {
            x: height,
            y: 0,
        };
        lb = {
            x: 0,
            y: width,
        };
        rb = {
            x: height,
            y: width,
        };
    }

    // 计算y轴上的最高点和最低点
    let maxY = 0;
    let minY = 0;
    [rt, rb, lt, lb].forEach((item, index) => {
        if (item.y > maxY) {
            maxY = item.y;
        }
        if (item.y < minY) {
            minY = item.y;
        }
    });

    // 计算x轴上的最大值和最小值
    let maxX = 0;
    let minX = 0;
    [rt, rb, lt, lb].forEach((item, index) => {
        if (item.x > maxX) {
            maxX = item.x;
        }
        if (item.x < minX) {
            minX = item.x;
        }
    });

    // console.log('lt:', lt);
    // console.log('lb:', lb);
    // console.log('rt:', rt);
    // console.log('rb:', rb);
    // 返回四个角的坐标，和坐标里的最大值和最小值
    return {
        rt, // 右上角坐标
        rb,
        lt,
        lb,
        maxX,
        minX,
        maxY,
        minY,
        dl, // 对角线
    };
}

// 根据数值的正负来计算刻度线数量,较大 和 较小 的信息，还有 坐标原点的序列
function getDividingLines(props, largerAlines = 2) {
    const { y_axis_max_height, chartData, configData, dir, rootW, max, min } = props;

    const {
        _type,
        _mirror_axes,
        guide: {
            draw_coor: {
                scale: {
                    range: {
                        open: coor_open, // 量程开关
                        max: coor_max, // 量程最大值
                        min: coor_min, // 量程最小值
                    },
                },
                division: {
                    a_div: { visible: a_div_visible, value: a_div_value, num: a_div_num },
                },
            },
        },
    } = configData;
    // 数据显示方式 （数值/百分比）
    const { type: analysis_type } = configData.analysis;
    const { perBaseSeries, perBaseCategory } = chartData;
    const x_axis_width = rootW - 80;

    // y轴均分线的总数量
    let total_alines = 0;
    let zeroIndex = 0;
    let forwardMax = 0; // 正方向最大值
    let minusMin = 0; // 负方向最小值
    let average_every_value = 0; // 轴刻度每段的值

    let act_zeroIndex = null; // 自定义刻度 零轴的真实位置
    let act_addLines = 0; // 自定义刻度 最小值到0值需要增加轴线数量

    // 获取系列数据中的最小值和最大值
    let curMax = null;
    let curMin = null;

    if (max === 0 && min === 0) {
        curMax = 1;
        curMin = 0;
    } else {
        if (analysis_type === 'normal') {
            if (SUPER_VALUE_TYPE.indexOf(_type) !== -1) {
                [curMin, curMax] = getStackedRanges(chartData);
            } else {
                curMax = getY_max(chartData);
                curMin = getY_min(chartData);
            }
        } else {
            // 所有系列中百分比的最大值和最小值
            if (SUPER_VALUE_TYPE.indexOf(_type) !== -1) {
                const { max, min } = getCategory_max_min(perBaseCategory);
                curMax = Math.round(max);
                curMin = Math.round(min);
                // console.log(curMax, curMin);
            } else {
                const { max, min } = getSeries_max_min(perBaseSeries);
                curMax = max;
                curMin = min;
            }
        }
    }

    if (coor_open && AXIOS_ALL_LIMIT.indexOf(_type) === -1) {
        curMax = coor_max;
        curMin = coor_min;
    }
    // 河流图全正值或者有正负值，坐标轴强制0为最小值
    if (_type === 'river' && (curMin >= 0 || (curMax > 0 && curMin < 0))) {
        curMin = 0;
    }

    /** ------------全正值或全负值---------------------------- */
    if (curMin >= 0 || curMax <= 0) {
        // 获取均分线数量
        if (coor_open && AXIOS_ALL_LIMIT.indexOf(_type) === -1) {
            if (curMin >= 0 && curMax > 0) {
                forwardMax = analysis_type === 'percent' ? 100 : curMax;
            }

            if (curMax <= 0 && curMin < 0) {
                minusMin = analysis_type === 'percent' ? -100 : curMin;
            }

            if (a_div_visible && a_div_value > 0) {
                // 如果大分度取值超过了 最大值和最小值的差值
                average_every_value = a_div_value;
                if (a_div_value > coor_max - coor_min) {
                    average_every_value = coor_max - coor_min;
                }
                average_every_value *= coor_max - coor_min > 0 ? 1 : -1;
                // 按照分度值轴可以分成多少段
                let sections =
                    coor_max - coor_min < 0 ? 0 : (coor_max - coor_min) / average_every_value;
                // console.log(sections, average_every_value);
                if (_type === 'jade') {
                    // sections = a_div_num;
                    act_addLines = a_div_num;
                } else {
                    sections = (sections * 10) / 10;
                    total_alines = sections + 1;
                    // 自定义量程 最大值到0 可以分成的轴线数量
                    if (coor_min > 0) {
                        act_addLines = coor_min / average_every_value;
                    }

                    if (coor_max < 0) {
                        act_addLines = Math.abs(coor_max) / average_every_value;
                    }
                }
            } else {
                total_alines = getAverageLine(dir ? y_axis_max_height : x_axis_width) + 1;
                average_every_value = (coor_max - coor_min) / (total_alines - 1);

                if (coor_min > 0) {
                    act_addLines = coor_min / average_every_value;
                }

                if (coor_max < 0) {
                    act_addLines = Math.abs(coor_max) / average_every_value;
                }
            }
        } else {
            forwardMax = curMax;
            // 按照均分规则划分线的数量, 加上原点轴线
            total_alines = getAverageLine(dir ? y_axis_max_height : x_axis_width) + 1;
        }

        // 获取零点位置
        if (curMin >= 0 && curMax > 0) {
            // 柱形图 0点坐标在最后一根
            if (dir) {
                zeroIndex = Math.ceil(total_alines) - 1;
                if (act_addLines) {
                    act_zeroIndex = zeroIndex + act_addLines;
                }
            } else {
                // 条形图 0点坐标第一根
                zeroIndex = !_mirror_axes ? 0 : Math.ceil(total_alines) - 1;
                if (act_addLines) {
                    act_zeroIndex = !_mirror_axes
                        ? zeroIndex - act_addLines
                        : zeroIndex + act_addLines;
                }
            }
            // 如果没有开启量程 或者 开启了量程和大分度但大分度值为0
            if (
                !coor_open ||
                (coor_open && a_div_visible && a_div_value < 0) ||
                (coor_open && AXIOS_ALL_LIMIT.indexOf(_type) !== -1)
            ) {
                forwardMax = analysis_type === 'percent' ? 100 : roundUp(curMax);
                average_every_value = forwardMax / (total_alines - 1);
            }
        }
        // 获取零点位置
        if (curMax <= 0 && curMin < 0) {
            // 柱形图 0点坐标在最后一根
            if (dir) {
                zeroIndex = 0;
                if (act_addLines) {
                    act_zeroIndex = zeroIndex - act_addLines;
                }
            } else {
                // 条形图 0点坐标再第一根
                zeroIndex = !_mirror_axes ? Math.ceil(total_alines) - 1 : 0;
                if (act_addLines) {
                    act_zeroIndex = !_mirror_axes
                        ? zeroIndex + act_addLines
                        : zeroIndex - act_addLines;
                }
            }
            // 如果没有开启量程 或者 开启了量程和大分度但大分度值为0
            if (!coor_open || (coor_open && a_div_visible && a_div_value < 0)) {
                minusMin = analysis_type === 'percent' ? -100 : roundUp(curMin);
                average_every_value = Math.abs(minusMin) / (total_alines - 1);
            }
        }

        return {
            total_alines,
            larger: { val: curMax },
            smaller: { val: curMin },
            average_every_value,
            forwardMax, // 正向最大值
            minusMin, // 负向最小值
            zeroIndex,
            act_zeroIndex,
        };
    }

    /** ------------存在正负值---------------------------- */
    // 对比正负 绝对值的最大值
    const abs_max = Math.abs(curMax);
    const abs_min = Math.abs(curMin);

    // 较大值的信息
    let larger = {
        val: curMax,
        abs: Math.abs(curMax),
        forward: 1, // 正向
        alines: largerAlines, // 均分线数量(默认较大方的均线数量为2)
    };
    // 较小值的信息
    let smaller = {
        val: curMin,
        abs: Math.abs(curMin),
        forward: -1, // 负向
        alines: 1, // 均分线数量(默认较小方的均线数量为1)
    };

    // 计算坐标系正方向的最大值
    let _forwardMax = null;
    let _minusMin = null;
    let roundUp_larger = null; // 向上取值 较大的值

    if (coor_open && AXIOS_ALL_LIMIT.indexOf(_type) === -1) {
        _minusMin = curMin;
        let sections = 0;
        if (a_div_visible && a_div_value > 0) {
            // 如果大分度取值超过了 最大值和最小值的差值
            if (a_div_value > coor_max - coor_min) {
                average_every_value = coor_max - coor_min;
            } else {
                average_every_value = a_div_value;
            }
        } else {
            // 没有大分度时
            average_every_value = (abs_min + abs_max) / 2;
        }

        // 实际均分线总数 固定分度不能均分 可能是小数，
        total_alines = (coor_max - coor_min) / average_every_value;
        // 均分线数量，向取整方便计算零轴的位置
        sections = Math.ceil((coor_max - coor_min) / average_every_value);

        sections += 1;
        total_alines += 1;

        // 零轴的序列，整数就在均分线上, 小数不再均分线上
        zeroIndex = dir
            ? sections - abs_min / average_every_value - 1
            : abs_min / average_every_value;
        act_zeroIndex = zeroIndex = _mirror_axes && !dir ? sections - 1 - zeroIndex : zeroIndex;

        let smaller_lines = a_div_value ? Math.floor(abs_min / a_div_value) : 1;
        smaller = {
            val: curMin,
            abs: Math.abs(curMin),
            forward: -1, // 负向
            alines: smaller_lines,
        };

        // 正值一方的均线数量
        let larger_lines = sections - smaller_lines;
        _forwardMax = curMax;

        larger = {
            val: _forwardMax,
            abs: Math.abs(_forwardMax),
            forward: 1, // 负向
            alines: larger_lines,
        };
        // 百分比展示时正方向的值
        if (analysis_type === 'percent') {
            _forwardMax = curMax > 50 ? 100 : 50;
            average_every_value = _forwardMax / larger.alines;
            roundUp_larger = 100;
        }
        roundUp_larger = Math.round(roundUp(larger.abs));
    } else {
        // 如果最大值 和 最小值 绝对值 不相等
        if (larger.abs !== smaller.abs) {
            if (analysis_type === 'percent') {
                smaller.alines = smaller.abs > 50 ? 2 : 1;
                larger.alines = larger.abs > 50 ? 2 : 1;

                total_alines = larger.alines + smaller.alines + 1;
            } else {
                if (abs_max < abs_min) {
                    larger.val = curMin;
                    larger.abs = Math.abs(curMin);
                    larger.forward = -1;

                    smaller.val = curMax;
                    smaller.abs = Math.abs(curMax);
                    smaller.forward = 1;
                }
                // 较大一方作为参照 用较大一方的一半 和 较小一方做对比
                if (larger.abs / 2 >= smaller.abs) {
                    smaller.alines = Math.ceil(larger.alines / 2);
                    // 均分刻度线的总数量 = 较大方刻度线数量 + 较小方刻度线数量 + 1
                    total_alines = larger.alines + smaller.alines + 1;
                } else {
                    // 如果较大方的一半 小于 较小一方那么,保持双方数量相等， 再加上中间的 x轴
                    smaller.alines = larger.alines;
                    total_alines = larger.alines * 2 + 1;
                }
            }
        } else {
            total_alines = larger.alines * 2 + 1;
        }

        // 判断正方向 均分线的数量得到 原点0坐标的序列
        const _zeroIndex = larger.forward === 1 ? larger.alines : smaller.alines;

        // 非镜像的条形图原点 坐标序列 从右往左计算
        if (!dir) {
            zeroIndex = _mirror_axes ? _zeroIndex : total_alines - 1 - _zeroIndex;
        } else {
            zeroIndex = _zeroIndex;
        }

        // 百分比展示时正方向的值
        if (analysis_type === 'percent') {
            _forwardMax = curMax > 50 ? 100 : 50;
            _minusMin = curMin < -50 ? -100 : -50;
            average_every_value = _forwardMax / larger.alines;
            roundUp_larger = 100;
        } else {
            _forwardMax = roundUp(larger.forward === 1 ? larger.val : smaller.val);
            _minusMin = roundUp(larger.forward === -1 ? larger.val : smaller.val);
            // 较大方位负值，正向取值为负值的一半
            if (larger.forward === -1) {
                if (larger.abs / 2 >= smaller.abs) {
                    _forwardMax = roundUp(larger.abs) / 2;
                }
            }
            // 计算均分线的每段对应的绝对值 =  较大的一方的绝对值 / 较大一方的线的数量
            average_every_value = Math.round(roundUp(larger.abs)) / larger.alines;
            roundUp_larger = Math.round(roundUp(larger.abs));
        }
    }

    // console.log('较大：', larger);
    // console.log('较小:', smaller);
    // console.log('均分线数量:', total_alines);
    // console.log(dir);
    // console.log('正负值零点位置:', zeroIndex);
    // console.log('正方向最大值：', _forwardMax);
    return {
        total_alines, // 均分线的数量
        larger, // 较大一方的信息
        smaller, // 较小一方的信息
        zeroIndex, // 坐标原点的序列
        average_every_value, // 均分线每段对应的值
        forwardMax: _forwardMax, // 坐标系正方向的最大值
        minusMin: _minusMin, // 坐标系负方向的最小值
        act_zeroIndex, // 自定义情况下零轴的位置
        roundUp_larger, // 较大一方的向上取整的值
    };
}

// (柱形竖图)y轴 -- 均分刻度线的坐标
function v_getYAxis_rulesY_ary(props) {
    let {
        y_axis_max_height,
        total_alines,
        forwardMax,
        minusMin,
        startY,
        reserveY,
        t_isPoint,
        t_point_val,
        configData,
    } = props;
    const {
        yaxis: {
            font: { font_size: yaxis_font_size },
        },
    } = configData.guide;
    // y轴均分线数量
    let len = total_alines;
    // 计算平均间隔高度= 轴高度 -减去上下预留的高度,
    let space = y_axis_max_height / (len - 1);
    // 判断均分线有没有小数，划分刻度
    let rulesY_ary = [startY];

    // 如果是全负值原点坐标预留空间
    const zero_reserveY = forwardMax ? 0 : yaxis_font_size / 2;

    if (forwardMax) {
        if (t_isPoint) {
            let first_space = t_point_val * space;
            rulesY_ary[1] = rulesY_ary[0] + first_space;
        } else {
            rulesY_ary[1] = rulesY_ary[0] + space;
        }

        for (let i = 2; i < len; i++) {
            let posY = rulesY_ary[1] + (i - 1) * space;
            rulesY_ary.push(posY);
        }
    } else {
        // 全负值
        if (t_isPoint) {
            let first_space = t_point_val * space;
            rulesY_ary[1] = rulesY_ary[0] + first_space;
        } else {
            rulesY_ary[1] = rulesY_ary[0] + space;
        }
        for (let i = 2; i < len; i++) {
            let posY = rulesY_ary[1] + (i - 1) * space;
            rulesY_ary.push(posY);
        }
    }
    return {
        zero_reserveY,
        rulesY_ary, // y轴分段坐标集合
        y_axis_every_space: space, // y轴每段间隔
    };
}

// (横条形图)y轴 --均分刻度线
function h_getYAxis_rulesY_ary(props) {
    let { y_axis_max_height, chartData, configData, rootH, startY } = props;

    const {
        padding: { top: guide_top, bottom: guide_bottom },
    } = configData.guide;

    const {
        general: {
            graph_width, // 柱子宽度
        },
    } = configData;

    // y轴数据 数量
    let { maxData_len } = getData_maxLen(chartData);
    let len = maxData_len;

    // 边距范围是 overflow_t_per 到 20% 宽度
    /** -----------------------计算溢出边距 start------------------------------------------ */
    // 柱子宽度百分比
    const bar_w_per = graph_width / 100;
    // 轴线溢出公式(百分比) = （bar_w_per -1）/(2*(bar_w_per-1+a))
    const overflow_t_per = (bar_w_per - 1) / (2 * (bar_w_per - 1 + len));
    const overflow_b_per = (bar_w_per - 1) / (2 * (bar_w_per - 1 + len));

    // 上侧占位
    let gTop_per = guide_top / 100;
    // 下侧占位
    let gBottom_per = guide_bottom / 100;

    // 实际溢出的百分比为 (20% - overflow_l - per ) * gTop_per;
    // 默认上边距
    let gT = (overflow_t_per + gTop_per * (0.2 - overflow_t_per)) * rootH;
    // 默认下边距
    let gB = (overflow_b_per + gBottom_per * (0.2 - overflow_b_per)) * rootH;

    /** -----------------------计算溢出边距 end------------------------------------------ */

    // y轴的起始位置
    let y_start = gT + startY;
    // y轴的结束位置
    let y_end = y_axis_max_height - gB;

    // 等分距离
    let every_average = (y_end - y_start) / len;
    // 等分距离的一半
    let ev_half = every_average / 2;

    // y轴的分段集合
    let rulesY_ary = [];
    rulesY_ary.push(y_start + ev_half);
    for (let i = 1; i < len; i++) {
        let posY = y_start + ev_half + i * every_average;
        rulesY_ary.push(posY);
    }
    // 均分线之间的间距
    const y_axis_every_space = len > 1 ? every_average : y_start + ev_half;
    return {
        y_axis_every_space,
        rulesY_ary, // y轴分段坐标集合
    };
}

// (横条形图)x轴 --均分刻度线
function h_getXAxis_rulesX_ary(props) {
    const {
        rootW,
        configData,
        total_alines,
        forwardMax, // 正向最大值
        minusMin, // 负向最大值
        startX,
        reserveX, // 数值提示气泡x轴预留空间
        t_point_val, // 轴线小数部分
    } = props;
    const axisX = configData?.guide?.xaxis || null;
    if (!axisX) return 0;
    // 镜像坐标
    const {
        data: {
            font: {
                font_size: tip_fontSize, // 字体的大小
            },
        },
        _mirror_axes,
    } = configData;
    let rulesX_ary = []; // 刻度坐标集合
    let len = total_alines;
    let zero_reserveX = 0;
    let x_str_space = 0; // 轴刻度最后或者开始位置字体的预留空间
    let space = (rootW - x_str_space - reserveX - startX) / (len - 1);

    // 存在正负值 而且 也存在数值提示占位时
    if (reserveX) {
        // 全正值
        if (forwardMax && minusMin >= 0) {
            space = (rootW - x_str_space / 2 - reserveX - startX) / (len - 1);
        } else if (forwardMax <= 0 && minusMin) {
            // 全负值
            space = (rootW - x_str_space / 2 - reserveX - startX) / (len - 1);
            zero_reserveX = tip_fontSize || 14;
        } else if (forwardMax && minusMin) {
            space = (rootW - x_str_space / 2 - reserveX - startX) / (len - 1);
        }
    }

    // x轴每段的距离
    let posX = 0;
    if (!forwardMax) {
        // 如果存均分线有小数部分
        if (t_point_val) {
            if (!_mirror_axes) {
                rulesX_ary[0] = startX + x_str_space / 2 + reserveX;
                rulesX_ary[1] = rulesX_ary[0] + t_point_val * space;

                for (let i = 2; i < len; i++) {
                    posX = rulesX_ary[1] + (i - 1) * space;
                    rulesX_ary.push(posX);
                }
            } else {
                rulesX_ary[0] = rootW - startX - x_str_space / 2 - reserveX;
                rulesX_ary[1] = rulesX_ary[0] - t_point_val * space;
                for (let i = 2; i < len; i++) {
                    posX = rulesX_ary[1] - (i - 1) * space;
                    rulesX_ary.push(posX);
                }
                rulesX_ary.reverse();
            }
        } else {
            for (let i = 0; i < len; i++) {
                if (_mirror_axes) {
                    posX = rootW - startX - x_str_space / 2 - reserveX - i * space;
                } else {
                    posX = startX + x_str_space / 2 + reserveX + i * space;
                }
                rulesX_ary.push(posX);
            }
            if (_mirror_axes) {
                rulesX_ary.reverse();
            }
        }
    } else {
        if (t_point_val) {
            if (!_mirror_axes) {
                for (let i = 0; i < len; i++) {
                    if (i === Math.ceil(len) - 1) {
                        posX = startX + x_str_space / 2 + (i - 1 + t_point_val) * space;
                    } else {
                        posX = startX + x_str_space / 2 + i * space;
                    }
                    rulesX_ary.push(posX);
                }
            } else {
                for (let i = 0; i < len; i++) {
                    if (i === Math.ceil(len) - 1) {
                        posX = rootW - startX - x_str_space / 2 - (i - 1 + t_point_val) * space;
                    } else {
                        posX = rootW - startX - x_str_space / 2 - i * space;
                    }
                    rulesX_ary.push(posX);
                }
                rulesX_ary.reverse();
            }
        } else {
            for (let i = 0; i < len; i++) {
                if (_mirror_axes) {
                    posX = rootW - startX - x_str_space / 2 - i * space;
                } else {
                    posX = startX + x_str_space / 2 + i * space;
                }
                rulesX_ary.push(posX);
            }
            if (_mirror_axes) {
                rulesX_ary.reverse();
            }
        }
    }
    return {
        zero_reserveX, // 针对全负值0点坐标的预留位置
        rulesX_ary,
        x_axis_every_space: space, // x轴间隔
    };
}

// (柱形竖图)x轴 --均分刻度线
function v_getXAxis_rulesX_ary(props) {
    const { chartData, configData, rootW, startX, axis_label_ary } = props;
    // 坐标系镜像开关
    const { _mirror_axes, _type } = configData;
    const {
        padding: { left: guide_left, right: guide_right },
    } = configData.guide;

    let {
        general: {
            graph_width, // 柱子宽度
        },
    } = configData;

    // 查看 直方图等图形 x 轴上是否有，不能均分的百分比
    const { x_axios_divide_per } = chartData;

    // 获取数据量最多的一组数据
    let { maxData_len } = getData_maxLen(chartData);
    let len = null;

    if (SPECIAL_TYPE.indexOf(configData._type) !== -1) {
        len = axis_label_ary.length;
    } else {
        len = maxData_len;
        // 遇到直方图这类 x轴也是数据的情况，轴可能不能均分
        if (x_axios_divide_per) {
            len = maxData_len - 1 + x_axios_divide_per;
        }
    }

    // 边距范围是 overflow_l_per 到 20% 宽度
    /** -----------------------计算溢出边距 start------------------------------------------ */
    let bar_w_per = 0;
    // 柱子宽度百分比
    if (_type === 'v_stacked' || _type === 'v_bar' || _type === 'boxplot') {
        bar_w_per = graph_width / 100;
    }

    // 轴线溢出公式(百分比) = （bar_w_per -1）/(2*(bar_w_per-1+a))
    const overflow_l_per = (bar_w_per - 1) / (2 * (bar_w_per - 1 + len));
    const overflow_r_per = (bar_w_per - 1) / (2 * (bar_w_per - 1 + len));

    // 左侧占位
    let gLeft_per = guide_left / 100;
    // 右侧占位
    let gRight_per = guide_right / 100;

    // 实际溢出的百分比为 (20% - overflow_l_per ) * gLeft_per;
    // 默认左边距
    let gL = (overflow_l_per + gLeft_per * (0.2 - overflow_l_per)) * rootW;
    // 默认右边距
    let gR = (overflow_r_per + gRight_per * (0.2 - overflow_r_per)) * rootW;

    /** -----------------------计算溢出边距 end------------------------------------------ */
    // x轴的起始位置()
    let x_statX = startX + gL;
    // x轴的结束位置
    let x_endX = rootW - gR;

    if (_mirror_axes) {
        x_statX = gL;
        x_endX = rootW - startX - gR;
    }

    // 等分距离
    let every_average = (x_endX - x_statX) / len;

    // 等分距离的一半
    let ev_half = every_average / 2;

    // 根据等分距离，计算轴线的坐标
    let rulesX_ary = [];

    if (!_mirror_axes) {
        rulesX_ary.push(x_statX + ev_half);
        for (let i = 1; i < len; i++) {
            let posX = x_statX + ev_half + every_average * i;
            if (x_axios_divide_per && i === parseInt(len)) {
                rulesX_ary.push(posX - every_average * (1 - x_axios_divide_per));
            } else {
                rulesX_ary.push(posX);
            }
        }
    } else {
        for (let i = len - 1; i > 0; i--) {
            let posX = x_endX - ev_half - every_average * i;
            rulesX_ary.push(posX);
        }
        rulesX_ary.push(x_endX - ev_half);
    }

    // 均分线之间的间距
    const x_axis_every_space = len > 1 ? every_average : x_statX + ev_half;

    return {
        x_axis_every_space,
        rulesX_ary,
    };
}

// 坐标系原点的坐标
function getZeroPos(params) {
    const {
        configData,
        rootW,
        startX,
        startY,
        rulesY_ary,
        rulesX_ary,
        zeroIndex,
        minusMin, // 负向最小值
        forwardMax, // 正向最大值
        act_zeroIndex, // 自定义量程 零轴位置
        y_axis_max_height,
        dir,
        y_axis_every_space,
        x_axis_every_space,
    } = params;
    const { _mirror_axes } = configData;
    let zero_pos = { x: 0, y: 0 };
    let act_zero_pos = { x: null, y: null };

    // console.log(zeroIndex, act_zeroIndex);

    if (dir) {
        // x轴开始位置
        zero_pos.x = _mirror_axes ? rootW - startX : startX;
        // 判断zeroIndex 为小数
        if (String(zeroIndex).indexOf('.') !== -1) {
            zero_pos.y = getInit_per(zeroIndex, rulesY_ary, y_axis_every_space);
        } else {
            zero_pos.y = rulesY_ary.filter((item, index) => index === zeroIndex)[0];
        }

        // 自定义量程真实零轴
        if (act_zeroIndex && act_zeroIndex !== zeroIndex) {
            act_zero_pos.x = zero_pos.x;
            act_zero_pos.y = zero_pos.y + y_axis_every_space * (act_zeroIndex - zeroIndex);
        } else {
            act_zero_pos = zero_pos;
        }
    } else {
        zero_pos.y = startY + y_axis_max_height;
        if (String(zeroIndex).indexOf('.') !== -1) {
            zero_pos.x = getInit_per(zeroIndex, rulesX_ary, x_axis_every_space);
        } else {
            zero_pos.x = rulesX_ary.filter((item, index) => index === zeroIndex)[0];
        }
        // 自定义量程真实零轴
        if (act_zeroIndex && act_zeroIndex !== zeroIndex) {
            act_zero_pos.x = zero_pos.x;
            act_zero_pos.x = zero_pos.x + x_axis_every_space * (act_zeroIndex - zeroIndex);
        } else {
            act_zero_pos = zero_pos;
        }
    }

    return {
        zero_pos,
        act_zero_pos,
    };

    /**
     *零点序列  整数或小数
     * @param {float} zeroIndex 零轴位置浮点数
     * @param {*} ary 坐标y轴集合
     * @returns
     */
    function getInit_per(zeroIndex, ary, space) {
        // 检索和零轴最近的两个轴线
        let larger_index = Math.ceil(zeroIndex);
        let smaller_index = Math.floor(zeroIndex);

        let larger_line = ary.filter((item, index) => index === larger_index)[0];
        let smaller_line = ary.filter((item, index) => index === smaller_index)[0];
        // 零轴所在轴线的间距
        // let space = Math.abs(larger_line - smaller_line);

        let per = larger_index - zeroIndex;
        let act_pos = larger_line - space * per;
        return act_pos;
    }
}

// 单位像素计算
function getPerUnit(params) {
    const {
        configData,
        rulesY_ary,
        rulesX_ary,
        larger,
        forwardMax,
        roundUp_larger,
        minusMin,
        zero_pos,
        act_zero_pos,
        y_axis_every_space, // y轴均分线高度(像素距离)
        x_axis_every_space, // x轴均分线高度(像素距离)
        average_every_value, // 轴均分值
        dir,
    } = params;

    const { _mirror_axes } = configData;
    const {
        draw_coor: {
            scale: {
                range: {
                    open: coor_open, // 量程开关
                    max: coor_max, // 量程最大值
                    min: coor_min, // 量程最小值
                },
            },
        },
    } = configData.guide;

    let fMax = forwardMax;
    let mMin = minusMin;
    if (coor_open) {
        fMax = coor_max;
        mMin = coor_min;
    }

    let forward_h = 1;
    let pixelRatioValue = 1;
    // 值轴最顶端到 零轴的最大偏移量 px
    let slotOffset = 1;
    let zero_pos_y = act_zero_pos.y ? act_zero_pos.y : zero_pos.y;
    let zero_pos_x = act_zero_pos.x ? act_zero_pos.x : zero_pos.x;

    // 柱形图
    if (dir) {
        pixelRatioValue = y_axis_every_space / average_every_value;

        // 全正值全负值
        if ((fMax && mMin >= 0) || (fMax <= 0 && mMin)) {
            slotOffset = zero_pos_y - rulesY_ary[0];
        }
        // 正负都有
        if (fMax > 0 && mMin < 0) {
            // 较大一方为正数
            if (larger.val > 0) {
                forward_h = zero_pos_y - rulesY_ary[0];
                slotOffset = forward_h;
            } else {
                forward_h = zero_pos_y - rulesY_ary[0];
                slotOffset = forward_h;
            }
        }
    } else {
        // 条形图
        pixelRatioValue = x_axis_every_space / average_every_value;
        // 全正值 全负值
        if ((fMax && mMin >= 0) || (fMax <= 0 && mMin)) {
            slotOffset = !_mirror_axes
                ? rulesX_ary[rulesX_ary.length - 1] - zero_pos_x
                : zero_pos_x - rulesX_ary[0];
        }

        // 正负都有
        if (fMax > 0 && mMin < 0) {
            // 较大一方为正数
            if (larger.val > 0) {
                slotOffset = !_mirror_axes
                    ? rulesX_ary[rulesX_ary.length - 1] - zero_pos_x
                    : zero_pos_x - rulesX_ary[0];
            } else {
                slotOffset = !_mirror_axes
                    ? zero_pos_x - rulesX_ary[0]
                    : rulesX_ary[rulesX_ary.length - 1] - zero_pos_x;
            }
        }
    }
    return {
        pixelRatioValue,
        slotOffset, // 值轴最顶端到 零轴的最大偏移量 px
    };
}
// 整合轴标签的坐标列表
function getPosList(props) {
    const { chartData, configData, rulesX_ary, rulesY_ary, zero_pos, act_zero_pos, dir } = props;
    // 镜像坐标系（左右翻转）
    const { _mirror_axes } = configData;
    // 类别列表
    const { categoryList } = chartData;
    let len = categoryList.length;
    let positionList = [];

    let zero_pos_y = act_zero_pos.y !== null ? act_zero_pos.y : zero_pos.y;
    let zero_pos_x = act_zero_pos.x !== null ? act_zero_pos.x : zero_pos.x;

    for (let i = 0; i < len; i++) {
        let item = categoryList[i];
        if (dir) {
            item = _mirror_axes ? categoryList[len - 1 - i] : item;

            positionList.push({
                position: [rulesX_ary[i], zero_pos_y],
                cid: item.cid,
                cName: item.categoryName,
            });
        } else {
            positionList.push({
                position: [zero_pos_x, rulesY_ary[i]],
                cid: item.cid,
                cName: item.categoryName,
            });
        }
    }
    return positionList;
}
