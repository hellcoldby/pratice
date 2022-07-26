/*
 * @Description:绘制y轴
 * @Author: ygp
 * @Date: 2020-11-03 14:39:26
 * @LastEditors: ygp
 * @LastEditTime: 2021-08-13 14:29:36
 */
import { Line } from '../../shape';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
export default function draw_y_axis(hr, props) {
    // console.log(props);
    const {
        animTime, // 动画时间
        startX, // x轴开始位置
        startY,
        y_title_width, // y轴标题宽度
        y_label_width, // y轴标签宽度
        y_axis_max_height, // y轴高度
        rulesY_ary,
        reserveY,
        rulesX_ary,
        forwardMax,
        maxHeight: rootH,
        maxWidth: rootW,
        chartData,
        configData,
        zeroIndex,
        zero_pos,
        entry,
        zoom,
        dir,
    } = props;

    // 图例, 网格
    const { legend, default_theme } = configData;
    const {
        xaxis: {
            visible: xaxis_visible,
            line: { line_width: xaxis_w },
        },
        yaxis: {
            visible: yaxis_visible,
            line: { line_type, line_width: yaxis_w },
        },
    } = configData.guide;

    // 坐标系镜像开关
    const {
        general: { mirrorAxes },
    } = configData;

    // 获取颜色
    const {
        yaxis: { line_color },
    } = default_theme.guide;

    // 动画开启或关闭
    const {
        open: animation_open, // 动画开关
    } = configData.animation;

    if (!yaxis_visible) return;

    let newStartX = zero_pos.x;
    let maxY = 0;
    let minY = 0;

    if (dir) {
        maxY = rulesY_ary[rulesY_ary.length - 1]; // y轴最大值
        minY = rulesY_ary[0]; // y轴的最小值
    } else {
        maxY = startY + y_axis_max_height; // y轴最大值
        minY = startY; // y轴的最小值
    }

    let new_startY = forwardMax ? maxY : minY;
    let new_endY = forwardMax ? minY : maxY;

    // 线条的配置文件
    let lineConfig = {
        shape: {
            x1: newStartX,
            y1: animation_open ? new_startY : new_endY,
            x2: newStartX,
            y2: new_startY,
            percent: 1,
        },
        style: {
            stroke: color(line_color),
            fill: null,
            lineWidth: yaxis_w,
            lineDash: line_type === 'solid' ? null : [5, 5],
        },
        z: G_INDEX.base,
    };

    let line = new Line(lineConfig);
    hr.add(line);

    if (animation_open) {
        addAnimate(line, 800, 200, { shape: { y1: new_endY } });
        // line.animate('shape')
        //     .delay(200)
        //     .when(800, {
        //         y1: new_endY,
        //     })
        //     .start();
    }
}
