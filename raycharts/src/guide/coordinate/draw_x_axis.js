/*
 * @Description:绘制x轴
 * @Author: ygp
 * @Date: 2020-11-03 14:38:50
 * @LastEditors: ygp
 * @LastEditTime: 2021-08-11 19:50:35
 */
import { Line } from '../../shape/index';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';

export default function draw_x_axis(hr, props) {
    // console.log(props);
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
    } = props;

    // 获取颜色
    const {
        guide: {
            xaxis: { line_color },
        },
    } = configData.default_theme;

    // 坐标系镜像开关
    const { _mirror_axes } = configData;

    // y轴配置
    const {
        xaxis: {
            visible: xaxis_visible,
            line: { line_type: xaxis_type, line_width: xaxis_w },
        },
        yaxis: {
            visible: yaxis_visible,
            line: { line_width: yaxis_w },
        },
    } = configData.guide;

    // 动画开启或关闭
    const {
        open: animation_open, // 动画开关
    } = configData.animation;

    if (!xaxis_visible) return;

    // x轴的纵坐标
    let posY = zero_pos.y;

    let newStartX = startX;
    // console.log(newStartX);
    let newEndX = rootW;

    if (dir) {
        newStartX = _mirror_axes ? rootW - startX : startX;
        newEndX = _mirror_axes ? 0 : rootW;
    } else {
        if (forwardMax) {
            newStartX = _mirror_axes ? rootW - startX : startX;
            newEndX = _mirror_axes ? 0 : rootW;
        } else {
            newStartX = _mirror_axes ? 0 : rootW;
            newEndX = _mirror_axes ? rootW - startX : startX;
        }
    }

    let lineConfig = {
        shape: {
            x1: newStartX,
            y1: posY,
            x2: animation_open ? newStartX : newEndX,
            y2: posY,
            percent: 1,
        },
        style: {
            stroke: color(line_color),
            fill: null,
            lineWidth: xaxis_w,
            lineDash: xaxis_type === 'solid' ? null : [5, 5],
        },
        z: G_INDEX.base,
    };

    let line = new Line(lineConfig);
    hr.add(line);
    if (animation_open) {
        addAnimate(line, 800, 200, { shape: { x2: newEndX } });
        // line.animate('shape')
        //     .delay(200)
        //     .when(800, {
        //         x2: newEndX,
        //     })
        //     .start();
    }
}
