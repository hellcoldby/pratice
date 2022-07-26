import _ from 'lodash';
import parse from '../../parse/decorator';
import { parseMarkLine } from './parse';
import { Group, Rect, Text, Line } from '../../../../shape';

class MarkLine {
    constructor(props) {
        this.props = props;
        const { group, clipBox } = props;
        this._vNodeGroup = new Group(group).attr({ name: 'MarkLine' });
        this._vNodeGroup.setClipPath(new Rect(clipBox));
    }

    // 水平辅助线
    renderHLine() {
        const { vLine } = this.props;
        const { show, ...style } = vLine;
        const line = new Line(style);
        show && this._vNodeGroup.add(line);
    }

    // 垂直辅助线
    renderVLine() {
        const { hLine } = this.props;
        const { show, ...style } = hLine;
        const line = new Line(style);
        show && this._vNodeGroup.add(line);
    }

    render() {
        this.renderHLine();
        this.renderVLine();
        return this._vNodeGroup;
    }
}

export default parse(parseMarkLine)(MarkLine);
