import { Rect, Group, Text } from '../../shape';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
import { ellipsisW, getRound, getFontWidth } from './guide_common';
export default function draw_x_title(hr, props) {
    // console.log(props);
    const {
        animTime, // 动画时间
        startX, // x轴开始位置
        startY,
        y_title_width, // y轴标题宽度
        y_label_width, // y轴标签宽度
        y_axis_max_height: YAxis_H, // y轴高度
        x_axis_label_H, // x轴标签高度
        x_axis_title_H,
        x_axis_paddingT, // x轴上边距
        x_axis_paddingB, // x轴的下边距
        rulesY_ary,
        reserveY,
        rulesX_ary,
        forwardMax,
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
        dir,
        larger,
        smaller,
    } = props;

    // 计算字体的宽度
    const { guide, legend, default_theme, _mirror_axes } = configData;
    // 字体配置
    const {
        xaxis: {
            title: {
                visible,
                text: title_text,
                width: title_width,
                height: title_height,
                text_align,
                background: {
                    image: title_bg_image,
                    border: {
                        line_type: title_border, // 标题的边框样式(固态和虚线)
                        radius: {
                            tleft: title_border_tl, // 标题的边框圆角
                            tright: title_border_tr,
                            bright: title_border_br,
                            bleft: title_border_bl,
                        },
                        line_width: title_line_width, // 边框的宽度
                    },
                },
                font: { font_family, font_size, font_style, text_decoration, font_weight },
            },
            limit: { start: limitStart, end: limitEnd },
        },
    } = guide;

    // 获取颜色
    const {
        xaxis: {
            line_color,
            title: { text_color: titleColor, color: titleBgColor, border: titleBorderColor },
            label: { text_color: label_textColor, color: label_bgColor, border: label_borderColor },
        },
    } = default_theme.guide;

    // 动画开启或关闭
    const {
        open: animation_open, // 动画开关
    } = configData.animation;

    // 动画时间
    const { T, t } = animTime;

    // 不显示返回
    if (!visible) return;

    // 文字占的宽度
    // const title_w = getFontWidth(title_text, font_size, font_family) * zoom;
    // 包围盒的宽度--以图表宽度为基准，百分比计算包围盒宽度
    const rectW = (title_width / 100) * (rootW - startX);
    // 包围盒的高度
    const rectH = x_axis_title_H;

    // 比较宽高中较小的边
    const borderMin = Math.min(rectW, rectH);

    // 边框宽度
    const borderW = (title_line_width / 100) * borderMin;

    let _title_text = title_text;
    _title_text = ellipsisW(title_text, rectW - borderW, font_size, font_family);

    // 计算y轴定位
    const posY = YAxis_H + x_axis_paddingT + x_axis_label_H + x_axis_paddingB + reserveY;

    const text_group = new Group({
        position: [_mirror_axes ? rootW - startX - rectW : startX, posY],
    });

    // 所有文字的总宽度
    const text_total_W = getFontWidth(_title_text, font_size, font_family);

    // 文字的坐标
    let text_posX = startX;
    let text_posY = (rectH - font_size) / 2;

    // 获取对齐方式
    // let textAlign = 'left';
    // let textPosition = [0, 0];

    // ({ textAlign, textPosition } = getAlignMent());

    switch (text_align) {
        case 'left':
            text_posX = borderW / 2;
            break;
        case 'center':
            text_posX = (rectW - text_total_W) / 2;
            break;
        case 'right':
            text_posX = rectW - text_total_W - borderW / 2;
            break;
        default:
            break;
    }

    const text = new Text({
        style: {
            text: _title_text,
            fill: color(titleColor),
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
                delay: 200,
            },
        );
    }

    const rect = new Rect({
        shape: {
            x: text_posX,
            y: text_posY,
            width: text_total_W,
            height: font_size,
        },
        style: {
            stroke: null,
            fill: null,
            textAlign: 'center',
            transformText: true, // 跟随文字的方向
            opacity: animation_open ? 0 : 1,
        },
        textConfig: {
            position: 'inside',
        },
        textContent: text,
        z: G_INDEX.slot,
    });

    // 绘制背景框
    const bgOuter = new Rect({
        shape: {
            x: 0,
            y: 0,
            width: rectW,
            height: rectH,
            r: [
                getRound(borderMin, title_border_tl),
                getRound(borderMin, title_border_tr),
                getRound(borderMin, title_border_br),
                getRound(borderMin, title_border_bl),
            ],
        },
        style: {
            stroke: color(titleBorderColor),
            fill: color(titleBgColor),
            lineDash: title_border === 'solid' ? null : [3, 3],
            lineWidth: borderW,
            opacity: 1,
        },
        z: G_INDEX.base,
    });

    text_group.add(rect);
    text_group.add(bgOuter);

    // 绘制裁剪框
    const clip = new Rect({
        shape: {
            x: 0,
            y: 0,
            width: rectW,
            height: rectH,
            r: [
                getRound(borderMin, title_border_tl),
                getRound(borderMin, title_border_tr),
                getRound(borderMin, title_border_br),
                getRound(borderMin, title_border_bl),
            ],
        },
        style: {
            stroke: 'red',
            fill: null,
            opacity: 1,
        },
    });
    // text_group.add(clip);
    text_group.setClipPath(clip);

    if (animation_open) {
        addAnimate(text, t, 200, { style: { opacity: 1 } });
    }

    hr.add(text_group);
}
