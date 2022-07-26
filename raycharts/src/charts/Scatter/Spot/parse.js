import { G_INDEX, color, limitValue, renderLineType, mergeConfig } from '../parse/tool';

const parseSpot = (props) => {
    const { originStyle, sizeLimit, size, zBase, colorKey, ...partConfig } = props;

    const {
        general: { size_range, light, outset, inset, border },
        default_theme: {
            graph: { colors: colorList, border: borderStyle, outset: outsetStyle },
        },
        animation: { open: animOpen, entry: anim_entry_list },
    } = originStyle;

    const [minSize = 10, maxSize = 10] = size_range ?? [];

    // size
    const squareMin = minSize ** 2;
    const squareMax = maxSize ** 2;
    const squareSize = squareMin + (squareMax - squareMin) * size;
    const sizeLimitValue = limitValue(Math.sqrt(squareSize), sizeLimit);

    // majorColor
    const majorColor = color(colorList[colorKey % colorList.length]);

    // zIndex
    const zIndex = zBase * 3;

    const additionConfig = {
        size: sizeLimitValue,
        color: majorColor,
        graph: {
            z2: zIndex + 1,
            z: G_INDEX.shape,
            style: {
                fill: color(majorColor),
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: limitValue(light.extent, 200),
                shadowColor: color(majorColor, { opacity: light.opacity / 100 }),
            },
        },
        border: {
            z2: zIndex + 2,
            z: G_INDEX.shape,
            style: {
                fill: 'transparent',
                stroke: color(borderStyle),
                lineWidth: limitValue(border.line_width, sizeLimitValue / 4),
                lineDash: renderLineType(border.line_type, border.dash_array),
            },
        },
        outset: {
            z2: zIndex,
            z: G_INDEX.shape,
            style: {
                fill: color(majorColor),
                shadowOffsetX: limitValue(outset.h, 100),
                shadowOffsetY: limitValue(outset.v, 100),
                shadowBlur: limitValue(outset.blur, 200),
                shadowColor: color(outsetStyle),
            },
        },
        anim: {
            animOpen,
            anim_entry_list,
        },
    };

    const newProps = mergeConfig(partConfig, additionConfig);

    return newProps;
};

export { parseSpot };
