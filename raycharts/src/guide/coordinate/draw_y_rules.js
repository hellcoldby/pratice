// 绘制y轴的大分度 小分度
import { Line } from '../../shape/index';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
export default function draw_y_rules(hr, props) {
    const {
        startX, // x轴开始位置
        y_title_width, // y轴标题宽度
        y_label_width, // y轴标签宽度
        y_axis_max_height, // y轴高度
        rulesY_ary,
        reserveY,
        rulesX_ary,
        reserveX,
        zero_pos,
        pixels_per_unit, // 单位像素
        x_axis_label_H, // x轴标签高度
        maxHeight: rootH,
        maxWidth: rootW,
        chartData,
        configData,
        entry,
        zoom,
        dir,
        forwardMax,
        zero_reserveX,
        zero_reserveY,
        total_alines, // 均分线数量
        t_isPoint, // 轴均分线是否存在小数
        t_point_val, // 轴均分线小数部分的值
        y_axis_every_space, // y轴均分线高度
    } = props;

    const {
        _mirror_axes,
        guide: {
            yaxis: {
                line: { line_width: yaxis_lineW },
            },
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
        animation: { open: animation_open },
        default_theme: {
            graph: { colors: graphColors },
            guide: {
                grid: { v_line: guide_v_color, h_line: guide_h_color },
                draw_coor: {
                    label: { text_color: coor_textColor, color: coor_bgColor, border: coor_borderColor },
                    division: {
                        a_div: { line: a_div_lineColor },
                        a_label: { text_color: a_label_textColor, color: a_label_bgColor },
                        b_div: { line: b_div_lineColor },
                    },
                },
            },
            slot: { color: slot_bgColor, border: slot_borderColor, inset: slot_insetColor, outset: slot_outsetColor },
        },
    } = configData;

    if (!dir || !scale_open) return null;

    // 每段距离
    const every_space = y_axis_every_space;
    // console.log(y_axis_every_space);

    // 轴均分线是否存在小数
    if (t_isPoint) {
        every_space;
    }

    if (b_div_num < 0) {
        return;
    }

    // 小分度
    const b_div_space = every_space / b_div_num;

    a_div_visible && draw_a_div();
    a_div_visible && b_div_visible && draw_b_div();

    // 绘制大分度
    function draw_a_div() {
        const posX = !_mirror_axes
            ? startX - a_div_line_length + a_div_radial_offset - yaxis_lineW
            : rootW - startX + a_div_radial_offset + yaxis_lineW;

        for (let i = 0; i < total_alines; i++) {
            let opts = {
                shape: {
                    x1: posX,
                    y1: rulesY_ary[i],
                    x2: animation_open ? posX : posX + a_div_line_length,
                    y2: rulesY_ary[i],
                },
                style: {
                    stroke: a_div_lineColor,
                    lineWidth: a_div_line_width,
                },
                z: G_INDEX.base,
            };
            let line = new Line(opts);
            hr.add(line);
            if (animation_open) {
                line.animate('shape')
                    .delay(200)
                    .when(100, {
                        x2: posX + a_div_line_length,
                    })
                    .start();
            }
        }
    }

    // 绘制小分度
    function draw_b_div() {
        const posX = !_mirror_axes
            ? startX - b_div_line_length + b_div_radial_offset - yaxis_lineW
            : rootW - startX + b_div_radial_offset + yaxis_lineW;

        // let len = forwardMax ? total_alines : total_alines - 2;
        let len = total_alines;

        let i = 0;
        if (t_isPoint) {
            len = Math.floor(len); // 轴线存在小数，就向下取整
            i = 1;
        }

        for (i; i < len; i++) {
            // 没有小数时候 最后一根的位置只绘制一次
            const _bdNum = i === len - 1 && !t_isPoint ? 1 : b_div_num;

            for (let j = 0; j < _bdNum; j++) {
                const cur_y = rulesY_ary[i] + j * b_div_space;
                let opts = {
                    shape: {
                        x1: posX,
                        y1: cur_y,
                        x2: animation_open ? posX : posX + b_div_line_length,
                        y2: cur_y,
                    },
                    style: {
                        stroke: b_div_lineColor,
                        lineWidth: b_div_line_width,
                    },
                    z: G_INDEX.base,
                };
                let line = new Line(opts);
                hr.add(line);
                if (animation_open) {
                    line.animate('shape')
                        .delay(200)
                        .when(100, {
                            x2: posX + b_div_line_length,
                        })
                        .start();
                }
            }
        }
    }
}
