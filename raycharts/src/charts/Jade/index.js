/*
 * @Description:玉玦图
 * @Author: ygp
 * @Date: 2021-01-07 17:27:29
 * @LastEditors: ygp
 * @LastEditTime: 2021-08-19 15:57:50
 *
 * 玦块角度相同的状况下，外侧的环块会显得比内侧的更长。在这种情况下，我们很容易误认为外侧的数值会大于内侧。
 * 为了避免玉玦图带来的视觉误导，我们常常要先把数据按照大小排序，再进行可视化
 *
 *
* 弧度顺时针--水平线以上为负角度，水平线以下为正角度
* 线段旋转rotation---- 水平线以上为正角度， 水平线以下为负角度


 */
import { getFontWidth, handleDec } from '../../guide/coordinate/guide_common';
import { Group, Circle, Arc, Rect, Ellipse, Sector, Line, CurvePolygon, Text } from '../../shape';
import { color } from '../../utils/color';
import position_info from '../../guide/coordinate/position_info';
import { G_NAME, G_INDEX } from '../../utils/common';
import { addPoint, drawBubbles } from '../public/decorate';
import { getArcAngles, pointByRad } from '../../utils/tool';
import { addAnimate, setAnimType } from '../../animation/common';

import {
    toAngle,
    fixAngle,
    toArc,
    act_br,
    getFirstData,
    getMax,
    getMin,
    changeRgbaOpacity,
    InQuadrant,
} from './jade_util.js';

