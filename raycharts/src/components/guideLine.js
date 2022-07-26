import { Group, Line } from '../shape';
import { G_NAME, G_INDEX } from '../utils/common';
import { color } from '../utils/color';

const renderLineType = (type) => (type !== 'solid' ? [5, 5] : '');
const limitValue = (per, limit) => (limit * per) / 100;

/**
 * @method addGuideLine 添加指引线
 * @param {object} config
 */
export function guideLine(opts) {
    const { config, point } = opts;
    const { guide_line, guide_line_2 } = config.data;
    const { guide_line: line_color, guide_line_2: line_color_2 } = config.default_theme.data;
    const [start, middle, end] = point;
    let lineSet = new Group({
        name: G_NAME.data + 'guideLine',
        z: G_INDEX.data,
    });
    lineSet.add(
        new Line({
            name: G_NAME.data + 'guideLine 1',
            shape: { x1: start.x, y1: start.y, x2: middle.x, y2: middle.y },
            style: {
                stroke: color(line_color),
                lineDash: renderLineType(guide_line.line_type),
                lineWidth: limitValue(guide_line.line_width, 100),
            },
        }),
    );
    lineSet.add(
        new Line({
            name: G_NAME.data + 'guideLine 2',
            shape: { x1: middle.x, y1: middle.y, x2: end.x, y2: end.y },
            style: {
                stroke: color(line_color_2),
                lineDash: renderLineType(guide_line_2.line_type),
                lineWidth: limitValue(guide_line_2.line_width, 100),
            },
        }),
    );
    return lineSet;
}
