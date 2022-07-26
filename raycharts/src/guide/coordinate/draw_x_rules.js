// 绘制x轴分度
import { Line } from '../../shape/index';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
export default function draw_y_rules(hr, props) {
    const {
        startX, // x轴开始位置
        startY,
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
        t_isPoint, // 轴均分线是否存在小数
        total_alines, // 均分线数量
        x_axis_every_space, // x轴均分线高度
    } = props;

    const {
        guide: {
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
        },
        _mirror_axes,
    } = configData;

    if (dir || !scale_open) return null;

    // 每段距离
    const every_space = x_axis_every_space;
    // 小分度
    const b_div_space = every_space / b_div_num;

    a_div_visible && draw_a_div();
    a_div_visible && b_div_visible && draw_b_div();

    // 绘制大分度
    function draw_a_div() {
        const cur_y = startY + y_axis_max_height + a_div_radial_offset;
        for (let i = 0; i < total_alines; i++) {
            let opts = {
                shape: {
                    x1: rulesX_ary[i],
                    y1: cur_y,
                    x2: rulesX_ary[i],
                    y2: animation_open ? cur_y : cur_y + a_div_line_length,
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
                        y2: cur_y + a_div_line_length,
                    })
                    .start();
            }
        }
    }

    // 绘制小分度
    function draw_b_div() {
        let len = total_alines - 1;
        let cur_y = startY + y_axis_max_height + b_div_radial_offset;

        let i = 0;
        // 轴均分线是否存在小数
        if (t_isPoint) {
            i = _mirror_axes ? 1 : 0;
            len = _mirror_axes ? total_alines - 1 : total_alines - 2;
            // len = Math.floor(len); // 轴线存在小数，就向下取整
        }

        for (i; i < len; i++) {
            for (let j = 0; j < b_div_num; j++) {
                let cur_x = 0;

                if (forwardMax) {
                    // 全正值
                    cur_x = rulesX_ary[i] + j * b_div_space;
                } else {
                    if (i === len - 1 && !t_isPoint) break;

                    cur_x = !_mirror_axes ? rulesX_ary[len - i] - j * b_div_space : rulesX_ary[i] + j * b_div_space;
                }

                // console.log(cur_x);
                let opts = {
                    shape: {
                        x1: cur_x,
                        y1: cur_y,
                        x2: cur_x,
                        y2: animation_open ? cur_y : cur_y + b_div_line_length,
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
                            y2: cur_y + b_div_line_length,
                        })
                        .start();
                }
            }
        }
    }
}
