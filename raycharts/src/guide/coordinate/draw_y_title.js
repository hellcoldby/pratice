import { Rect, Group, Text } from '../../shape';
import { color } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
import { getRound, ellipsisH } from './guide_common';
export default function draw_y_label(hr, props) {
    // console.log(props);
    const {
        animTime, // 动画时间
        startX, // x轴开始位置
        startY,
        y_title_width, // y轴标题宽度
        y_label_width, // y轴标签宽度
        y_axis_max_height: YAxis_H, // y轴高度
        x_axis_label_H, // x轴标签高度
        x_axis_paddingT, // x轴上边距
        x_axis_paddingB, // x轴的下边距
        x_axis_title_H, // x轴标题的高度
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
        yaxis: {
            title: {
                visible,
                text: title_text,
                width: title_width,
                height: title_height,
                vertical_align: title_textAlign,
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
        yaxis: {
            line_color,
            title: { text_color: titleColor, color: titleBgColor, border: titleBorderColor },
            label: { text_color: label_textColor, color: label_bgColor, border: label_borderColor },
        },
    } = default_theme.guide;

    // 动画开启或关闭
    const {
        open: animation_open, // 动画开关
    } = configData.animation;

    // 不显示返回
    if (!visible) return;
    if (!title_text) return;

    // 包围盒的宽度
    let rectW = (title_width / 100) * rootW * 0.2;
    // 包围盒的高度
    let rectH = (title_height / 100) * (rootH - x_axis_label_H - x_axis_paddingT - x_axis_paddingB - x_axis_title_H);

    // 比较宽高中较小的边
    const borderMin = Math.min(rectW, rectH);

    // 边框宽度
    const borderW = (title_line_width / 100) * borderMin;

    // 计算文字的Y坐标
    let posY = 0;
    // 每个文字的占位
    let unique_text_H = font_size + font_size * 0.15;

    // 文字超出部分显示省略号
    let _title_text = ellipsisH(title_text, rectH - borderW, unique_text_H);
    // 拆分文字
    let text_list = _title_text.split('');
    // 所有文字的占位
    let text_total_H = text_list.length * unique_text_H;

    // 计算y轴标题的位置 上 中 下
    switch (title_textAlign) {
        case 'top':
            posY = borderW / 2;
            break;
        case 'middle':
            posY = (rectH - text_total_H) / 2;
            break;
        case 'bottom':
            posY = rectH - borderW / 2 - text_total_H;
            break;
    }

    // 拆分文字打组
    const label_group = new Group({
        position: [(rectW - font_size) / 2, posY],
    });

    text_list.forEach((item, index) => {
        const text = new Text({
            style: {
                text: item,
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
                    duration: 300,
                    delay: 600,
                },
            );
        }
        const rect = new Rect({
            shape: {
                x: 0,
                y: unique_text_H * index,
                width: font_size,
                height: font_size,
            },
            style: {
                fill: null,
                textFill: color(titleColor),
                opacity: animation_open ? 0 : 1,
            },
            textConfig: {
                position: 'inside',
            },
            textContent: text,
            z: 1,
        });
        label_group.add(rect);
    });

    if (animation_open) {
        addAnimate(label_group, 300, 600, { style: { opacity: 1 } });
        // label_group.eachChild((item) => {
        //     item.animate('style')
        //         .delay(600)
        //         .when(300, {
        //             opacity: 1,
        //         })
        //         .start();
        // });
    }

    // 绘制y轴文字的边框
    let outer = new Rect({
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
            fill: color(titleBgColor),
            stroke: color(titleBorderColor),
            lineDash: title_border === 'solid' ? null : [3, 3],
            lineWidth: borderW,
        },
    });

    // 文字和边框再打组
    let all_group = new Group({
        position: [_mirror_axes ? rootW - rectW : 0, 0],
    });

    all_group.add(label_group);
    all_group.add(outer);

    // // 绘制裁剪框
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
            stroke: 'yellow',
            fill: null,
            opacity: 1,
        },
    });

    // all_group.add(clip);
    all_group.setClipPath(clip);

    hr.add(all_group);
}
