import { Rect, Text } from '../../shape';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
import { getFontWidth } from './guide_common';
export default function draw_y_label(hr, props) {
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
        rulesX_ary,
        forwardMax,
        minusMin,
        maxHeight: rootH,
        maxWidth: rootW,
        chartData: pData,
        configData,
        zeroIndex,
        zero_reserveX,
        total_alines,
        average_every_value,
        entry,
        zoom,
        dir, // 柱形图 或 条形图
        larger,
        smaller,
        aDiv_num,
        t_isPoint, // 轴均分线是否存在小数
        t_point_val, // 轴均分线小数部分的值
        axis_value_ary, // 轴数值集合
        axis_label_ary, // 轴标签集合
        positionList,
        scale_len, //
    } = props;

    // 柱形图如果没有检测到平均值，就说明不需要绘制y轴的数据
    if (dir && !average_every_value) return null;

    const { guide, default_theme, background } = configData;
    // 动画时间
    const { T, t } = animTime;
    // 字体配置
    const {
        yaxis: {
            text_visible,
            text_offset: y_text_offset,
            line: { line_type, line_width },
            font: { font_family, font_size, font_style, text_decoration, font_weight },
        },
        draw_coor: {
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

    const {
        padding: { left: paddingL, top: paddingT, right: paddingR, bottom: paddingB },
    } = background;

    // 获取颜色
    const {
        yaxis: {
            label: { text_color, color: bgColor, border: borderColor },
        },
    } = default_theme.guide;

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
    // y轴标签文字(条形图使用)
    let YAxis_name = null;

    // 默认柱形图为例，y轴均分线数量根据正负值变化
    let len = 0;
    if (dir) {
        len = axis_value_ary.length;
    } else {
        YAxis_name = positionList;
        len = YAxis_name.length;
    }

    // 左右内边距2px
    const paddingLR = 2 * zoom;
    const a_div_len = dir ? scale_len : 0;

    for (let i = 0; i < len; i++) {
        let curText = '';
        let textW = 0;
        // y轴上每个位置的值
        if (dir) {
            curText = axis_value_ary[i];
        } else {
            curText = String(YAxis_name[i].cName);
        }
        // console.log(curText);
        // 获取字体的宽度
        textW = getFontWidth(curText, font_size, font_family);
        if (textW >= rootW / 3) {
            // console.log(rootW / 3, paddingL);
            textW = rootW / 3;
        }

        let curX = _mirror_axes ? rootW + textW : -textW;
        let endX = _mirror_axes ? rootW - startX + paddingLR + a_div_len : startX - textW - paddingLR - a_div_len;

        endX -= y_text_offset;

        // console.log(startX, endX, y_text_offset, a_div_len);
        let curY = rulesY_ary[i] - font_size / 2;

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
            z: G_INDEX.base + 1,
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
                    duration: 300,
                    delay: 300,
                },
            );
        }

        const rect = new Rect({
            origin: [0, curY],
            shape: {
                x: animation_open ? curX : endX,
                y: curY,
                width: textW,
                height: font_size,
            },
            style: {
                fill: color(bgColor),
                stroke: color(borderColor),
                lineWidth: 1,
                truncate: {
                    outerWidth: (textW = rootW / 3) ? textW : textW + paddingLR,
                },
                opacity: animation_open ? 0 : 1,
            },
            textConfig: {
                position: 'inside',
            },
            textContent: text,
            z: G_INDEX.base,
        });
        hr.add(rect);

        if (animation_open) {
            addAnimate(rect, 300, 200, { shape: { x: endX }, style: { opacity: 1 } });
        }
    }
}
