/**
 * 绘制垂直网格线
 */
import { Line } from '../../shape';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
export default function draw_x_guide(hr, props) {
    // console.log(props);
    const {
        animTime, // 动画时间
        startX, // x轴开始位置
        startY,
        y_title_width, // y轴标题宽度
        y_label_width, // y轴标签宽度
        y_axis_max_height: YAxis_H, // y轴高度
        rulesY_ary,
        reserveY,
        x_axis_label_H, // x轴字体的高度
        x_axis_paddingT, // x轴上边距
        x_axis_paddingB, // x轴的下边距
        rulesX_ary,
        forwardMax,
        maxHeight: rootH,
        maxWidth: rootW,
        chartData,
        configData,
        zeroIndex,
        zero_reserveY, // 负值原点预留
        entry,
        zoom,
        dir,
    } = props;
    // 图例, 网格
    const { default_theme, guide } = configData;
    // 动画时间
    // console.log('animTime', animTime);
    const { T, t } = animTime;
    // 网格配置
    const {
        grid: {
            v_line: { line_type: v_lineType, line_width: v_lineWidth, visible: v_visible },
            h_line: { line_type: h_lineType, line_width: h_lineWidth, visible: h_visible },
            polygon: { line_type: pl_lineType, line_width: pl_lineWidth, visible: pl_visible },
            circle: { line_type: circle_lineType, line_width: circle_lineWidth, visible: circle_visible },
        },
    } = guide;

    // 动画开启或关闭
    const {
        open: animation_open, // 动画开关
    } = configData.animation;

    if (!v_visible) return;

    // 获取颜色
    const {
        grid: {
            v_line: v_line_color, // 横向线颜色
            // h_line: h_line_color, //横向线颜色
            // polygon: polygon_color, //多边形颜色
            // circle: circle_color, //环形颜色
        },
    } = default_theme.guide;

    let maxY = startY + YAxis_H; // y轴最大值
    let minY = startY; // y轴的最小值

    // 竖直方向，网格线保持和分段一样的高度
    if (dir) {
        maxY = rulesY_ary[rulesY_ary.length - 1];
        minY = rulesY_ary[0];
    }

    let new_startY = forwardMax ? maxY : minY;
    let new_endY = forwardMax ? minY : maxY;

    if (!forwardMax && dir) {
        new_startY += zero_reserveY;
    }

    let len = rulesX_ary.length;

    for (let i = 0; i < len; i++) {
        if (zeroIndex === i && !dir) continue;
        const line = new Line({
            shape: {
                x1: rulesX_ary[i],
                y1: animation_open ? new_startY : new_endY,
                x2: rulesX_ary[i],
                y2: new_startY,
                percent: 1,
            },
            style: {
                stroke: color(v_line_color),
                fill: null,
                lineWidth: v_lineWidth,
                lineDash: v_lineType === 'solid' ? null : [5, 5],
            },
            z: G_INDEX.base,
        });
        hr.add(line);

        if (animation_open) {
            addAnimate(line, 800, 200 + i * T, { shape: { y1: new_endY } });
        }
    }
}
