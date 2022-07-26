/**
 * Histogram  直方图
 */

import { Group, Rect, Circle, Line, Text } from '../../shape';
import transData from './transData';
import _ from 'lodash';
import renderCoordinate from '../../guide/coordinate';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { getFontWidth, getRound } from '../../guide/coordinate/guide_common';
import renderEndPoint from '../../components/endPoint';
import { addAnimate, setAnimType } from '../../animation/common';

export default function Histogram(config) {
    const chartGroup = new Group({ name: 'Histogram' });
    const rect_group = new Group({ name: 'rect_group' });
    const bubble_group = new Group({ name: `bubble_group` });
    const point_group = new Group({ name: 'point_group' });

    const { configData, chartData, addHoverAction, maxWidth, maxHeight } = config;

    const {
        light: {
            opacity: light_opacity, // 发光透明度
            extent: light_blur, // 发光范围
        },

        outset: {
            h: outset_h, // 外阴影_水平
            v: outset_v, // 外阴影_垂直
            blur: outset_blur, // 外阴影_模糊
        },
        slot: {
            image: slot_image,
            width: slot_width,
            outset: { h: slot_h, v: slot_v, blur: slot_blur },
            border: {
                line_type: slot_line_type, // 属性值：solid（实线，默认）、dashed（虚线）
                radius: { tleft: slot_tl, tright: slot_tr, bright: slot_br, bleft: slot_bl }, // 字段释义：tleft:top_left、tright:top_right、bright:bottom_right、bleft:bottom_left
                corner_type: slot_corner_type, // 属性值：round（默认，圆角），line（直角）
                line_width: slot_line_width,
            },
        },
        border: {
            radius: { tleft: tl, tright: tr, bright: br, bleft: bl },
            line_type: border_line_type, // 属性值：solid（实线，默认）、dashed（虚线）
            line_width: border_line_width, // 描边宽度
            dash_array: border_line_dash, // 虚线数组
        },
    } = configData.general;

    // 数据配置
    const {
        visible: data_visible, // 数据显示
        font: {
            font_family: data_fontFamily,
            font_size: data_fontSize,
            font_style: data_fontStyle,
            text_decoration: data_textDec,
            font_weight: data_fontWeight,
        },

        bubble: {
            // 气泡相关
            visible: bubble_visible, // 气泡的显示隐藏

            border: {
                line_type: bubble_borderType, // 气泡的边框样式
                radius: {
                    tleft: bubble_tl,
                    tright: bubble_tr,
                    bright: bubble_br,
                    bleft: bubble_bl,
                }, // 气泡的边框圆角
                line_width: bubble_borderWidth, // 气泡的边框宽度
            },
        },
        type: dataType, // 数值的显示类型
        show: dataMaxMin, // 显示最值
    } = configData.data;

    const {
        assistant: {
            // 正常
            normal: {
                color: normalColor, // 填充
                border: normalBorder, // 描边
            },
            // 异常
            abnormal: {
                color: abnormalColor, // 填充
                border: abnormalBorder, // 描边
            },
            // 中位数
            median: {
                border: medianBorderColor, // 描边
            },
        },
        data: {
            text_color: tip_textColor, // 柱子提示文字的颜色
            text_stroke: tip_textBorderColor, // 文字描边的颜色
            bubble: {
                // 提示文字的气泡
                border: bubble_borderColor, // 气泡边框颜色
                color: bubble_bgColor, // 气泡背景色
            },
        },
        graph: {
            colors: ColorList, // 柱子的颜色列表
            secondary_colors: secColorList, // 次级颜色列表
            inset: insetColor,
            outset: outsetColor,
            border: graph_borderColor,
            max: Bar_MaxColor, // 最大值柱子颜色
            min: Bar_MinColor, // 最小值柱子颜色
        },
        slot: {
            color: slot_bgColor, // 槽位颜色
            border: slot_borderColor,
            outset: slot_outsetColor, // 槽位投影颜色
        },
    } = configData.default_theme;

    // 动画
    const { open: animation_open, entry: anim_entry_list } = configData.animation;

    // 用户自定义 均分值
    const custom_every_space = 0;

    // 获取图形对应的动画列表 返回一个函数---->> animType_list('shape') = ['grow', 'fadeIn'];
    const shape_list = setAnimType(anim_entry_list);
    const shape_anim_list = shape_list.getAnim('shape');
    //删除默认动画
    const isGrow = shape_list.delAnim(shape_anim_list, 'grow');
    // const isFadeIn = shape_list.delAnim(shape_anim_list,'fadeIn');
    const isScale = shape_list.delAnim(shape_anim_list, 'unfold');

    //转换数据
    const _transData = transData(chartData, configData);
    const { dataBaseSeries, perBaseSeries, seriesList, x_axios_divide_per } = _transData;
    // const _dataBaseSeries = dataBaseSeries.filter((item) => item !== 0);
    // const _perBaseSeries = perBaseSeries.filter((item) => item !== 0);

    const max = Math.max.apply(null, dataType === 'normal' ? dataBaseSeries : perBaseSeries);
    const min = Math.min.apply(null, dataType === 'normal' ? dataBaseSeries : perBaseSeries);

    // 渲染坐标轴 获取坐标轴数据
    const Coordinate = renderCoordinate({ ...config, chartData: _transData });
    const { info } = Coordinate;
    // console.log(config);
    const { startY, x_axis_every_space, rulesX_ary, pixelRatioValue, zero_pos } = info;

    // 气泡的内边距
    const bubble_padding = data_fontSize / 6;
    // 卡槽描边线宽
    const slot_border_width = (slot_line_width / 100) * x_axis_every_space;

    //图形描边宽度
    const shape_boder_width = (border_line_width / 100) * x_axis_every_space;

    //主函数
    function main() {
        const { dataBaseSeries, perBaseSeries, DEPRECATED_data } = _transData;
        // debugger;
        // 轴均分宽度
        let everySpace = x_axis_every_space;

        rulesX_ary.forEach((x, i) => {
            if (i === rulesX_ary.length - 1) return;
            let pos_H = pixelRatioValue * (dataBaseSeries[i] ? dataBaseSeries[i] : 0);
            let pos_Y = zero_pos.y - pos_H;
            //开启自定义刻度 和 自定义分度后 x轴 最后一段不能均分时的百分比
            let pos_x = x;
            if (i === rulesX_ary.length - 2 && x_axios_divide_per) {
                everySpace *= x_axios_divide_per;
                pos_x += 0.2;
            }
            drawShape(pos_x, pos_Y, pos_H, everySpace, i, DEPRECATED_data);
            drawShadow(pos_x, pos_Y, pos_H, everySpace);

            const slot_W = (100 / 100) * everySpace;
            const slot_H = zero_pos.y - startY;
            const slot_X = x + everySpace / 2 - slot_W / 2;
            const slot_Y = startY;

            drawHover(slot_X, slot_Y, slot_H, slot_W, i, DEPRECATED_data);

            const cx = pos_x + everySpace / 2;
            const cy = pos_Y;
            const cur_data =
                dataType === 'normal' ? dataBaseSeries[i] + '' : perBaseSeries[i] + '%';
            // 绘制数值
            const cur_data_num = parseFloat(cur_data);

            drawData(cx, cy, cur_data, cur_data_num);
            drawPoint(cx, pos_Y, cur_data, cur_data_num, i, rulesX_ary, everySpace);
        });
    }

    //绘制直方图
    function drawShape(x, y, h, w, i, data) {
        if (!h) return;
        // 较小的边作为圆角的基础
        const borderMin = Math.min(w, h);
        // const ac_val = `[${data[i].x}, ${data[i + 1].x})`;
        // const frequency = data[i].y;

        const rect = new Rect({
            shape: {
                x: x,
                y: y,
                width: w,
                height: h,
                r: [
                    getRound(borderMin, tl),
                    getRound(borderMin, tr),
                    getRound(borderMin, br),
                    getRound(borderMin, bl),
                ],
            },
            style: {
                fill: color(ColorList[0]),
                stroke: color(graph_borderColor),
                lineWidth: shape_boder_width,
                lineDash: border_line_type === 'solid' ? '' : border_line_dash,
                shadowColor: color(changeRgbaOpacity(ColorList[0], light_opacity / 100)),
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: light_blur,
                lineCap: border_line_type === 'solid' ? 'square' : null,
            },
            z: G_INDEX.shape,
        });
        if (animation_open) {
            if (isGrow) {
                // rect.scale = [1, 0];
                rect.attr({
                    shape: {
                        y: y + h,
                        height: 0,
                    },
                });
                // rect.origin = [x, y + h];
                rect.animateTo(
                    {
                        // scale: [1, 1],
                        shape: {
                            y: y,
                            height: h,
                        },
                    },
                    {
                        duration: 300,
                        delay: 300 + 100 * (i + 1),
                        // easing: 'cubicInOut',
                    },
                );
            }
            if (isScale) {
                rect.scale = [0, 1];
                rect.origin = [x + w / 2, y];
                rect.animateTo(
                    {
                        scale: [1, 1],
                    },
                    {
                        duration: 300,
                        delay: 300 + 100 * (i + 1),
                        // easing: 'cubicInOut',
                    },
                );
            }

            addAnimate(rect, shape_anim_list, 500, 300 + 100 * (i + 1));
        }

        rect_group.add(rect);
    }

    //绘制投影
    function drawShadow(x, y, h, w, i) {
        if (!h) return;
        // 较小的边作为圆角的基础
        const borderMin = Math.min(w, h);

        const rect_shadow = new Rect({
            shape: {
                x: x,
                y: y,
                width: w,
                height: h,
                r: [
                    getRound(borderMin, tl),
                    getRound(borderMin, tr),
                    getRound(borderMin, br),
                    getRound(borderMin, bl),
                ],
            },
            style: {
                fill: color(outsetColor),
                shadowColor: color(outsetColor),
                shadowOffsetX: outset_h,
                shadowOffsetY: outset_v,
                shadowBlur: outset_blur,
                opacity: 1,
            },
            z: G_INDEX.slot + 1,
        });
        if (animation_open) {
            rect_shadow.style.opacity = 0;
            rect_shadow.animateTo(
                {
                    style: {
                        opacity: 1,
                    },
                },
                {
                    duration: 300,
                    delay: 1000,
                },
            );
        }

        rect_group.add(rect_shadow);
    }

    //绘制hover
    function drawHover(x, y, h, w, i, data) {
        // 较小的边作为圆角的基础
        const borderMin = Math.min(w, h);
        const ac_val = `[${data[i].x}, ${data[i + 1].x})`;
        const frequency = data[i].y;
        const rect = new Rect({
            shape: {
                x: x,
                y: y,
                width: w,
                height: h,
                r: [
                    getRound(borderMin, slot_tl),
                    getRound(borderMin, slot_tr),
                    getRound(borderMin, slot_br),
                    getRound(borderMin, slot_bl),
                ],
            },
            style: {
                fill: 'rgba(255,255,255,0)',
                stroke: null,
                // stroke: color(slot_borderColor),
                // lineWidth: slot_border_width,
                // lineDash: slot_line_type === 'solid' ? null : [5, 5],
                // shadowColor: color(slot_outsetColor),
                // shadowOffsetX: slot_h,
                // shadowOffsetY: slot_v,
                // shadowBlur: slot_blur,
                // lineCap: slot_line_type === 'solid' ? 'square' : null,
            },
            z: G_INDEX.hover,
        });
        rect_group.add(rect);

        addHoverAction(rect, {
            title: ac_val,
            labelList: [
                {
                    keyName: '数量',
                    value: frequency,
                },
            ],
        });
    }

    //绘制端点
    function drawPoint(x, y, cur_data, cur_data_num, i, ary, width) {
        let space = x_axis_every_space;
        // if (i === ary.length - 2 && x_axios_divide_per) {
        //     space = width;
        // }

        const EndPointSet = renderEndPoint(configData)({
            maxSize: space,
            isMin: cur_data_num === min,
            isMax: cur_data_num === max,
        }).attr({
            position: [x, y],
        });

        if (animation_open) {
            addAnimate(EndPointSet, ['fadeIn'], 600 + 100 * (i + 1));
        }

        point_group.add(EndPointSet);
    }

    //绘制数字气泡
    function drawData(cx, cy, cur_data, cur_data_num) {
        if (data_visible) {
            let toRender_data = false; //绘制数据开关
            if (dataMaxMin === 'max' && max === cur_data_num) {
                toRender_data = true;
            } else if (dataMaxMin === 'min' && min === cur_data_num) {
                toRender_data = true;
            } else if (dataMaxMin === 'ex' && (max === cur_data_num || min === cur_data_num)) {
                toRender_data = true;
            } else if (dataMaxMin === 'all') {
                toRender_data = true;
            } else if (dataMaxMin === 'abnormal' && isAbnormal && abnormal_show) {
                toRender_data = true;
            } else if (dataMaxMin === 'normal' && isNormal && abnormal_show) {
                toRender_data = true;
            }
            let value_width = getFontWidth(cur_data, data_fontSize, data_fontFamily);

            if (toRender_data) {
                const curH = bubble_visible ? data_fontSize + bubble_padding * 2 : data_fontSize;
                let curW = curH * 2;
                curW = value_width > curW ? value_width + bubble_padding * 2 : curW;

                // 较小的边作为圆角的基础
                const borderMin = Math.min(curW, curH);
                const _bubble_borderWidth = (borderMin * bubble_borderWidth) / 100;
                // 气泡坐标
                const bubble_x = cx - curW / 2;
                const bubble_y = cy - (curH + _bubble_borderWidth);

                const data_y = cy - curH - curH * 0.2;

                const cur_x = bubble_x;
                const cur_y = bubble_visible ? bubble_y : data_y;

                const data = new Text({
                    style: {
                        text: cur_data,
                        fill: color(tip_textColor),
                        fontSize: data_fontSize,
                        fontFamily: data_fontFamily,
                        fontStyle: data_fontStyle,
                        fontWeight: data_fontWeight,
                        verticalAlign: 'middle',
                        align: 'middle',
                        opacity: 1,
                    },
                    z: G_INDEX.data + 1,
                });

                if (animation_open) {
                    data.style.opacity = 0;
                    data.animateTo(
                        {
                            style: {
                                opacity: 1,
                            },
                        },
                        {
                            duration: 300,
                            delay: 300,
                        },
                    );
                }

                const bubble_style = bubble_visible
                    ? {
                          fill: color(bubble_bgColor),
                          stroke: color(bubble_borderColor),
                          opacity: 1,
                          lineWidth: _bubble_borderWidth,
                          lineDash: bubble_borderType === 'solid' ? '' : [2, 2, 2, 2],
                          lineCap: bubble_borderType === 'solid' ? 'square' : null,
                      }
                    : {
                          fill: null,
                          stroke: null,
                          opacity: 0,
                      };

                let bubbleRect = new Rect({
                    shape: {
                        x: cur_x,
                        y: cur_y,
                        width: curW,
                        height: curH,
                        r: [
                            getRound(borderMin, bubble_tl),
                            getRound(borderMin, bubble_tr),
                            getRound(borderMin, bubble_br),
                            getRound(borderMin, bubble_bl),
                        ],
                    },
                    style: bubble_style,
                    textConfig: {
                        position: 'inside',
                    },
                    textContent: data,
                    z: G_INDEX.bubble,
                });

                if (animation_open) {
                    bubbleRect.style.opacity = 0;

                    bubbleRect.animateTo(
                        {
                            style: {
                                opacity: 1,
                            },
                        },
                        {
                            duration: 300,
                            delay: 300,
                        },
                    );
                }

                bubble_group.add(bubbleRect);
            }
        }
    }

    function render() {
        main();
        chartGroup.add(Coordinate);
        chartGroup.add(rect_group);
        chartGroup.add(bubble_group);
        chartGroup.add(point_group);
    }

    render();
    return chartGroup;
}

// tool -- 改变颜色透明度
export function changeRgbaOpacity(cur_color, opacity) {
    return cur_color.replace(/rgba\((\d+,\d+,\d+,)(\d+(\.\d)?)\)/g, `rgba($1${opacity})`);
}