export default function Jade(config) {
    const chart_group = new Group({ name: `chart_group` });
    const jade_group = new Group({ name: 'jade_group' });
    const guid_group = new Group({ name: 'guid_group' });
    const slot_group = new Group({ name: 'slot_group' });
    const polar_group = new Group({ name: 'polar_group' });
    const point_group = new Group({ name: 'point_group' });
    const aDiv_group = new Group({ name: 'aDiv_group' });
    const aDiv_label_group = new Group({ name: 'aDiv_label_group' });
    const bDiv_group = new Group({ name: 'bDiv_group' });
    const pcoor_line_group = new Group({ name: 'pcoor_line_group' });

    const {
        maxWidth: rootW,
        maxHeight: rootH,
        configData,
        chartData,
        zoom,
        addHoverAction,
    } = config;
    const info = position_info(config);
    const {
        forwardMax, // 正向的最大值
        minusMin,
        animTime,
    } = info;
    const { t, T } = animTime;

    const {
        general: {
            graph_width: jade_perW, // 玉玦图宽度
            light: {
                opacity: jade_opacity, // 发光透明度
                extent: jade_extent, // 发光范围
            },

            outset: {
                h: outset_h, // 外阴影_水平
                v: outset_v, // 外阴影_垂直
                blur: outset_blur, // 外阴影_模糊
            },

            slot: {
                width: slot_width,
                outset: { h: slot_outset_h, v: slot_outset_v, blur: slot_outset_blur },
                border: {
                    radius: {
                        tleft: slot_out_star,
                        tright: slot_out_end,
                        bright: slot_inner_end,
                        bleft: slot_inner_start,
                    },
                    line_width: slot_line_width,
                },
            },
            border: {
                radius: {
                    tleft: rad_out_star,
                    tright: rad_out_end,
                    bright: rad_inner_end,
                    bleft: rad_inner_start,
                },
                line_type: arcBorder_lineType, // 属性值：solid（实线，默认）、dashed（虚线）
                line_width: arcBorder_lineWidth,
                dash_array: arcBorder_dashAry, // 虚线数组
            },
            r: jade_radius, // 玉玦图半径
            hole_r: jade_hole_radius, // 玉玦图内径
            ccw: jade_ccw, // 顺时针 逆时针
            g_shadow: jade_g_shadow, // 玉玦图全局阴影
            s_angle: jade_s_angle, // 玉玦图开始角度
            e_angle: jade_e_angle, // 玉玦图结束角度
        },
        data: {
            visible: data_visible,
            show: data_show, // 最大值 最小值
            font: {
                font_family: data_fontFamily,
                font_size: data_fontSize,
                font_style: data_fontStyle,
                text_decoration: data_textDec,
                font_weight: data_fontWeight,
            },
            type: data_type, // 正常、百分比
            total_position: data_tp, // 基于卡槽或者图形 shape/slot
            baseline: data_baseline, // 数据基线位置(开始 中心  结束)
            radial_offset: data_radOffset, // 径向偏移，-100~100，默认0
            align: data_align, // 基于基线的对齐方式
            // v_offset: data_v, // 垂直偏移，-100~100，默认0
            // h_offset: data_h, // 水平偏移，-100~100，默认0
            angle_offset: data_angleOffset, // 角度偏移（玉珏图）
            bubble: {
                visible: bubble_visible, // 属性值：true(显示)，false（不显示，默认）
                shape: bubble_shape, // diamond 菱形  rectangle矩形，默认  triangle三角形 circle圆形
                border: {
                    line_type: bubble_lineType,
                    radius: { tleft: b_tl, tright: b_tr, bright: b_br, bleft: b_bl },
                    line_width: b_lineW,
                },
            },
        },
        guide: {
            grid: {
                v_line: {
                    line_type: grid_v_lineType,
                    line_width: grid_v_width,
                    visible: grid_v_visible, // 属性值：true(显示)，false（不显示，默认）
                },
                radial: {
                    visible: radial_visible,
                    line_type: radial_lineType,
                    line_width: radial_width,
                },
            },
            draw_coor: {
                text_visible: coor_visible,
                font: {
                    font_family: coor_fontFamily,
                    font_size: coor_fontSize,
                    font_style: coor_fontStyle,
                    text_decoration: coor_textDec,
                    font_weight: coor_fontWeight,
                },
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
                    a_label: {
                        visible: a_label_visible,
                        font: {
                            font_family: a_label_fontFamily,
                            font_size: a_label_fontSize,
                            font_style: a_label_fontStyle,
                            text_decoration: a_label_text_decoration,
                            font_weight: a_label_fontWeight,
                        },
                        radial_offset: a_label_radial_offset,
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
            pcoor: {
                text_visible: pcoor_visible,
                font: {
                    font_family: pcoor_fontFamily,
                    font_size: pcoor_fontSize,
                    font_style: pcoor_fontStyle,
                    text_decoration: pcoor_textDec,
                    font_weight: pcoor_fontWeight,
                },
                text_offset: pcoor_textOffset, // 实际像素
                text_angle: pcoor_textAngle, // 角度旋转0~360
                h_offset: pcoor_h, // 水平偏移 -100~100
                v_offset: pcoor_v, // 垂直偏移 -100~100
                line: {
                    visible: pcoor_lineVisible,
                    line_type: pcoor_lineType,
                    line_width: pcoor_lineWidth,
                },
            },
            paxis: {
                text_visible: paxis_textVisible,
                font: {
                    font_family: paxis_fontFamily,
                    font_size: paxis_fontSize,
                    font_style: paxis_fontStyle,
                    text_decoration: paxis_textDec,
                    font_weight: paxis_fontWeight,
                },
                text_offset: paxis_textOffset,
                line: {
                    visible: paxis_lineVisible,
                    line_type: paxis_lineType,
                    line_width: paxis_lineWidth,
                },
            },
        },
        animation: {
            open: animation_open,
            // entry: [
            //     {
            //         target: anim_target, // 动画指定的目标元素
            //         character: animType, // 动画类型 grow | fadeIn | unfold
            //     },
            // ],
            entry: anim_entry_list,
        },
        default_theme: {
            data: {
                text_color: data_textColor,
                text_stroke: data_textStroke, // 文本描边颜色
                bubble: { border: bubble_borderColor, color: bubble_bgColor },
            },
            graph: {
                colors: graphColors,
                inset: insetColor,
                outset: outsetColor,
                border: arc_borderColor,
            },
            guide: {
                grid: { v_line: guide_v_color, h_line: guide_h_color, radial: radial_color },
                draw_coor: {
                    label: {
                        text_color: coor_textColor,
                        color: coor_bgColor,
                        border: coor_borderColor,
                    },
                    division: {
                        a_div: { line: a_div_lineColor },
                        a_label: { text_color: a_label_textColor, color: a_label_bgColor },
                        b_div: { line: b_div_lineColor },
                    },
                },
                pcoor: {
                    label: {
                        text_color: pcoor_textColor,
                        color: pcoor_bgColor,
                        border: pcoor_borderColor,
                    },
                    line_color: pcoor_lineColor,
                },
                paxis: { line_color: paxis_lineColor },
            },
            slot: {
                color: slot_bgColor,
                border: slot_borderColor,
                inset: slot_insetColor,
                outset: slot_outsetColor,
            },
        },
    } = configData;

    // 环形方向
    const ccw = !jade_ccw;

    // 获取图形对应的动画列表 返回一个函数---->> animType_list('shape') = ['grow', 'fadeIn'];
    const animType_list = setAnimType(anim_entry_list);
    const shapeList =  animType_list.getAnim('shape');

    // 数据转换为数组
    const options = {
        chartData,
        jade_s_angle,
        jade_e_angle,
        ccw,
        scale_max,
        scale_min,
        scale_open,
        forwardMax,
        minusMin,
    };

    let newAry = getFirstData(chartData, true);
    if (!newAry.length) return chart_group;
    let { max_val } = getMax(newAry);
    let { min_val } = getMin(newAry);

    // 转换数据为角度（包括自定义量程处理）
    const { angle_list, actual_angle, angle_list_per } = toAngle(options, newAry, max_val, min_val);
    const angle_len = angle_list.length;
    // console.log('实际角度------', actual_angle);
    // console.log('角度列表------', angle_list);

    // 确立坐标系中心位置
    const axis_cen = { x: rootW / 2, y: rootH / 2 };
    // 半径
    const jade_r = (Math.min(rootW / 2, rootH / 2) * jade_radius) / 100;
    // 孔位
    const jade_hole_r = (jade_r * jade_hole_radius) / 100;
    // 图形占位
    const jade_dis = jade_r - jade_hole_r;
    // 图形均分宽度（每个圆环占位宽度）
    const jade_every_width = jade_dis / angle_len;
    // 图形实际宽度
    const jade_act_width = (jade_every_width * jade_perW) / 100;
    // 每条弧的半径
    let radius = [];
    for (let i = 0; i < angle_len; i++) {
        let r = jade_r - i * jade_every_width;
        radius.push(r);
    }
    // 图形描边宽度
    let border_lineW = (arcBorder_lineWidth / 100) * jade_act_width;

    // tool -- 量程开关
    function scaleFlag(i) {
        let item = newAry[i];
        return item.y >= scale_min && item.y <= scale_max ? true : false;
    }
    /**------------------------------------------------------- */
    //主函数
    function main() {
        for (let i = 0; i < radius.length; i++) {
            const options = {
                origin: [axis_cen.x, axis_cen.y],
                silent: false,
                shape: {
                    cx: axis_cen.x,
                    cy: axis_cen.y,
                    r: radius[i],
                    r0: radius[i] - jade_act_width,
                    startAngle: toArc(0, ccw ? jade_s_angle : jade_e_angle, ccw),
                    endAngle: toArc(angle_list[i], ccw ? jade_s_angle : jade_e_angle, ccw),
                    clockwise: ccw,
                    // cornerRadius: !ccw
                    //     ? [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                    //     : [rad_inner_end, rad_inner_start, rad_out_end, rad_out_star],
                    cornerRadius: [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                },
                style: {
                    fill: color(graphColors[newAry[i]._order % graphColors.length]),
                    stroke: color(arc_borderColor),
                    lineWidth: border_lineW * 2,
                    lineDash:
                        arcBorder_lineType === 'solid'
                            ? null
                            : arcBorder_dashAry
                            ? arcBorder_dashAry
                            : [5, 5],
                },
            };

            if (scale_open && scaleFlag(i)) {
                drawJade(options, i);
                drawShadow(options, i);
                drawSlot(options, i);
                draw_point(i);
            } else {
                drawJade(options, i);
                drawShadow(options, i);
                drawSlot(options, i);
                draw_point(i);
            }
        }
        // 径向网格
        radial_visible && drawGuide();
        paxis_lineVisible && drawPolar(0);

        // 量程刻度
        if (scale_open) {
            const aDiv_every_angle = actual_angle / a_div_num;
            for (let i = 0; i < a_div_num + 1; i++) {
                a_div_visible && draw_aDiv(aDiv_every_angle, i);
                a_div_visible && a_label_visible && draw_aDiv_label(aDiv_every_angle, i);
                a_div_visible && b_div_visible && draw_bDiv(aDiv_every_angle, i);
            }
        }
        //极轴
        pcoor_lineVisible && pcoor_line();
        //极坐标
        pcoor_visible && drawPolar_label();

        // 数据展示
        data_visible && draw_data();
    }

    //绘制玉珏图 和 描边
    function drawJade(options, i) {
        let jade = new Sector({
            shape: { ...options.shape },
            style: {
                ...options.style,
                shadowColor: color(
                    changeRgbaOpacity(
                        graphColors[newAry[i]._order % graphColors.length],
                        jade_opacity / 100,
                    ),
                ),
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: jade_extent,
            },
            z: G_INDEX.shape,
        });

        if (animation_open) {
            addAnimate(jade, shapeList, 800, 150 *(i));
        }
        jade_group.add(jade);
        addHoverAction(jade, { cid: newAry[i].id, sid: newAry[i].from });
    }

    // 绘制阴影
    function drawShadow(options, i) {
        let shadow = new Sector({
            shape: { ...options.shape },
            style: {
                ...options.style,
                shadowColor: color(outsetColor),
                shadowOffsetX: outset_h,
                shadowOffsetY: outset_v,
                shadowBlur: outset_blur,
            },
            z: G_INDEX.shape - 1,
        });
        if (animation_open) {
            addAnimate(shadow, shapeList, 800, 150 *(i));
        }
        jade_group.add(shadow);
    }

    // 绘制卡槽 && 描边 && 阴影
    function drawSlot(options, i) {
        let slot = new Sector({
            shape: {
                ...options.shape,
                endAngle: toArc(actual_angle, ccw ? jade_s_angle : jade_e_angle, ccw),
                cornerRadius: [slot_inner_start, slot_inner_end, slot_out_star, slot_out_end]
                // cornerRadius: !ccw
                //     ? [slot_inner_start, slot_inner_end, slot_out_star, slot_out_end]
                //     : [slot_inner_end, slot_inner_start, slot_out_end, slot_out_star],
            },
            style: {
                ...options.style,
                fill: color(slot_bgColor),
                lineWidth: (jade_act_width * slot_width) / 100,
                stroke: color(slot_borderColor),
                shadowColor: color(slot_outsetColor),
                shadowOffsetX: slot_outset_h,
                shadowOffsetY: slot_outset_v,
                shadowBlur: slot_outset_blur,
            },
            z: G_INDEX.slot,
        });

        if (animation_open) {
            addAnimate(slot,  ['fadeIn'], 400);
        }
        slot_group.add(slot);
    }

    // 绘制极轴(最外层的一条描边线)
    function drawPolar(i) {
        let option = {
            silent: false,
            shape: {
                cx: axis_cen.x,
                cy: axis_cen.y,
                r: radius[0],
                startAngle: toArc(0, ccw ? jade_s_angle : jade_e_angle, ccw),
                endAngle: toArc(actual_angle, ccw ? jade_s_angle : jade_e_angle, ccw),
                clockwise: ccw,
            },
            style: {
                fill: null,
                stroke: color(slot_bgColor),
                lineWidth: (jade_act_width * slot_width) / 100,
                opacity: 1,
            },
            z: G_INDEX.slot,
        };

        let outer_r = jade_r + a_div_radial_offset;

        let polar = new Arc({
            origin: [axis_cen.x, axis_cen.y],
            shape: { ...option.shape, r: outer_r },
            style: {
                ...option.style,
                stroke: color(paxis_lineColor),
                lineWidth: paxis_lineWidth,
                lineDash: paxis_lineType === 'solid' ? null : [5, 5],
                opacity: 1,
            },
            z: G_INDEX.shape + 3,
        });

        if (animation_open) {
            addAnimate(polar, shapeList);
        }

        polar_group.add(polar);
    }

    // 绘制网格线
    function drawGuide() {
        const lineW = (radial_width / 100) * 20 * zoom;
        // 大分度下每段的角度
        const aDiv_every_angle = actual_angle / a_div_num;
        // console.log('开始角度---', jade_s_angle);
        // 计算弧长
        const res_l = (aDiv_every_angle * Math.PI * jade_r) / 180;

        for (let i = 0; i < a_div_num + 1; i++) {
            let line = new Line({
                origin: [axis_cen.x, axis_cen.y],
                rotation: -toArc(aDiv_every_angle * i, jade_s_angle, true),
                shape: {
                    x1: axis_cen.x + jade_hole_r + a_div_radial_offset,
                    y1: axis_cen.y,
                    x2: axis_cen.x + jade_r + a_div_radial_offset,
                    y2: axis_cen.y,
                },
                style: {
                    lineWidth: lineW,
                    lineDash: radial_lineType === 'solid' ? null : [5, 5],
                    stroke: color(radial_color),
                },
                z: G_INDEX.base,
            });
            guid_group.add(line);
        }
    }

    // 绘制大分度
    function draw_aDiv(every_angle, i) {
        // 计算弧长
        const res_l = (every_angle * Math.PI * jade_r) / 180;
        // 分度线宽度
        const aDiv_lineW = (a_div_line_width / 100) * res_l;
        // 分度线高度
        const aDiv_lineH = (a_div_line_length / 100) * jade_r;

        let aDiv_line = new Line({
            origin: [axis_cen.x, axis_cen.y],
            rotation: -toArc(every_angle * i, ccw ? jade_s_angle : jade_e_angle, ccw),
            shape: {
                x1: axis_cen.x + jade_r + a_div_radial_offset,
                y1: axis_cen.y,
                x2: axis_cen.x + jade_r + aDiv_lineH + a_div_radial_offset,
                y2: axis_cen.y,
            },
            style: {
                stroke: color(a_div_lineColor),
                lineWidth: aDiv_lineW,
            },
            z: G_INDEX.shape * 10,
        });
        aDiv_group.add(aDiv_line);
    }

    // 绘制大分度标签
    function draw_aDiv_label(every_angle, i) {
        // 获取每段的均分值
        const every_lin_val = (scale_max - scale_min) / a_div_num;
        // 标签径向偏移
        const radOffset = (a_label_radial_offset / 100) * jade_r;
        const cur_r = jade_r + radOffset;
        // 获取字体的站位宽度
        let cur_text = handleDec(i * every_lin_val + scale_min);
        cur_text = Math.round(cur_text * 10) / 10;
        const text_w = getFontWidth(cur_text, a_label_fontSize, a_label_fontFamily);

        // 半径结束点的坐标
        const end = {
            x: cur_r * Math.cos(toArc(every_angle * i, ccw ? jade_s_angle : jade_e_angle, ccw)),
            y: cur_r * Math.sin(toArc(every_angle * i, ccw ? jade_s_angle : jade_e_angle, ccw)),
        };

        const act = {
            x: axis_cen.x + end.x,
            y: axis_cen.y + end.y,
        };

        let angle = fixAngle(every_angle * i, ccw ? jade_s_angle : jade_e_angle, ccw);
        angle = angle % 360;
        // console.log(angle);

        if ((angle < -90 && angle > -270) || (angle > 90 && angle < 270)) {
            act.x -= text_w;
        }
        if (
            (angle < -90 && angle > -180) ||
            (angle < 0 && angle > -90) ||
            (angle > 180 && angle < 270)
        ) {
            act.y -= a_label_fontSize;
        }
        if (angle === 0 || angle === -360) {
            act.y -= a_label_fontSize / 2;
        }

        if (angle === -90 || angle === 270) {
            act.x -= text_w / 2;
            act.y -= a_label_fontSize;
        }
        if (angle === -180 || angle === 180) {
            act.y -= a_label_fontSize / 2;
        }
        if (angle === -270 || angle === 90) {
            act.x -= text_w / 2;
        }

        const label = new Text({
            style: {
                text: cur_text,
                fill: color(a_label_textColor),
                lineHeight: a_label_fontSize,
                fontSize: a_label_fontSize,
                fontWeight: a_label_fontWeight,
                fontStyle: a_label_fontStyle,
                fontFamily: a_label_fontFamily,
                verticalAlign: 'middle',
                align: 'middle',
                opacity: 1,
            },
        });

        const text = new Rect({
            // origin: [axis_cen.x, axis_cen.y],
            // rotation: -toArc(aDiv_every_angle * i, ccw ? jade_s_angle : jade_e_angle, ccw),
            shape: {
                x: act.x,
                y: act.y,
                width: text_w,
                height: a_label_fontSize,
            },
            style: {
                // stroke: '#fff',
                lineWidth: 1,
                lineCap: 'square',
                fill: color(a_label_bgColor),
            },

            textConfig: {
                position: 'inside',
            },
            textContent: label,
        });
        aDiv_label_group.add(text);
    }

    // 绘制小分度
    function draw_bDiv(every_angle, i) {
        // 计算弧长
        const res_l = (every_angle * Math.PI * jade_r) / 180;
        const bDiv_lineW = (b_div_line_width / 100) * res_l;
        const bDiv_lineH = (b_div_line_length / 100) * jade_r;
        // 每段小分度角度
        const bDiv_every_angle = every_angle / b_div_num;
        // console.log('每个小分度的角度：', bDiv_every_angle);

        const cur_angle = fixAngle(every_angle * i, ccw ? jade_s_angle : jade_e_angle, ccw);
        const _bdNum = i === a_div_num ? 1 : b_div_num;
        for (let i = 0; i < _bdNum; i++) {
            let bDiv_a = null;
            // 顺时针
            if (cur_angle !== 0) {
                bDiv_a = -(cur_angle + bDiv_every_angle * i * (ccw ? 1 : -1));
            } else {
                bDiv_a = ccw ? -bDiv_every_angle : bDiv_every_angle;
            }

            // console.log('小分度', bDiv_a);
            let bDiv_line = new Line({
                origin: [axis_cen.x, axis_cen.y],
                rotation: (bDiv_a * Math.PI) / 180,
                shape: {
                    x1: axis_cen.x + jade_r + b_div_radial_offset,
                    y1: axis_cen.y,
                    x2: axis_cen.x + jade_r + bDiv_lineH + b_div_radial_offset,
                    y2: axis_cen.y,
                },
                style: {
                    stroke: color(b_div_lineColor),
                    lineWidth: bDiv_lineW,
                },
                z: G_INDEX.shape * 10,
            });
            bDiv_group.add(bDiv_line);
        }
    }

    // 绘制极坐标 & 轴标签 --- 顺时针在开始位置左侧， 逆时针在开始位置右侧
    function drawPolar_label() {
        // 水平 垂直偏移 相对于半径的-100% ~ 100%
        const p_h = (pcoor_h / 100) * jade_r;
        const p_v = (pcoor_v / 100) * jade_r;

        let border_lineW = (slot_line_width / 100) * ((jade_act_width * slot_width) / 100);
        // 顺逆时针的角度
        let cur_angle = ccw ? -jade_s_angle : -jade_e_angle;

        let cur_rad = (cur_angle * Math.PI) / 180;
        let fix_degree = 0;
        for (let i = 0; i < radius.length; i++) {
            renderLabel(i);
        }

        function renderLabel(i) {
            let item = newAry[i];
            // 获取字体的占位宽度
            const cur_text = item.seriesName;
            const text_w = getFontWidth(cur_text, pcoor_fontSize, pcoor_fontFamily);
            // 根据当前角度和半径-- 求出终点坐标
            let cur_r = radius[i] - jade_act_width / 2;
            let fix_rotate = 0;
            let cur_pos = {};
            let origin = [];
            let act = {};
            let v_x = 0;
            let v_y = 0;

            if (pcoor_textAngle === 90) {
                cur_r = radius[i] - jade_act_width / 2 + (pcoor_fontSize / 2) * (ccw ? -1 : 1);
                // 径向偏移
                cur_r = cur_r + p_h;
                // 切线分解 水平位移
                v_x = p_v * Math.sin(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                // 切线分解 垂直位移
                v_y = p_v * Math.cos(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                fix_rotate = ccw ? 90 + jade_s_angle : -(90 - jade_e_angle);
            }

            if (pcoor_textAngle === 0) {
                cur_r = radius[i] - jade_act_width / 2 + (text_w / 2) * (ccw ? 1 : -1);
                // 径向偏移
                cur_r = cur_r + p_h;
                // 切线分解 水平位移
                v_x = p_v * Math.sin(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                // 切线分解 垂直位移
                v_y = p_v * Math.cos(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                fix_rotate = ccw ? -(180 - jade_s_angle) : jade_e_angle;
            }

            if (pcoor_textAngle > 0 && pcoor_textAngle < 90) {
                // 径向偏移
                cur_r = cur_r + p_h;
                // 切线分解 水平位移
                v_x = p_v * Math.sin(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                // 切线分解 垂直位移
                v_y = p_v * Math.cos(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                fix_rotate = ccw
                    ? -(180 - jade_s_angle + pcoor_textAngle)
                    : jade_e_angle - pcoor_textAngle;
            }

            cur_pos = {
                x: Math.cos(cur_rad) * cur_r,
                y: Math.sin(cur_rad) * cur_r,
            };
            act = {
                x: axis_cen.x + cur_pos.x + v_x,
                y: axis_cen.y + cur_pos.y + v_y,
            };
            origin = [act.x, act.y];

            if (pcoor_textAngle < 0 && pcoor_textAngle > -90) {
                // 径向偏移
                cur_r = cur_r + p_h;
                // 切线分解 水平位移
                v_x = p_v * Math.sin(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                // 切线分解 垂直位移
                v_y = p_v * Math.cos(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                fix_rotate = ccw
                    ? -(180 - jade_s_angle) - pcoor_textAngle
                    : -pcoor_textAngle + jade_e_angle;

                // 当前开始点位置
                cur_pos = {
                    x: Math.cos(cur_rad) * cur_r - text_w,
                    y: Math.sin(cur_rad) * cur_r,
                };
                act = {
                    x: axis_cen.x + cur_pos.x + v_x,
                    y: axis_cen.y + cur_pos.y + v_y,
                };
                origin = [act.x + text_w, act.y];
            }

            if (pcoor_textAngle === -90) {
                if (ccw) {
                    cur_r = radius[i] - jade_act_width / 2 + pcoor_fontSize / 2;
                    // 逆时针修改正开始角度
                    let pcoor_width = text_w - p_v + border_lineW; // 偏移宽度

                    let pcoor_height = cur_r + p_h; // 偏移高度
                    fix_degree = Math.atan2(pcoor_width, pcoor_height) / (Math.PI / 180);
                    cur_r = Math.sqrt(Math.pow(pcoor_height, 2) + Math.pow(pcoor_width, 2));
                    cur_rad = (-(jade_s_angle + fix_degree) * Math.PI) / 180;
                    fix_rotate = -(90 - jade_s_angle);

                    cur_pos = {
                        x: Math.cos(cur_rad) * cur_r,
                        y: Math.sin(cur_rad) * cur_r,
                    };
                    act = {
                        x: axis_cen.x + cur_pos.x + v_x,
                        y: axis_cen.y + cur_pos.y + v_y,
                    };
                    origin = [act.x, act.y];
                } else {
                    cur_r = radius[i] - jade_act_width / 2 - pcoor_fontSize / 2;
                    cur_r = cur_r + p_h;

                    // 切线分解 水平位移
                    v_x = p_v * Math.sin(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);
                    // 切线分解 垂直位移
                    v_y = p_v * Math.cos(((ccw ? jade_s_angle : jade_e_angle) * Math.PI) / 180);

                    fix_rotate = 90 + jade_e_angle;
                    // 当前开始点位置
                    cur_pos = {
                        x: Math.cos(cur_rad) * cur_r - text_w,
                        y: Math.sin(cur_rad) * cur_r,
                    };
                    act = {
                        x: axis_cen.x + cur_pos.x + v_x,
                        y: axis_cen.y + cur_pos.y + v_y,
                    };
                    origin = [act.x + text_w, act.y];
                }
            }

            const label = new Text({
                style: {
                    text: cur_text,
                    fill: color(pcoor_textColor),
                    fontSize: pcoor_fontSize,
                    fontWeight: pcoor_fontWeight,
                    fontStyle: pcoor_fontStyle,
                    fontFamily: pcoor_fontFamily,
                    lineHeight: pcoor_fontSize,
                    verticalAlign: 'middle',
                    align: 'middle',
                    opacity: animation_open ? 0 : 1,
                },
                z: G_INDEX.a_div_label + 1,
            });
            animation_open &&
                label.animateTo(
                    {
                        style: {
                            opacity: 1,
                        },
                    },
                    {
                        duration: 2000,
                    },
                );

            let text = new Rect({
                origin,
                rotation: (fix_rotate * Math.PI) / 180,
                shape: {
                    x: act.x,
                    y: act.y,
                    width: text_w,
                    height: pcoor_fontSize,
                },
                style: {
                    stroke: color(pcoor_borderColor),
                    lineWidth: 1,
                    lineCap: 'square',
                    fill: color(pcoor_bgColor),
                    opacity: animation_open ? 0 : 1,
                },
                textConfig: {
                    position: 'inside',
                    rotation: (fix_rotate * Math.PI) / 180,
                },
                textContent: label,
                z: G_INDEX.a_div_label,
            });
            chart_group.add(text);
            animation_open &&
                text.animateTo(
                    {
                        style: {
                            opacity: 1,
                        },
                    },
                    {
                        duration: 2000,
                    },
                );
        }
    }

    // 绘制极坐标线
    function pcoor_line() {
        let border_lineW = (slot_line_width / 100) * ((jade_act_width * slot_width) / 100);

        let outer_r = radius[0] + (jade_act_width * slot_width) / 100 / 2;
        let inner_r = radius[radius.length - 1] - (jade_act_width * slot_width) / 100 / 2;
        inner_r -= border_lineW / 2;
        outer_r += border_lineW / 2;

        // 逆时针修改正开始角度
        let pcoor_width = pcoor_lineWidth; // 偏移宽度
        let pcoor_height = 0; // 偏移高度
        let _fix_degree = 0;

        const inner_fix_degree = 0;
        const outer_fix_degree = 0;
        // const inner_fix_degree = Math.atan2(pcoor_width / 2, inner_r) / (Math.PI / 180);
        // const outer_fix_degree = Math.atan2(pcoor_width / 2, outer_r) / (Math.PI / 180);

        const inner_s_angle = ccw
            ? jade_s_angle + inner_fix_degree
            : jade_e_angle - inner_fix_degree;
        const outer_s_angle = ccw
            ? jade_s_angle + outer_fix_degree
            : jade_e_angle - outer_fix_degree;

        const inner_pos = {
            x: inner_r * Math.cos(toArc(0, inner_s_angle, ccw)),
            y: inner_r * Math.sin(toArc(0, inner_s_angle, ccw)),
        };

        const outer_pos = {
            x: outer_r * Math.cos(toArc(0, outer_s_angle, ccw)),
            y: outer_r * Math.sin(toArc(0, outer_s_angle, ccw)),
        };

        // 开始位置连接线
        let s_line = new Line({
            shape: {
                x1: axis_cen.x + inner_pos.x,
                y1: axis_cen.y + inner_pos.y,
                x2: axis_cen.x + outer_pos.x,
                y2: axis_cen.y + outer_pos.y,
            },
            style: {
                lineWidth: (pcoor_lineWidth / 100) * 20 * zoom,
                lineDash: pcoor_lineType === 'solid' ? null : [5, 5],
                stroke: color(pcoor_lineColor),
                opacity: 1,
            },
            z: G_INDEX.slot + 1,
        });

        pcoor_line_group.add(s_line);
    }

    // 绘制数据
    function draw_data() {
        // 角度调节范围
        const angleOffset = (data_angleOffset / 100) * 20;
        // 实际角度
        let show_angle = null;
        let show_pos = {
            x: null,
            y: null,
        };

        for (let i = 0; i < radius.length; i++) {
            let item = newAry[i];
            let curValue = item.y;
            if (typeof curValue !== 'number') {
                continue;
            }
            switch (data_show) {
                case 'max':
                    if (item.y !== max_val) continue;
                    break;
                case 'min':
                    if (item.y !== min_val) continue;
                    break;
                case 'ex':
                    if (item.y == max_val || item.y === min_val) {
                    } else {
                        continue;
                    }
                    break;
                default:
                    break;
            }

            if (scale_open) {
                scaleFlag(i) ? renderData(i, max_val) : null;
            } else {
                renderData(i, max_val);
            }
        }

        function renderData(i, max_val) {
            let which_qua = 0; // 字体所在象限
            let data_rotate = 0; // 字体需要旋转的角度
            /** ---------------------判断数据象限-----start---------------------------- */

            // 开始位置
            let s_angle = ccw ? jade_s_angle : jade_e_angle;

            // 绘制角度
            let cur_angle = data_tp === 'shape' ? angle_list[i] : actual_angle;
            cur_angle = data_baseline === 'center' ? cur_angle / 2 : cur_angle;
            cur_angle += angleOffset;

            // 结束位置
            let e_angle = s_angle + (ccw ? -1 : 1) * cur_angle.toFixed(2) - 0;
            e_angle = Math.abs(e_angle) >= 360 ? e_angle % 360 : e_angle;

            // 数据所在象限，垂直于半径需要旋转的角度
            if (data_baseline === 'start') {
                const { num, rotate } = InQuadrant(s_angle);
                which_qua = num;
                data_rotate = (rotate * Math.PI) / 180;
            } else {
                const { num, rotate } = InQuadrant(e_angle);
                which_qua = num;
                data_rotate = (rotate * Math.PI) / 180;
            }

            /** ---------------------判断数据象限-----end---------------------------- */
            let item = newAry[i];
            // 数据字体宽度、高度
            let per_val = angle_list_per[i];
            per_val =
                String(per_val * 100).indexOf('.') !== -1
                    ? (per_val * 100).toFixed(2)
                    : per_val * 100;
            let cur_text = String(data_type === 'normal' ? item.y : per_val + '%');
            let text_w = getFontWidth(cur_text, data_fontSize, data_fontFamily);
            text_w = data_fontSize * 2.2 >= text_w ? data_fontSize * 2.2 : text_w;
            let text_h = data_fontSize + (data_fontSize / 6) * 2;
            let _bubble_borderWidth = 0;
            // 较小的边作为圆角的基础
            const borderMin = Math.min(text_w, text_h);
            _bubble_borderWidth = (borderMin * b_lineW) / 100;

            // 数据字体偏移
            let dOffset = (data_radOffset / 100) * jade_r;

            let cur_r = 0;
            // 计算中心到字体左侧中心点的半径
            if (which_qua === 3 || which_qua === 4) {
                cur_r = radius[i] - jade_act_width / 2 - text_h / 2 + dOffset;
            } else {
                cur_r = radius[i] - jade_act_width / 2 + text_h / 2 + dOffset;
            }

            // 修正数据位置 修正新半径（这部分逻辑请看文件夹里的图片 data_align.jpeg 解析）
            let fix_degree = 0; // 水平线下为第三 第四象限，需要修正角度
            let fix_cur_r = cur_r; // 水平线下为第三 第四象限，需要修正文字所在半径
            if (which_qua === 1 || which_qua === 2) {
                if (ccw && data_align === 'start') {
                    fix_degree = (Math.atan2(text_w, cur_r) / (Math.PI / 180)) * -1;
                    fix_cur_r = Math.sqrt(Math.pow(cur_r, 2) + Math.pow(text_w, 2));
                }

                if (!ccw && data_align === 'end') {
                    fix_degree =
                        (Math.atan2(text_w, cur_r) / (Math.PI / 180)) *
                        (data_baseline === 'start' ? -1 : 1);
                    fix_cur_r = Math.sqrt(Math.pow(cur_r, 2) + Math.pow(text_w, 2));
                }

                if (!ccw && data_align === 'center') {
                    fix_degree =
                        (Math.atan2(text_w / 2, cur_r) / (Math.PI / 180)) *
                        (data_baseline === 'start' ? -1 : 1);
                    fix_cur_r = Math.sqrt(Math.pow(cur_r, 2) + Math.pow(text_w / 2, 2));
                }
                if (ccw && data_align === 'center') {
                    fix_degree =
                        (Math.atan2(text_w / 2, cur_r) / (Math.PI / 180)) *
                        (data_baseline === 'start' ? 1 : -1);
                    fix_cur_r = Math.sqrt(Math.pow(cur_r, 2) + Math.pow(text_w / 2, 2));
                }
            } else if (which_qua === 3 || which_qua === 4) {
                if (ccw && data_align === 'end') {
                    fix_degree = Math.atan2(text_w, cur_r) / (Math.PI / 180);
                    fix_cur_r = Math.sqrt(Math.pow(cur_r, 2) + Math.pow(text_w, 2));
                }

                if (!ccw && data_align === 'start') {
                    fix_degree =
                        (Math.atan2(text_w, cur_r) / (Math.PI / 180)) *
                        (data_baseline === 'start' ? 1 : -1);
                    fix_cur_r = Math.sqrt(Math.pow(cur_r, 2) + Math.pow(text_w, 2));
                }
                if (!ccw && data_align === 'center') {
                    fix_degree =
                        (Math.atan2(text_w / 2, cur_r) / (Math.PI / 180)) *
                        (data_baseline === 'start' ? 1 : -1);
                    fix_cur_r = Math.sqrt(Math.pow(cur_r, 2) + Math.pow(text_w / 2, 2));
                }
                if (ccw && data_align === 'center') {
                    fix_degree = Math.atan2(text_w / 2, cur_r) / (Math.PI / 180);
                    fix_cur_r = Math.sqrt(Math.pow(cur_r, 2) + Math.pow(text_w / 2, 2));
                }
            }

            // 字体修正后的角度
            const fix_cur_angle = cur_angle + fix_degree;
            show_angle = get_act(s_angle, fix_cur_angle, fix_degree);

            // 数值的坐标
            show_pos = {
                x: Math.cos((show_angle * Math.PI) / 180) * fix_cur_r,
                y: Math.sin((show_angle * Math.PI) / 180) * fix_cur_r,
            };

            /** -----------------------绘制 数值、气泡 start-------------------------------------- */
            const act = {
                x: axis_cen.x + show_pos.x,
                y: axis_cen.y + show_pos.y,
            };

            // 气泡配置
            let b_opts = {
                shape: {
                    r: 0,
                },
                style: {},
            };
            const data = new Text({
                style: {
                    text: cur_text,
                    fill: color(data_textColor),
                    fontSize: data_fontSize,
                    fontWeight: data_fontWeight,
                    fontStyle: data_fontStyle,
                    fontFamily: data_fontFamily,
                    opacity: animation_open ? 0 : 1,
                },
                z: G_INDEX.a_div_label + 1,
            });
            if (animation_open) {
                data.animateTo(
                    {
                        style: { opacity: 1 },
                    },
                    {
                        duration: 300,
                        delay: 1200,
                    },
                );
            }

            if (bubble_visible) {
                let border_min = Math.min(text_w, text_h);
                let bubble_r = [
                    act_br(border_min, b_tl),
                    act_br(border_min, b_tr),
                    act_br(border_min, b_bl),
                    act_br(border_min, b_br),
                ];
                b_opts.shape = { r: bubble_r };
                b_opts.style = {
                    fill: color(bubble_bgColor),
                    stroke: color(bubble_borderColor),
                    lineWidth: _bubble_borderWidth,
                    lineDash: bubble_lineType === 'solid' ? null : [2, 2],
                    lineCap: 'square',
                };
            }

            let bubble = new Rect({
                origin: [act.x, act.y],
                rotation: data_rotate,
                shape: {
                    x: act.x,
                    y: act.y,
                    width: text_w,
                    height: text_h,
                    ...b_opts.shape,
                },
                style: {
                    stroke: null,
                    fill: null,
                    opacity: animation_open ? 0 : 1,
                    ...b_opts.style,
                },
                textConfig: {
                    position: 'inside',
                    rotation: data_rotate,
                },
                textContent: data,

                z: G_INDEX.a_div_label,
            });
            chart_group.add(bubble);

            if (animation_open) {
                bubble.animateTo(
                    {
                        style: { opacity: 1 },
                    },
                    {
                        duration: 300,
                        delay: 1200,
                    },
                );
            }
        }

        function get_act(start_angle, fix_angle, fix_degree) {
            let res = 0;
            switch (data_baseline) {
                case 'start':
                    res = -start_angle + fix_degree;
                    break;
                case 'center':
                    res = -start_angle + fix_angle * (ccw ? 1 : -1);
                    break;
                case 'end':
                    res = -start_angle + fix_angle * (ccw ? 1 : -1);

                    break;
                default:
                    res = 0;
                    break;
            }
            return res;
        }
    }

    // 绘制端点
    function draw_point(i) {
        // 最大值 最小值显示
        let curValue = newAry[i].y;
        const cur_angle = fixAngle(angle_list[i], ccw ? jade_s_angle : jade_e_angle, ccw);
        let e_angle = Math.PI * (cur_angle / 180);
        let pointInfo = pointByRad(axis_cen.x, axis_cen.y, radius[i] - jade_act_width / 2, e_angle);

        let pointConfig = {
            ...config,
            pointData: {
                x: pointInfo.x,
                y: pointInfo.y,
                angle: e_angle,
                maxSize: jade_r,
                isMax: curValue === max_val,
                isMin: curValue === min_val,
            },
            z: G_INDEX.point,
        };
        let point = addPoint(pointConfig);
        point_group.add(point);
    }

    function render() {
        main();
        chart_group.add(jade_group);
        chart_group.add(guid_group);
        chart_group.add(slot_group);
        chart_group.add(polar_group);
        chart_group.add(point_group);
        point_group.eachChild((point) => {
            animation_open &&
                point.eachChild((child) => {
                    addAnimate(child, ['fadeIn'], 300, 1200);
                });
        });
        chart_group.add(aDiv_group);
        chart_group.add(aDiv_label_group);
        chart_group.add(bDiv_group);
        chart_group.add(pcoor_line_group);
    }

    render();
    return chart_group;
}
