// 绘制x轴文字标签

import { Rect, Group, Text } from '../../shape';
import { color } from '../../utils/color';

import { getFontWidth } from './guide_common';
import { getRotateWH } from './position_info';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
export default function draw_x_label(hr, props) {
    // console.log(props);
    const {
        animTime, // 动画时间
        startX, // x轴开始位置
        startY,
        y_title_width, // y轴标题宽度
        y_label_width, // y轴标签宽度
        y_axis_max_height: YAxis_H, // y轴线最大高度
        rulesY_ary,
        reserveY,
        rulesX_ary,
        forwardMax,
        minusMin,
        maxHeight: rootH,
        maxWidth: rootW,
        chartData: pData,
        configData,
        zeroIndex,
        zero_pos,
        zero_reserveX,
        total_alines,
        average_every_value,
        entry,
        zoom,
        dir,
        larger,
        smaller,
        roundUp_larger,
        axis_most_list,
        x_axis_label_H,
        x_axis_paddingB,
        x_axis_paddingT,
        t_isPoint, // 轴均分线是否存在小数
        t_point_val, // 轴均分线小数部分的值
        axis_value_ary, // 轴数值集合
        axis_label_ary, // 轴标签集合
        x_axis_every_space,
        y_axis_every_space,
        scale_len, // 自定义刻度线长度
    } = props;
    console.log('-----', props);

    const { legend, guide, background, default_theme } = configData;
    // 动画时间
    const { T, t } = animTime;
    // 图形padding
    const {
        padding: { 
            left: bg_l_padding,
            top: bg_t_padding,
            right: bg_r_padding,
            bottom: bg_b_padding
        },
    } = background;

    // 字体配置
    const {
        xaxis: {
            text_visible,
            text_angle,
            text_offset,

            word_break: {
                open: word_break_open, // 轴标签是否换行
                width: limit_width, // 调节范围0~100，百分比
                height: limit_height, // 调节范围0~100，百分比
                text_align, // 属性值：left(居左)，center（居中，默认）,right(居右)
                line_height, // 行高，实际像素0~100
            },
            font: { font_family, font_size, font_style, text_decoration, font_weight },
        },
        draw_coor: {
            text_visible: coor_visible,
            v_offset: coor_v,
            h_offset: coor_h,
            scale: {
                range: {
                    open: coor_open, // 量程开关
                    max: coor_max, // 量程最大值
                    min: coor_min, // 量程最小值
                },
            },
            division: {
                a_div: {
                    visible: a_div_visible,
                    num: a_div_num,
                    radial_offset: a_div_radial_offset,
                    line_width: a_div_line_width,
                    line_length: a_div_line_length,
                    value: a_div_value,
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
    } = guide;

    // 获取颜色
    const {
        xaxis: {
            label: { text_color, color: bgColor, border: borderColor },
        },
    } = default_theme.guide;

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

    // 坐标系镜像开关
    const { _mirror_axes } = configData;

    // 数据显示方式 （数值或百分比）
    const { type: analysis_type } = configData.analysis;

    // 动画开启或关闭
    const {
        open: animation_open, // 动画开关
    } = configData.animation;

    // 没有字体显示 就返回
    if (!text_visible) return;
    if (!font_size) return;

    // dir= false 横条图 / true 竖条图
    let len = dir ? axis_label_ary.length : axis_value_ary.length;

    // 轴标签区域限制
    const pos_x =  -rootW * 0.2;
    let pos_y = startY + YAxis_H + x_axis_paddingT + (dir ? 0 : scale_len);
    // 全负值或 正负值情况下，要考虑上下数据气泡的预留空间
    if (minusMin < 0) {
        if (!scale_open && tipText_visible && tip_baseline === 'end' && tip_align === 'end') {
            pos_y = reserveY + YAxis_H + x_axis_paddingT + (dir ? 0 : scale_len);
        }
    }

    const chart_group = new Group({ name: 'chartGroup' });
    const label_group = new Group({ name: 'labelGroup' });

    // 图形的x轴坐标
    chart_group.position = [-bg_l_padding, pos_y];

    // 获取对齐方式
    let textAlign = 'center';
    /**
     * 计算每个轴标签的位置信息
     * 配置角度text_angle 需要 乘以 -1 转换为图形角度
     */
    function getPos() {
        const basic_w = x_axis_every_space;
        const basic_H = rootH * 0.25;
        let label_pos_list = [];
        for (let i = 0; i < len; i++) {
            let curText = '';
            let limit_w = 0;
            let limit_h = font_size + 2;

            if (!dir) {
                curText = _mirror_axes ? axis_value_ary[i] : axis_value_ary[len - 1 - i];
            } else {
                curText = axis_label_ary[i];
            }

            limit_w = getFontWidth(curText, font_size, font_family) + 2;
            if (word_break_open && (limit_width || limit_height)) {
                limit_w = (limit_width / 100) * basic_w || 0;
                limit_h = (limit_height / 100) * basic_H || 0;
            }

            // 转换为图形角度
            const textAngle = dir ? -Number(text_angle) : 0;

            let center_x = rulesX_ary[i] + bg_l_padding; // 圆心的位置
            let origin = [0, 0];
            let posX = center_x - limit_w / 2; // 根据中心点坐标，推算左上角起点的坐标，
            let posY = 0;

            if (-90 < textAngle && textAngle < 0) {
                // 图形顺时针 左上角为圆心
                posX = center_x;
                posY += text_offset;
                origin = [0, 0];
            } else if (0 < textAngle && textAngle < 90) {
                // 图形逆时针 右上角为圆心
                posX = center_x - limit_w;
                posY += text_offset;
                origin = [limit_w, 0];
            } else if (textAngle < -90 || textAngle > 90) {
                // 超出范围角度为0
                textAngle = 0;
                posY += text_offset;
            } else if (textAngle === 90) {
                posX = center_x - limit_w;
                posY = posY - limit_h / 2 + text_offset;
                origin = [limit_w, limit_h / 2];
            } else if (textAngle === -90) {
                posX = center_x;
                posY = posY - limit_h / 2 + text_offset;
                origin = [0, limit_h / 2];
            }

            label_pos_list.push({
                curText,
                posX,
                posY,
                origin,
                textAngle,
                limit_w,
                limit_h,
            });
        }
        return label_pos_list;
    }

    // 绘制标签
    if (dir) {
        getPos().forEach((item, index) => {
            const { curText, posX, posY, origin, textAngle, limit_w, limit_h } = item;
            const label_group = new Group({
                name: `label_group${index}`,
                rotation: (textAngle * Math.PI) / 180,
                position: [posX, posY],
                origin,
            });

            // 文字折行
            if (word_break_open) {
                // 拆分文字 实现自动换行
                const split_array = canvasTextAutoLine(
                    curText,
                    limit_w,
                    line_height,
                    font_size,
                    font_family,
                );
                // console.log(split_array);
                split_array.length &&
                    split_array.forEach((item) => {
                        const { str, y } = item;
                        let cur_x = 0;
                        if (text_align === 'right') {
                            cur_x = (limit_w - getFontWidth(str, font_size, font_family)) / 2;
                        }

                        if (text_align === 'left') {
                            cur_x = -(limit_w - getFontWidth(str, font_size, font_family)) / 2;
                        }

                        const text = new Text({
                            style: {
                                text: str,
                                x: cur_x,
                                y: 0,
                                fill: color(text_color),
                                fontSize: font_size,
                                lineHeight: font_size,
                                fontFamily: font_family,
                                fontStyle: font_style,
                                fontWeight: font_weight,
                                align: 'center',
                                opacity: 1,
                            },
                            z: G_INDEX.slot + 1,
                        });
                        if (animation_open) {
                            text.attr({
                                style: {
                                    opacity: 0,
                                },
                            });
                            text.animateTo(
                                {
                                    style: {
                                        opacity: 1,
                                    },
                                },
                                {
                                    duration: t,
                                    delay: index * T,
                                },
                            );
                        }

                        // 绘制轴标签
                        let rect = new Rect({
                            shape: {
                                x: 0,
                                y: y,
                                width: limit_w,
                                height: font_size,
                            },
                            style: {
                                stroke: null,
                                fill: null,
                                lineWidth: 1,
                                lineDash: null,
                            },
                            textConfig: {
                                position: 'inside',
                                rotation: (textAngle * Math.PI) / 180,
                            },
                            textContent: text,
                            z: G_INDEX.slot,
                        });
                        label_group.add(rect);
                    });
            } else {
                const text = new Text({
                    style: {
                        text: curText,
                        fill: color(text_color),
                        fontSize: font_size,
                        lineHeight: font_size,
                        fontFamily: font_family,
                        fontStyle: font_style,
                        fontWeight: font_weight,
                        align: 'center',
                        verticalAlign: 'middle',
                        opacity: 1,
                    },
                    z: G_INDEX.slot + 1,
                });
                if (animation_open) {
                    text.attr({
                        style: {
                            opacity: 0,
                        },
                    });
                    text.animateTo(
                        {
                            style: {
                                opacity: 1,
                            },
                        },
                        {
                            duration: t,
                            delay: index * T,
                        },
                    );
                }
                let rect = new Rect({
                    shape: {
                        x: 0,
                        y: 0,
                        width: limit_w,
                        height: font_size,
                    },
                    style: {
                        stroke: null,
                        fill: null,
                        lineWidth: 1,
                        lineDash: null,
                    },
                    textConfig: {
                        position: 'inside',
                        rotation: (textAngle * Math.PI) / 180,
                    },
                    textContent: text,
                    z: G_INDEX.slot,
                });
                label_group.add(rect);
            }

            // 标签裁切区域
            const label_clip = new Rect({
                shape: {
                    x: 0,
                    y: 0,
                    width: limit_w,
                    height: limit_h,
                    textAlign,
                },
                style: {
                    stroke: color(borderColor),
                    fill: color(bgColor),
                    lineWidth: 2,
                    opacity: 1,
                    z: G_INDEX.slot,
                },
            });
            label_group.add(label_clip);
            label_group.setClipPath(label_clip);
            chart_group.add(label_group);

            if (animation_open) {
                addAnimate(label_group, t, index * T, { style: { opacity: 1 } });
            }
        });
    } else {
        for (let i = 0; i < len; i++) {
            const curText = _mirror_axes ? axis_value_ary[i] : axis_value_ary[len - 1 - i];
            const curText_width = getFontWidth(curText, font_size, font_family);
            const text = new Text({
                style: {
                    text: curText,
                    fill: color(text_color),
                    fontSize: font_size,
                    lineHeight: font_size,
                    fontFamily: font_family,
                    fontStyle: font_style,
                    fontWeight: font_weight,
                    align: 'center',
                    opacity: 1,
                },
                z: G_INDEX.slot + 1,
            });
            if (animation_open) {
                text.attr({
                    style: {
                        opacity: 0,
                    },
                });
                text.animateTo(
                    {
                        style: {
                            opacity: 1,
                        },
                    },
                    {
                        duration: t,
                        delay: i * T,
                    },
                );
            }
            const rect = new Rect({
                shape: {
                    x: rulesX_ary[i]+bg_l_padding  - curText_width / 2,
                    y: 0,
                    width: getFontWidth(curText, font_size, font_family),
                    height: font_size,
                },
                style: {
                    stroke: null,
                    fill: null,
                    opacity: animation_open ? 0 : 1,
                },
                textConfig: {
                    position: 'inside',
                },
                textContent: text,
                z: G_INDEX.slot,
            });
            chart_group.add(rect);
            if (animation_open) {
                addAnimate(rect, t, i * T, { style: { opacity: 1 } });
            }
        }
    }

    // x轴标签区域的裁切
    const area_clip = new Rect({
        shape: {
            x:0,
            y: 0,
            width: rootW + bg_l_padding + bg_r_padding,
            height: x_axis_label_H + 2,
        },
        style: {
            fill: null,
            stroke: 'yellow',
        },
    });

    // chart_group.add(area_clip);
    chart_group.setClipPath(area_clip);

    hr.add(chart_group);


}

/**
 * 文字超过限制的宽度自动折行
 * @param {sting} str  文字内容
 * @param {number} limitW  限制宽度
 * @param {number} lineH 行高
 */
function canvasTextAutoLine(str, limitW, lineH, font_size, font_family) {
    let lastSubIndex = 0;
    let split_array = [];
    let posY = 0;

    for (let i = 1, len = str.length; i <= len; i++) {
        let cur_line_str = str.substring(lastSubIndex, i);
        let fontW = getFontWidth(cur_line_str, font_size, font_family);
        if (cur_line_str.length > 1 && fontW > limitW) {
            cur_line_str = str.substring(lastSubIndex, i - 1);
            split_array.push({
                str: cur_line_str,
                y: posY,
            });
            posY += lineH;
            lastSubIndex = i - 1;
            i--;
        }
        if (i === str.length) {
            let last_line_str = str.substring(lastSubIndex, i + 1);
            last_line_str &&
                split_array.push({
                    str: last_line_str,
                    y: posY,
                });
        }
    }
    return split_array;
}
