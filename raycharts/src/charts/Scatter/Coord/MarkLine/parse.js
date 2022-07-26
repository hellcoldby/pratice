import { G_INDEX, color, limitValue, renderLineType, mergeConfig } from '../../parse/tool';

export const parseMarkLine = (props) => {
    const { originStyle, baseAnchor, size, getXPosition, getYPosition, ...partConfig } = props;

    const {
        assistant: {
            auxiliary: { xline: hLine, yline: vLine },
        },
        default_theme: {
            assistant: { auxiliary: markStyle },
        },
    } = originStyle;

    const [boxWidth, boxHeight] = size;

    const vLineTarget = getXPosition(vLine.data);
    const hLineTarget = getYPosition(hLine.data);

    const additionConfig = {
        size,
        group: {
            position: baseAnchor,
            scale: [1, -1],
        },
        clipBox: {
            shape: {
                width: boxWidth,
                height: boxHeight,
            },
        },
        vLine: {
            show: vLine.show,
            z: G_INDEX.point,
            shape: {
                x1: vLineTarget,
                x2: vLineTarget,
                y2: boxHeight,
            },
            style: {
                stroke: color(markStyle.yline_color),
                lineDash: renderLineType(vLine.line_type),
                lineWidth: limitValue(vLine.line_width, 100),
            },
        },
        hLine: {
            show: hLine.show,
            z: G_INDEX.point,
            shape: {
                y1: hLineTarget,
                x2: boxWidth,
                y2: hLineTarget,
            },
            style: {
                stroke: color(markStyle.xline_color),
                lineDash: renderLineType(hLine.line_type),
                lineWidth: limitValue(hLine.line_width, 100),
            },
        },
    };

    const newProps = mergeConfig(partConfig, additionConfig);

    return newProps;
};
