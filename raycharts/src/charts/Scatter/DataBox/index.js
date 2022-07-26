import parse from '../parse/decorator';
import { parseDataBox } from './parse';
import { Group, Rect, Text } from '../../../shape';

class DataBox {
    constructor(props) {
        this.props = props;
        this._NodeBox = new Group(props.group);
    }

    renderText() {
        const { text } = this.props;
        const { show, ...textStyle } = text;
        if (show) {
            const textNode = new Text(textStyle);
            this._NodeBox.add(textNode);
        }
    }

    renderBox() {
        const { box } = this.props;
        const { show, ...boxStyle } = box;
        if (show) {
            const boxNode = new Rect(boxStyle);
            this._NodeBox.add(boxNode);
        }
    }

    render() {
        const { show } = this.props;

        show && this.renderText();
        show && this.renderBox();

        return this._NodeBox;
    }
}

export default parse(parseDataBox)(DataBox);
