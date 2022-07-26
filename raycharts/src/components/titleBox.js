import * as zrender from 'zrender';
import { Group, Rect, Text as zText } from '../shape';

import { color } from '../utils/color';
import { G_NAME, G_INDEX } from '../utils/common';

const renderLineType = (type) => (type !== 'solid' ? [2, 2, 2, 2] : '');
const limitValue = (per, limit) => (limit * per) / 100;
const alineText = (type) =>
    type === 'left' ? 'left' : type === 'center' ? 'center' : type === 'right' ? 'right' : '';
const TextPosOffsetY = (font_size) => font_size / 10;

/**
 * @method titleBox
 * @description 渲染生成标题
 * @param {Object} configData 配置项
 * @param {Object} config 设置参数
 * @returns {sub} 标题组，图形定位在左上角
 * @example
 * config: {
 *  name: 名称
 *  maxWidth: 最大宽度
 *  maxHeight: 最大高度
 *  text: 文字内容
 * }
 */
function titleBox(configData) {
    // 标题配置
    const {
        visible,
        width,
        height,
        text_align,
        background: {
            image: Bg_Image,
            border: {
                line_type: Border_Type,
                radius: {
                    tleft: Border_tl,
                    tright: Border_tr,
                    bright: Border_br,
                    bleft: Border_bl,
                },
                line_width: Border_Width,
            },
        },
        font: { font_family, font_size, font_style, text_decoration, font_weight },
    } = configData.title;

    const {
        open: open_animation, // 动画开启或者关闭，默认开启true
    } = configData.animation;

    // 标题颜色
    const { text_color, color: bgColor, border: borderColor } = configData.default_theme.title;

    return (config) => {
        const { name: baseName = '', maxWidth, maxHeight, text } = config;

        const zoom = 1;
        const TextBoxGroup = new Group({ name: `${G_NAME.title} ${baseName}`, silent: true });

        // 判断渲染逻辑
        if (!visible || width === 0 || height === 0 || text === '') return TextBoxGroup;

        const BoxWidth = limitValue(width, maxWidth);
        const BoxHeight = limitValue(height, (maxHeight * 20) / 100);
        const strokeWidth = limitValue(Border_Width, 20 * zoom);

        const boxSize = {
            shape: {
                x: 0,
                y: 0,
                width: BoxWidth,
                height: BoxHeight,
                r: [
                    limitValue(Border_tl, BoxHeight),
                    limitValue(Border_tr, BoxHeight),
                    limitValue(Border_br, BoxHeight),
                    limitValue(Border_bl, BoxHeight),
                ],
            },
        };

        const TextBox = new Rect(boxSize).attr({
            z: G_INDEX.base,
            z2: 0,
            name: `textBox ${baseName}`,
            silent: true,
            style: {
                fill: color(bgColor),
                // 描边
                lineDash: renderLineType(Border_Type),
                lineWidth: strokeWidth,
                stroke: color(borderColor),
            },
        });
        TextBoxGroup.add(TextBox);

        const TextNode = new zText({
            z2: 1,
            position: [10, BoxHeight / 2],
            style: {
                // 文字样式
                text: `${text}`,
                fontSize: font_size,
                textLineHeight: font_size,
                fill: color(text_color),
                fontFamily: font_family,
                fontStyle: font_style,
                fontWeight: font_weight,
                // 文字描边
                // textStroke: 'black',
                // textStrokeWidth: 1,
                // 超出省略
                width: BoxWidth - strokeWidth,
                overflow: 'truncate',
                ellipsis: '...',
            },
        });

        let { width: TextNode_width, height: TextNode_height } = TextNode.getBoundingRect();
        // 最大宽度限制为内盒宽度
        TextNode_width =
            TextNode_width > BoxWidth - strokeWidth ? BoxWidth - strokeWidth : TextNode_width;

        let TextNodeX = 0;
        const TextNodeY = BoxHeight / 2 - TextNode_height / 2 + TextPosOffsetY(font_size);
        if (text_align === 'left') {
            TextNodeX = strokeWidth / 2;
        } else if (text_align === 'center') {
            TextNodeX = BoxWidth / 2 - TextNode_width / 2;
        } else if (text_align === 'right') {
            TextNodeX = BoxWidth - strokeWidth / 2 - TextNode_width;
        }

        TextBoxGroup.add(TextNode.attr({ position: [TextNodeX, TextNodeY] }));

        TextBoxGroup.setClipPath(new Rect(boxSize));

        // Animate
        const addAnimate =
            (_keyPath = '') =>
            (child, i) => {
                const keyPath = _keyPath ? `${_keyPath}_${i}` : `${i}`;
                if (child instanceof zrender.Group) {
                    if (child.childCount() !== 0) {
                        return child.eachChild(addAnimate(keyPath));
                    }
                }
                child
                    .attr('style', {
                        opacity: 0,
                    })
                    .animate('style')
                    .delay(0)
                    .when(800, { opacity: 1 })
                    .start();
                return child;
            };
        if (open_animation === true) TextBoxGroup.eachChild(addAnimate());
        return TextBoxGroup;
    };
}

export default titleBox;
