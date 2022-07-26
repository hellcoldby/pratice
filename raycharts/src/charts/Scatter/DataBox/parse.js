import { G_NAME, G_INDEX, color, limitValue as limit, renderLineType, mergeConfig, getTextBox } from '../parse/tool';

export const parseDataBox = (props) => {
    const { originStyle, text, zBase, offSetSize, sizeLimit, isMin, isMax, ...partConfig } = props;

    const {
        general: { size_range },
        data: {
            visible: textVisible, // 文字的显示隐藏
            font: fontStyle, // 文字的样式
            show: addFilter, // 显示方式（全部，最大等）
            type: dataType, // 显示的数值格式(数字 百分比)
            // position, // 气泡的位置（上， 中， 下）
            v_offset: vOffset, // 文字的垂直偏移量
            h_offset: hOffset,
            bubble: {
                visible: boxVisible, // 气泡的显示隐藏
                border: {
                    radius: boxRadius, // 气泡的边框圆角
                    line_type: borderLineType, // 气泡的边框样式
                    line_width: borderLineWidth, // 气泡的边框宽度
                },
            },
        },
        default_theme: {
            data: {
                text_color, // 文字的颜色
                text_stroke, // 描边的颜色
                bubble: {
                    color: boxFillColor, // 气泡背景色
                    border: boxBorderColor, // 气泡边框颜色
                },
            },
        },
    } = originStyle;
    const [minSize = 10, maxSize = 10] = size_range ?? [];

    // 过滤器
    const addFilterDataBox =
        addFilter === 'ex' ? isMin || isMax : addFilter === 'min' ? isMin : addFilter === 'max' ? isMax : true;

    // 文字
    const textFontsize = Math.abs(fontStyle.font_size) || 1;
    const textLineHeight = textFontsize;
    const textPadding = textLineHeight / 5;
    const textRectify = textLineHeight / 8;

    // 文字样式
    const textStyle = {
        text: `${text}`,
        fill: color(text_color),
        stroke: color(text_stroke),
        // 样式
        fontStyle: fontStyle.font_style,
        fontWeight: fontStyle.font_weight,
        fontFamily: fontStyle.font_family,
        fontSize: textFontsize,
        // 行内布局
        align: 'center',
        // verticalAlign: 'middle', // 与 padding 冲突
        lineHeight: textLineHeight,
        // 盒模型
        padding: [textPadding + textRectify, textPadding, textPadding - textRectify, textPadding],
    };

    // 获取 文字节点 size
    const { width: textWidth, height: textHeight } = getTextBox({ style: textStyle });

    // 盒子大小
    const boxWidth = Math.max(textWidth, textHeight * 2);
    const boxHeight = textHeight;

    // 偏移量计算
    const squareMin = minSize ** 2;
    const squareMax = maxSize ** 2;
    const squareSize = squareMin + (squareMax - squareMin) * offSetSize;
    const offsetLimit = limit(Math.sqrt(squareSize), sizeLimit);

    // 盒子坐标
    const boxX = -boxWidth / 2;
    const boxY = -boxHeight / 2;

    // 盒子偏移
    const offsetX = limit(vOffset, offsetLimit);
    const offsetY = limit(-hOffset, offsetLimit);

    // 描边宽
    const lineWidth = limit(borderLineWidth, Math.min(boxWidth, boxHeight));

    // zIndex
    const zIndex = zBase * 2;

    const DataBoxProps = {
        show: textVisible && addFilterDataBox,
        group: {
            name: G_NAME.data,
        },
        text: {
            show: true,
            silent: true,
            z2: 1,
            z: G_INDEX.data,
            x: offsetX,
            y: boxY + offsetY,
            style: {
                // borderWidth: 1,
                // borderColor: '#fff',
                ...textStyle,
            },
        },
        box: {
            show: boxVisible,
            silent: true,
            z2: zIndex,
            z: G_INDEX.bubble,
            x: offsetX,
            y: offsetY,
            shape: {
                x: boxX,
                y: boxY,
                width: boxWidth,
                height: boxHeight,
                r: [
                    limit(boxRadius.tleft, boxWidth),
                    limit(boxRadius.tright, boxWidth),
                    limit(boxRadius.bright, boxWidth),
                    limit(boxRadius.bleft, boxWidth),
                ],
            },
            style: {
                fill: color(boxFillColor),
                lineWidth: lineWidth,
                stroke: color(boxBorderColor),
                lineDash: renderLineType(borderLineType),
                lineCap: 'square',
            },
        },
    };

    return mergeConfig(partConfig, DataBoxProps);
};
