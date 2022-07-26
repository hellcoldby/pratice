/**
 * 绘制水平网格线
 *
 */
import { Line } from '../../shape';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
export default function draw_y_guide(hr, props) {
    const {
        animTime, // 动画时间
        startX, // x轴开始位置
        startY,
        y_title_width, // y轴标题宽度
        y_label_width, // y轴标签宽度
        y_axis_max_height: YAxis_H, // y轴高度
        rulesY_ary,
        reserveY,
        rulesX_ary,
        forwardMax,
        maxHeight: rootH,
        maxWidth: rootW,
        chartData,
        configData,
        zeroIndex,
        zero_reserveX,
        total_alines,
        entry,
        zoom,
        dir,
    } = props;

    // 图例, 网格
    const { legend, default_theme, guide } = configData;
    // 动画时间
    const { T, t } = animTime;
    // 网格配置
    const {
        grid: {
            v_line: { line_type: v_lineType, line_width: v_lineWidth, visible: v_visible },
            h_line: { line_type: h_lineType, line_width: h_lineWidth, visible: h_visible },
            polygon: { line_type: pl_lineyTpe, line_width: pl_lineWidth, visible: pl_visible },
            circle: { line_type: circle_lineType, line_width: circle_lineWidth, visible: circle_visible },
        },
    } = guide;
    // y轴宽度
    const {
        yaxis: {
            visible: yaxis_visible,
            line: { line_type, line_width: yaxis_w },
        },
    } = configData.guide;

    // 动画开启或关闭
    const {
        open: animation_open, // 动画开关
    } = configData.animation;

    // 坐标系镜像开关
    const { _mirror_axes } = configData;

    // 获取颜色
    const {
        grid: {
            // v_line: v_line_color, //横向线颜色
            h_line: h_line_color, // 横向线颜色
            // polygon: polygon_color, //多边形颜色
            // circle: circle_color, //环形颜色
        },
    } = default_theme.guide;

    if (!h_visible) return;

    let len = rulesY_ary.length;
    let posY = 0;

    let newStartX = startX;
    let newEndX = rootW - zero_reserveX;

    if (dir) {
        newStartX = _mirror_axes ? rootW - startX : startX;
        newEndX = _mirror_axes ? 0 : rootW;
    } else {
        if (forwardMax) {
            newStartX = _mirror_axes ? rootW - startX : startX;
            newEndX = _mirror_axes ? 0 : rootW;
        } else {
            newStartX = _mirror_axes ? zero_reserveX : rootW - zero_reserveX;
            newEndX = _mirror_axes ? rootW - startX : startX;
        }
    }

    for (let i = 0; i < len; i++) {
        if (dir && zeroIndex === i) continue;

        posY = rulesY_ary[i];

        const line = new Line({
            shape: {
                x1: newStartX,
                y1: posY,
                x2: animation_open ? newStartX : newEndX,
                y2: posY,
                percent: 1,
            },
            style: {
                stroke: color(h_line_color),
                fill: null,
                lineWidth: h_lineWidth,
                lineDash: h_lineType === 'solid' ? null : [5, 5],
            },
            z: G_INDEX.base,
        });
        hr.add(line);
        if (animation_open) {
            addAnimate(line, 800, 200 + (len - i) * T, { shape: { x2: newEndX } });
        }
    }
}
