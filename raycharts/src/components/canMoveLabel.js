/*
 * Description:可移动文本，支持调整偏移量
 * Author: vicky
 * Date: 2020-11-17 17:33:46
 * LastEditTime: 2021-12-08 12:22:26
 * FilePath: \packages\raycharts\src\components\canMoveLabel.js
 */
import { Group, Rect, Text } from '../shape';
import { color, dashArray, measureText } from '../utils/index';
import _ from 'lodash';

export default function canMoveLabel(params) {
    const {
        g_name,
        z,
        content,
        h_offset: hOffsetCustom,
        v_offset: vOffsetCustom,
        maxOffset,
        origin,
        style: styleCustom,
        colors: colorsCustom,
        dataOptions: data,
        dataTheme,
        showOpen = false,
        textNumInfo,
    } = params;
    let labelGroup = new Group({ name: g_name });
    let isRender = true;
    if (showOpen) {
        let show = data?.show;
        if (
            (show === 'max' && !textNumInfo.isMax) ||
            (show === 'min' && !textNumInfo.isMin) ||
            (show === 'ex' && !textNumInfo.isMax && !textNumInfo.isMin)
        ) {
            isRender = false;
        }
    }
    if (!content && content !== 0) {
        isRender = false;
    }
    if (isRender) {
        let h_offset = hOffsetCustom ? hOffsetCustom : data?.h_offset;
        let v_offset = vOffsetCustom ? vOffsetCustom : data?.v_offset;
        let style = styleCustom
            ? styleCustom
            : data
            ? {
                  font: data.font,
                  text_stroke: data.text_stroke,
                  borderHide: !data.bubble.visible,
                  border: data.bubble.border,
                  radius: data.bubble.border.radius,
              }
            : null;
        let colors = colorsCustom
            ? colorsCustom
            : dataTheme
            ? {
                  text: dataTheme.text_color,
                  text_stroke: dataTheme.text_stroke,
                  border: dataTheme.bubble.border,
                  bg: data.bubble.visible ? dataTheme.bubble.color : null,
              }
            : null;
        let x = origin?.x || 0;
        let y = origin?.y || 0;
        let font = style.font;
        // 最大偏移量
        let maxOF = maxOffset || 0;
        // 偏移量
        let vOF = h_offset || 0;
        let hOF = v_offset || 0;
        // 获取基本样式属性
        let fontFamily = _.get(font, 'font_family', '微软雅黑');
        let fontSize = _.get(font, 'font_size', '14');
        let fontWeight = _.get(font, 'font_weight', 'normal');
        let fontStyle = _.get(font, 'font_style', 'normal');
        const textConfig = {
            fontFamily,
            fontSize,
            fontWeight,
            fontStyle,
        };
        // 文本宽高
        const { width: tw, height: th } = measureText(content, textConfig);
        // 获取背景及描边配置
        const padding = th / 6;
        // 默认宽度为字符高度的2.2倍，字符宽度超出默认，宽度计算按照宽度字符长度+左右内边距
        let defaultW = th * 2.2;
        const rectWidth = tw > defaultW ? tw + padding * 2 : defaultW;
        const rectHeight = th + padding * 2;
        // 描边宽度
        let lw = !style.borderHide ? (style.border.line_width / 100) * Math.min(rectWidth, rectHeight) : 0;
        // 位移位置
        let hf = (vOF / 100) * maxOF * 1.5;
        let vf = (hOF / 100) * maxOF * 1.5;
        // 边框角度
        let r = [0, 0, 0, 0];
        if (style.radius) {
            r = [style.radius.tleft, style.radius.tright, style.radius.bright, style.radius.bleft];
        }
        const text = new Text({
            x: lw / 2 + (rectWidth - tw) / 2 + tw / 2,
            y: lw / 2 + rectHeight / 2 + 2,
            // textPosition: [lw / 2 + (rectWidth - tw) / 2 + tw / 2, lw / 2 + rectHeight / 2 + 2],
            style: {
                text: content,
                stroke: colors.text_stroke ? color(colors.text_stroke) : null,
                fill: colors.text ? color(colors.text) : null,
                ...textConfig,
                lineHeight: th,
                verticalAlign: 'middle',
                align: 'center',
            },
            z,
        });

        let textRect = new Rect({
            name: 'canMoveLabel',
            z,
            shape: {
                x: x - rectWidth / 2,
                y: y - rectHeight / 2,
                width: rectWidth,
                height: rectHeight,
                r,
            },
            origin: [x, y],
            position: [hf, -vf],
            style: {
                opacity: 1,
                fill: colors.bg ? color(colors.bg) : null,
                stroke: !style.borderHide && colors.border ? color(colors.border) : null,
                lineWidth: !style.borderHide ? lw : 0,
                lineDash: !style.borderHide && style.border.line_type !== 'solid' ? dashArray : null,
                lineCap: 'square',
            },
            textConfig: {
                position: 'inside',
            },
            textContent: text,
        });
        labelGroup.add(textRect);
    }
    return labelGroup;
}
