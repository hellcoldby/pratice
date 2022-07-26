/**
 * 盒须图
 */

import { Group, Rect, Circle, Line, Text } from '../../shape';
import { getFontWidth, getRound } from '../../guide/coordinate/guide_common';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { changeRgbaOpacity } from '../Jade/jade_util';
import transData from './transData';
import renderCoordinate from '../../guide/coordinate';
import { addAnimate, setAnimType } from '../../animation/common';

export default function Boxplot(config) {
    const { configData, chartData, addHoverAction, maxWidth, maxHeight } = config;

    const chartGroup = new Group({ name: 'boxplot' });

    // 渲染坐标轴 获取坐标轴数据
    const Coordinate = renderCoordinate(config);
    const { info } = Coordinate;
    // console.log(info);

    // 动画
    const { open: animation_open, entry: anim_entry_list  } = configData.animation;

    const {
        graph_width: Bar_WidthPercent, // 柱子的宽度
        space: Bar_GapPercent, // 柱子的缝隙

        light: {
            opacity: light_opacity, // 发光透明度
            extent: light_blur, // 发光范围
        },

        outset: {
            h: outset_h, // 外阴影_水平
            v: outset_v, // 外阴影_垂直
            blur: outset_blur, // 外阴影_模糊
        },

        border: {
            line_type: border_line_type, // 属性值：solid（实线，默认）、dashed（虚线）
            radius: { tleft, tright, bright, bleft }, // 字段释义：tleft:top_left、tright:top_right、bright:bottom_right、bleft:bottom_left
            corner_type: border_corner_type, // 属性值：round（默认，圆角），line（直角）
            line_width: border_line_width,
            dash_array: border_dash, // 虚线数组
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
                radius: { tleft: bubble_tl, tright: bubble_tr, bright: bubble_br, bleft: bubble_bl }, // 气泡的边框圆角
                line_width: bubble_borderWidth, // 气泡的边框宽度
            },
        },
        type: dataType, // 数值的显示类型
        show: dataMaxMin, // 显示最值
    } = configData.data;

    // 辅助分析
    const {
        abnormal: {
            // 异常值
            show: abnormal_show, // 开关
            size: abnormal_radius, // 半径
            line_width: abnormal_line_width, // 线宽
            line_type: abnormal_line_type, // 线类型
        },
        normal: {
            // 正常值
            show: normal_show,
            size: normal_radius,
            line_width: normal_line_width, // 线宽
            line_type: normal_line_type, // 线类型
        },
        // 中位数
        median: {
            line_width: median_line_width, // 线宽
            line_type: median_line_type, // 线类型
        },
    } = configData.assistant;

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
            border: boxplot_borderColor,
            max: Bar_MaxColor, // 最大值柱子颜色
            min: Bar_MinColor, // 最小值柱子颜色
        },
        slot: {
            color: slot_bgColor, // 槽位颜色
            border: slot_borderColor,
            outset: slot_outsetColor, // 槽位投影颜色
        },
    } = configData.default_theme;

    //自定义量程
    const {
        draw_coor: {
            scale: {
                range: {
                    open: coor_open, // 量程开关
                    max: coor_max, // 量程最大值
                    min: coor_min, // 量程最小值
                },
            }
        }
    }= configData.guide;

    const shape_list = setAnimType(anim_entry_list);
    const shape_anim_list = shape_list.getAnim('shape');
    //删除默认动画
    const isGrow = shape_list.delAnim(shape_anim_list,'grow');
    const isFadeIn = shape_list.delAnim(shape_anim_list,'fadeIn');
    const isScale = shape_list.delAnim(shape_anim_list, 'unfold');

    // 气泡的内边距
    const bubble_padding = data_fontSize / 6;

    const { seriesList } = chartData;
    // 数据包含正负值判断
    const valueType = getValueType();
    // 转换为盒须图可用的数据格式
    const transDate = transData(chartData, valueType);

    const { 
        x_axis_every_space, //x轴均分宽度
        _coorInfo, // 图形区域自定义裁切范围
        startY,
        valueMaxHeight,
        
    } = info;


    const { s_x, s_y, x_w, y_h } = _coorInfo;


    // 轴均分宽度
    const everySpace = x_axis_every_space;

    // 系列数量
    const s_len = seriesList.length;
    // 柱子区域总宽度（所有柱子+缝隙）
    const area_W = Bar_WidthPercent ? everySpace * (Bar_WidthPercent / 100) : 1;
    // 间隔的总宽度
    const total_gap_W = s_len > 1 ? area_W * (Bar_GapPercent / 100) : 0;
    // 每个柱子的宽度
    const bar_W = (area_W - total_gap_W) / s_len;
    // 每个缝隙宽度
    const gap_W = total_gap_W ? total_gap_W / (s_len - 1) : 0;

    // 盒须图打组
    const boxGroup = new Group({ name: 'boxGroup' });
    // 数据点打组
    const pointGroup = new Group({ name: 'pointGroup' });
    // 数据打组
    const dataGroup = new Group({ name: 'dataGroup' });
    // 发光盒须图打组
    const lightGroup = new Group({ name: 'lightGroup' });

    // 阴影打组
    const shadowGroup = new Group({ name: 'shadowGroup' });

    // 卡槽打组
    const slotGroup = new Group({ name: 'slotGroup' });

    // 数据包含正负值判断 1-正值 2-负值 3-正负都有
    function getValueType() {
        const { forwardMax, minusMin } = info;
        let valueType = 1;
        // 全正值
        if (forwardMax && minusMin >= 0) {
            valueType = 1;
        } else if (forwardMax <= 0 && minusMin) {
            // 全负值
            valueType = 2;
        } else if (forwardMax && minusMin) {
            // 正负值
            valueType = 3;
        }
        return valueType;
    }

    //开启量程进行区域裁切
    let clipRect = new Rect({
        shape: {
            x: s_x,
            y: startY,
            width: x_w,
            height: valueMaxHeight,
        },
        style: {
            fill: 'yellow',
            stroke: 'white',
        },
    })


    /**
     * 绘制盒须图
     * @param {number} posX x轴坐标
     * @param {number} s_index  系列序列
     * @param {object} iqr_data 盒须图数值列表
     * @param {string} key 类别名称
     * @param {number} sid 系列id
     * @param {string} name
     */
    function drawBox(posX, s_index, iqr_data, key, sid, name, i) {
        // console.log(iqr_data);
        // 填充打组来处理圆角裁切填充色的目的
        const fill_group = new Group({ name: `fillGroup${Math.random}` });
        let { upper, lower, q1, q2, q3 } = iqr_data;

        const { y_axis_max_height, pixelRatioValue, act_zero_pos } = info;
        // 相对于中心位置的偏移
        const currOffset = -(s_len * bar_W + (s_len - 1) * gap_W) / 2 + (bar_W + gap_W) * s_index;
        // 默认颜色
        const boxColor = color(ColorList[s_index % ColorList.length]);
        const s_boxColor = color(secColorList[s_index % ColorList.length]);

        // 上限高度
        const upper_H = pixelRatioValue * upper;
        // 上限坐标
        const upper_X1 = posX + currOffset;
        const upper_X2 = upper_X1 + bar_W;
        const upper_Y = act_zero_pos.y - upper_H;

        // 下限高度
        const lower_H = pixelRatioValue * lower;
        const lower_Y = act_zero_pos.y - lower_H;

        const q1_H = pixelRatioValue * q1;
        const q2_H = pixelRatioValue * q2;
        const q3_H = pixelRatioValue * q3;
        const q1_Y = act_zero_pos.y - q1_H;
        const q2_Y = act_zero_pos.y - q2_H;
        const q3_Y = act_zero_pos.y - q3_H;

        // upper连线
        const c_upperLine_X1 = upper_X1 + bar_W / 2;
        const c_upperLine_Y1 = upper_Y;
        const c_upperLine_Y2 = q3_Y;

        // lower连线
        const c_lowerLine_X1 = c_upperLine_X1;
        const c_lowerLine_Y1 = lower_Y;
        const c_lowerLine_Y2 = q1_Y;

        // 描边宽度
        const br_w = (border_line_width / 100) * bar_W || 0;

        const Line_style = {
            fill: 'rgba(255, 255, 255, 0)',
            stroke: color(boxplot_borderColor),
            opacity: 1,
            lineWidth: br_w,
            lineDash: border_line_type === 'solid' ? '' : border_dash,
            shadowColor: color(outsetColor),
            shadowOffsetX: outset_h,
            shadowOffsetY: outset_v,
            shadowBlur: outset_blur,
        };
        // 发光配置
        const light_style = {
            fill: null,
            stroke: color(boxplot_borderColor),
            opacity: 1,
            lineWidth: br_w,
            shadowColor: color(changeRgbaOpacity(boxplot_borderColor, light_opacity / 100)),
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: light_blur,
        };

        // 投影配置
        const shadow_style = {
            shadowColor: color(outsetColor),
            shadowOffsetX: outset_h,
            shadowOffsetY: outset_v,
            shadowBlur: outset_blur,
        };

        // 上限
        let upperLine_option = {
            shape: {
                x1: upper_X1,
                y1: upper_Y,
                x2: upper_X2,
                y2: upper_Y,
            },
            style: Line_style,
            z: G_INDEX.shape,
        };
        const upperLine = new Line(upperLine_option);
        const upperLine_light = new Line({
            ...upperLine_option,
            style: light_style,
            z: G_INDEX.shape + 5,
        });
        const upperLine_shadow = new Line({
            ...upperLine_option,
            style: shadow_style,
            z: G_INDEX.shape - 5,
        });

        // 下限
        const lowerLine_option = {
            shape: {
                x1: upper_X1,
                y1: lower_Y,
                x2: upper_X2,
                y2: lower_Y,
            },
            style: Line_style,
            z: G_INDEX.shape + 3,
        };
        const lowerLine = new Line(lowerLine_option);
        const lowerLine_light = new Line({
            ...lowerLine_option,
            style: light_style,
            z: G_INDEX.shape + 5,
        });
        const lowerLine_shadow = new Line({
            ...lowerLine_option,
            style: shadow_style,
            z: G_INDEX.shape - 15,
        });

        // q2
        const q2Line_option = {
            shape: {
                x1: upper_X1,
                y1: q2_Y,
                x2: upper_X2,
                y2: q2_Y,
            },
            style: {
                ...Line_style,
                lineWidth: median_line_width,
                lineDash: median_line_type === 'solid' ? null : [2, 2],
                stroke: medianBorderColor,
                lineCap: 'square',
            },
            z: G_INDEX.shape + 4,
        };
        const q2Line = new Line(q2Line_option);

        // 盒子描边
        const box_min = Math.min(bar_W, q3_H - q1_H);
        const box_option = {
            shape: {
                x: upper_X1,
                y: q3_Y,
                width: bar_W,
                height: q3_H - q1_H,
                r: [
                    getRound(box_min, tleft),
                    getRound(box_min, tright),
                    getRound(box_min, bright),
                    getRound(box_min, bleft),
                ],
            },
            style: Line_style,
            z: G_INDEX.shape + 3,
        };

        const box = new Rect(box_option);
        const box_light = new Rect({
            ...box_option,
            style: light_style,
            z: G_INDEX.shape + 5,
        });
        // const box_shadow = new Rect({
        //     ...box_option,
        //     style: shadow_style,
        //     z: G_INDEX.shape - 15,
        // });

        const box_clip = _.cloneDeep(box);

        // upper填充
        const upperFillColor_option = {
            name: 'upperFillColor',
            shape: {
                x: upper_X1,
                y: q3_Y,
                width: bar_W,
                height: q3_H - q2_H,
            },
            style: {
                ...Line_style,
                stroke: null,
                fill: boxColor,
            },
            z: G_INDEX.shape,
        };
        const upperFillColor = new Rect(upperFillColor_option);

        const upperFillColor_light = new Rect({
            shape: upperFillColor_option.shape,
            style: {
                ...light_style,
                shadowColor: boxColor,
            },
            z: G_INDEX.shape + 5,
        });
        const upperFillColor_shadow = new Rect({
            shape: upperFillColor_option.shape,
            style: { ...shadow_style, ...upperFillColor_option.style },
            z: G_INDEX.shape - 15,
        });

        // lower填充
        const lowerFillColor_option = {
            name: 'lowerFillColor',
            shape: {
                x: upper_X1,
                y: q2_Y,
                width: bar_W,
                height: q2_H - q1_H,
            },
            style: {
                ...Line_style,
                stroke: null,
                fill: s_boxColor,
            },
            z: G_INDEX.shape,
        };
        const lowerFillColor = new Rect(lowerFillColor_option);
        const lowerFillColor_light = new Rect({
            shape: lowerFillColor_option.shape,
            style: { ...light_style, shadowColor: s_boxColor },
            z: G_INDEX.shape + 5,
        });
        const lowerFillColor_shadow = new Rect({
            shape: lowerFillColor_option.shape,
            style: { ...shadow_style, ...lowerFillColor_option.style },
            z: G_INDEX.shape - 15,
        });

        // upper连接线
        const upper_connect_line_option = {
            shape: {
                x1: c_upperLine_X1,
                y1: c_upperLine_Y1,
                x2: c_upperLine_X1,
                y2: c_upperLine_Y2,
            },
            style: Line_style,
            z: G_INDEX.shape + 3,
        };
        const upper_connect_line = new Line(upper_connect_line_option);
        const upper_connect_line_light = new Line({
            ...upper_connect_line_option,
            style: light_style,
            z: G_INDEX.shape + 5,
        });
        const upper_connect_line_shadow = new Line({
            ...upper_connect_line_option,
            style: shadow_style,
            z: G_INDEX.shape - 15,
        });

        // lower连接线
        const lower_connect_line_option = {
            shape: {
                x1: c_lowerLine_X1,
                y1: c_lowerLine_Y1,
                x2: c_lowerLine_X1,
                y2: c_lowerLine_Y2,
            },
            style: Line_style,
            z: G_INDEX.shape + 3,
        };
        const lower_connect_line = new Line(lower_connect_line_option);
        const lower_connect_line_light = new Line({
            ...lower_connect_line_option,
            style: light_style,
            z: G_INDEX.shape + 5,
        });
        const lower_connect_line_shadow = new Line({
            ...lower_connect_line_option,
            style: shadow_style,
            z: G_INDEX.shape - 15,
        });

        addHoverAction(box, {
            title: name,
            labelList: [
                {
                    keyName: '上限',
                    value: upper,
                },
                {
                    keyName: 'Q3',
                    value: q3,
                },
                {
                    keyName: 'Q2',
                    value: q2,
                },
                {
                    keyName: 'Q1',
                    value: q1,
                },
                {
                    keyName: '下限',
                    value: lower,
                },
            ],
        });

        fill_group.add(upperFillColor);
        fill_group.add(lowerFillColor);
        fill_group.add(q2Line);
        fill_group.setClipPath(box_clip);
        // 发光
        fill_group.add(upperFillColor_light);
        fill_group.add(lowerFillColor_light);

        // 盒子组合
        const group = new Group({
            name: `groupBox${key}`,
            origin: [upper_X1, q2_Y],
        });

        // 发光组合
        const group_light = new Group({
            name: `groupLight${key}`,
            origin: [upper_X1, q2_Y],
        });

        // 阴影组合
        const group_shadow = new Group({
            name: `groupShadow${key}`,
            origin: [upper_X1, q2_Y],
        });

        group.add(lowerLine);
        group.add(upperLine);
        group.add(box);
        group.add(upper_connect_line);
        group.add(lower_connect_line);
        group.add(fill_group);

        // 发光

        if (light_opacity && light_blur) {
            group.add(lowerLine_light);
            group.add(upperLine_light);
            group.add(box_light);
            group.add(upper_connect_line_light);
            group.add(lower_connect_line_light);
        }

        // 投影
        // if ((outset_h || outset_v) && outset_blur) {
        //     fill_group.add(upperFillColor_shadow);
        //     fill_group.add(lowerFillColor_shadow);
        //     fill_group.setClipPath(box_shadow);

        //     group.add(lowerLine_shadow);
        //     group.add(upperLine_shadow);
        //     group.add(upper_connect_line_shadow);
        //     group.add(lower_connect_line_shadow);
        // }

        boxGroup.add(group);
        boxGroup.setClipPath(clipRect);
        

    }

    /**
     * 绘制数值点
     * @param {number} posX x轴坐标
     * @param {number} s_index 系列序列
     * @param {Array} data 系列对应数组
     * @param {object} iqr_data 盒须图数值列表
     */
    function drawPoint(posX, s_index, data, iqr_data, cur_label, cur_sid, cur_name) {
        const { y_axis_max_height, pixelRatioValue, zero_pos, act_zero_pos} = info;
        let { upper, lower, q1, q2, q3, max, min } = iqr_data;
        // 相对于中心位置的偏移
        const currOffset = -(s_len * bar_W + (s_len - 1) * gap_W) / 2 + (bar_W + gap_W) * s_index;
        const cx = posX + currOffset + bar_W / 2;

        // 半径
        const r = (normal_radius / 100) * bar_W;
        const ab_r = (abnormal_radius / 100) * bar_W;

        // 描边
        const line_w = (normal_line_width / 100) * bar_W;
        const ab_line_w = (abnormal_line_width / 100) * bar_W;

        // 异常值
        let abnormal_max_val = null;
        let abnormal_min_val = null;
        for (let item of data.values()) {
            const cy = act_zero_pos.y - item * pixelRatioValue;
            // 异常值判断
            let isAbnormal = valueType === 2 ? item < upper || item > lower : item > upper || item < lower;
            let isNormal = valueType === 2 ? item >= upper && item <= lower : item >= lower && item <= upper;

            let value_width = 0; // 数值文字宽度
            // 绘制异常点
            if (isAbnormal && abnormal_show) {
                const abnormalCircle = new Circle({
                    shape: {
                        cx,
                        cy,
                        r: ab_r,
                    },
                    style: {
                        fill: color(abnormalColor),
                        stroke: color(abnormalBorder),
                        opacity: 1,
                        lineWidth: ab_line_w,
                        lineDash: abnormal_line_type === 'solid' ? '' : [2, 2],
                    },
                    z: G_INDEX.point,
                });

                addHoverAction(abnormalCircle, {
                    title: cur_label,
                    labelList: [
                        {
                            keyName: cur_name,
                            value: item,
                        },
                    ],
                });

                const ab_group = new Group({ name: `ab_group${s_index}` });
                ab_group.add(abnormalCircle);

                if (animation_open) {
                    ab_group.origin = [cx, cy];
                    ab_group.scale = [0.1, 0];
                    ab_group
                        .animate('')
                        .delay(200 * s_index)
                        .when(300, {
                            scale: [1, 1],
                        })
                        .start();
                }

                pointGroup.add(ab_group);
            }
            // 绘制正常点
            if (!isAbnormal && normal_show) {
                const normalCircle = new Circle({
                    shape: {
                        cx,
                        cy,
                        r,
                    },
                    style: {
                        fill: color(normalColor),
                        stroke: color(normalBorder),
                        opacity: 1,
                        lineWidth: line_w,
                        lineDash: normal_line_type === 'solid' ? '' : [2, 2],
                    },
                    z: G_INDEX.point,
                });

                addHoverAction(normalCircle, {
                    title: cur_label,
                    labelList: [
                        {
                            keyName: cur_name,
                            value: item,
                        },
                    ],
                });

                const nor_group = new Group({ name: `nor_group${s_index}` });
                nor_group.add(normalCircle);
                if (animation_open) {
                    nor_group.origin = [cx, cy];
                    nor_group.scale = [0.1, 0];
                    nor_group
                        .animate('')
                        .delay(200 * s_index)
                        .when(300, {
                            scale: [1, 1],
                        })
                        .start();
                }
                pointGroup.add(nor_group);
            }
            // 绘制数值
            if (data_visible) {
                const cur_data = dataType === 'normal' ? item : item;
                if (dataMaxMin === 'max' && max === cur_data) {
                    drawData();
                    bubble_visible && drawBubble();
                } else if (dataMaxMin === 'min' && min === cur_data) {
                    drawData();
                    bubble_visible && drawBubble();
                } else if (dataMaxMin === 'ex' && (max === cur_data || min === cur_data)) {
                    drawData();
                    bubble_visible && drawBubble();
                } else if (dataMaxMin === 'all') {
                    drawData();
                    bubble_visible && drawBubble();
                } else if (dataMaxMin === 'abnormal' && isAbnormal && abnormal_show) {
                    drawData();
                    bubble_visible && drawBubble();
                } else if (dataMaxMin === 'normal' && isNormal && abnormal_show) {
                    drawData();
                    bubble_visible && drawBubble();
                }

                function drawData() {
                    value_width = getFontWidth(item, data_fontSize, data_fontFamily);
                    const cur_x = cx;
                    const cur_y = cy;

                    const data = new Text({
                        x: cur_x,
                        y: cur_y,
                        style: {
                            text: item,
                            fill: color(tip_textColor),
                            fontSize: data_fontSize,
                            fontFamily: data_fontFamily,
                            fontStyle: data_fontStyle,
                            fontWeight: data_fontWeight,
                            verticalAlign: 'middle',
                            align: 'middle',
                            opacity: animation_open ? 0 : 1,
                        },
                        z: G_INDEX.data + 1,
                    });
                    dataGroup.add(data);

                    if (animation_open) {
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
                }

                function drawBubble() {
                    const curH = data_fontSize + bubble_padding * 2;
                    let curW = curH * 2;
                    curW = value_width > curW ? value_width + bubble_padding * 2 : curW;

                    // 较小的边作为圆角的基础
                    const borderMin = Math.min(curW, curH);
                    const _bubble_borderWidth = (borderMin * bubble_borderWidth) / 100;
                    // 气泡坐标
                    const bubble_x = cx - curW / 2;
                    const bubble_y = cy - curH / 2;
                    let bubbleRect = new Rect({
                        shape: {
                            x: bubble_x,
                            y: bubble_y,
                            width: curW,
                            height: curH,
                            r: [
                                getRound(borderMin, bubble_tl),
                                getRound(borderMin, bubble_tr),
                                getRound(borderMin, bubble_br),
                                getRound(borderMin, bubble_bl),
                            ],
                        },
                        style: {
                            fill: color(bubble_bgColor),
                            stroke: color(bubble_borderColor),
                            opacity: 1,
                            lineWidth: _bubble_borderWidth,
                            lineDash: bubble_borderType === 'solid' ? '' : [2, 2, 2, 2],
                            lineCap: 'square',
                        },
                        z: G_INDEX.bubble,
                    });

                    const bubble_group = new Group({ name: `bubble_group${s_index}` });
                    bubble_group.add(bubbleRect);
                    if (animation_open) {
                        bubble_group.origin = [cx, cy];
                        bubble_group.scale = [0.1, 0];
                        bubble_group
                            .animate('')
                            .delay(200 * s_index)
                            .when(300, {
                                scale: [1, 1],
                            })
                            .start();
                    }
                    dataGroup.add(bubble_group);
                }
            }
        }

        // if(coor_open){
        //     pointGroup.setClipPath(clipRect);
        //     dataGroup.setClipPath(clipRect);

        // }
    }

    /**
     * 绘制卡槽
     */
    function drawSlot() {
        const { rulesX_ary } = info;
       
        const curY = s_y;
        const curW = (slot_width / 100) * area_W;
        const curH = y_h;

        // 较小的边作为圆角的基础
        const borderMin = Math.min(curW, curH);
        const cur_r = [
            getRound(borderMin, slot_tl),
            getRound(borderMin, slot_tr),
            getRound(borderMin, slot_br),
            getRound(borderMin, slot_bl),
        ];

        const border_lineW = (slot_line_width / 100) * borderMin;

        for (let i = 0; i < rulesX_ary.length; i++) {
            const curX = rulesX_ary[i] - area_W / 2;

            const slot = new Rect({
                shape: {
                    x: curX,
                    y: curY,
                    width: curW,
                    height: curH,
                    r: cur_r,
                },
                style: {
                    fill: color(slot_bgColor),
                    stroke: color(slot_borderColor),
                    lineWidth: border_lineW,
                    lineDash: slot_line_type === 'solid' ? '' : [2, 2],
                    shadowColor: color(slot_outsetColor),
                    shadowOffsetX: slot_h,
                    shadowOffsetY: slot_v,
                    shadowBlur: slot_blur,
                    lineCap: 'square',
                },
            });
            slotGroup.add(slot);
        }

        const clip_slot = new Rect({
            shape: {
                x: s_x,
                y: curY,
                width: x_w,
                height: y_h,
            },
            style: {
                fill: 'yellow',
                stroke: 'white',
            },
            z: G_INDEX.slot,
        });
        slotGroup.setClipPath(clip_slot);
    }

    function render() {
        const { rulesX_ary, axis_label_ary } = info;
        // 坐标系
        chartGroup.add(Coordinate);
        // 槽位
        drawSlot();

        // 类别的数量集合
        let res = [];
        transDate.forEach((series, s_index) => {
            const cur_iqr = series.iqr;
            const cur_data = series.data;
            const cur_sid = series.sid;
            const cur_name = series.name;
            let tmp = [];
            for (let key in cur_iqr) {
                tmp.push(key);

                rulesX_ary.forEach((x, i) => {
                    // 坐标位置 和 坐标标签 是一一对应的关系，这里对比标签一致才进行绘制
                    if (axis_label_ary[i] === key) {
                        drawBox(x, s_index, cur_iqr[key], key, cur_sid, cur_name, i);
                        drawPoint(x, s_index, cur_data[key], cur_iqr[key], key, cur_sid, cur_name, i);
                    }
                });
            }
            if (!res.length) {
                res.push(tmp);
            } else if (res.length && tmp.length > res[res.length - 1].length) {
                res[res.length - 1] = tmp;
            }
        });

        if (animation_open) {
            boxGroup.eachChild((child) => {
                let getStr = child.name.match(/groupBox(.*)/)[1];
                const at_index = res[0].indexOf(getStr);
                    if (getStr) {
                        if(isGrow){
                            let cx = child.origin[0];
                            let cy = child.origin[1];
                            child.origin = [cx, cy];
                            child.scale = [1, 0];
                            child
                                .animate('')
                                .delay(200 * at_index)
                                .when(300, {
                                    scale: [1, 1],
                                })
                                .start();
                        }
                        if(isFadeIn){
                            addAnimate(child, ['fadeIn'], 800, 200 * at_index);
                        }

                        if(isScale){
                            let cx = child.origin[0];
                            let cy = child.origin[1];
                            const {width, height} = child.getBoundingRect();
                            child.origin = [cx+width/2, cy];
                            child.scale = [0, 1];
                            child
                                .animate('')
                                .delay(200 * at_index)
                                .when(300, {
                                    scale: [1, 1],
                                })
                                .start();
                        }
                    }
                });

        }

        chartGroup.add(boxGroup);
        chartGroup.add(dataGroup);
        chartGroup.add(slotGroup);
        chartGroup.add(pointGroup);
        chartGroup.add(lightGroup);
        // chartGroup.add(shadowGroup);
    }

    render();

    return chartGroup;
}
