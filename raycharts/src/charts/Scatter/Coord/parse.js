import { color, limitValue, renderLineType, mergeConfig } from '../parse/tool';

export const parseCoord = (props) => {
    const { originStyle, boxSize, ...partConfig } = props;

    const {
        guide: {
            xaxis: xAxis,
            yaxis: yAxis,
            grid: { v_line: vLine, h_line: hLine },
            // draw_coor,
            // padding, // 图形边距
        },
        default_theme: {
            guide: { grid: gridStyle, xaxis: xAxisStyle, yaxis: yAxisStyle },
        },
    } = originStyle;

    const [boxWidth, boxHeight] = boxSize;

    const labelWidth = 2 * xAxis.font.font_size;
    const labelPadding = 0.4 * yAxis.font.font_size;
    const labelOffset = 6;

    const xOffset = labelWidth + labelPadding * 2 + labelOffset;
    const xWeightOffset = labelWidth / 2 + labelPadding;
    const yOffset = labelOffset + labelPadding * 2 + xAxis.font.font_size;
    const yHeightOffset = yAxis.font.font_size / 2 + labelPadding;

    const baseAnchor = [xOffset, boxHeight - yOffset];
    const contentSize = [boxWidth - xWeightOffset - xOffset, boxHeight - yHeightOffset - yOffset];

    const getCustomAxis = (AxisConfig, distance) => {
        if (!AxisConfig.scale.range.open) return {};
        const { min, max } = AxisConfig.scale.range;
        let res = {
            originValue: Math.min(min, max),
            finalValue: Math.max(min, max),
        };
        if (!AxisConfig.division.a_div.visible) return res;
        res.gapValue = Number(AxisConfig.division.a_div.value);
        res.pixelRatioValue = distance / Math.abs(max - min);
        return res;
    };

    const additionConfig = {
        originStyle,
        baseAnchor,
        contentSize,
        xAxis: {
            show: true,
            type: 'value',
            direction: 'bottom',
            length: contentSize[0],
            ...getCustomAxis(xAxis, contentSize[0]),
            line: {
                show: xAxis.visible,
                style: {
                    stroke: color(xAxisStyle.line_color),
                    lineDash: renderLineType(xAxis.line.line_type),
                    lineWidth: limitValue(xAxis.line.line_width, 100),
                },
            },
            scale: {
                show: xAxis.visible && xAxis.division.a_div.visible,
                style: {
                    stroke: color(xAxisStyle.line_color),
                    lineDash: renderLineType(xAxis.division.a_div.line_type),
                    lineWidth: limitValue(xAxis.division.a_div.line_width, 100),
                },
            },
            label: {
                show: xAxis.text_visible,
                offset: labelOffset,
                style: {
                    textPadding: labelPadding,
                    fill: color(xAxisStyle.label.text_color),
                    textBackgroundColor: color(xAxisStyle.label.color),
                    fontSize: xAxis.font.font_size,
                    fontStyle: xAxis.font.font_style,
                    fontWeight: xAxis.font.font_weight,
                    fontFamily: xAxis.font.font_family,
                },
            },
        },
        yAxis: {
            show: true,
            type: 'value',
            direction: 'left',
            length: contentSize[1],
            ...getCustomAxis(yAxis, contentSize[1]),
            line: {
                show: yAxis.visible,
                style: {
                    stroke: color(yAxisStyle.line_color),
                    lineDash: renderLineType(yAxis.line.line_type),
                    lineWidth: limitValue(yAxis.line.line_width, 100),
                },
            },
            scale: {
                show: yAxis.visible && yAxis.division.a_div.visible,
                style: {
                    stroke: color(yAxisStyle.line_color),
                    lineDash: renderLineType(yAxis.division.a_div.line_type),
                    lineWidth: limitValue(yAxis.division.a_div.line_width, 100),
                },
            },
            label: {
                show: yAxis.text_visible,
                offset: labelOffset,
                style: {
                    textPadding: labelPadding,
                    fill: color(yAxisStyle.label.text_color),
                    textBackgroundColor: color(yAxisStyle.label.color),
                    fontSize: yAxis.font.font_size,
                    fontStyle: yAxis.font.font_style,
                    fontWeight: yAxis.font.font_weight,
                    fontFamily: yAxis.font.font_family,
                },
            },
        },
        grid: {
            vLine: {
                show: vLine.visible,
                style: {
                    stroke: color(gridStyle.v_line),
                    lineDash: renderLineType(vLine.line_type),
                    lineWidth: limitValue(vLine.line_width, 100),
                },
            },
            hLine: {
                show: hLine.visible,
                style: {
                    stroke: color(gridStyle.h_line),
                    lineDash: renderLineType(hLine.line_type),
                    lineWidth: limitValue(hLine.line_width, 100),
                },
            },
        },
    };

    const newProps = mergeConfig(partConfig, additionConfig);

    return newProps;
};
