import _ from 'lodash';
import { Group, Rect, Text, Line } from '../../../shape';

class Grid {
    constructor(config) {
        // basic
        const { size } = config;
        const [width, height] = size;

        this.width = width;
        this.height = height;

        // init group
        const { container, name } = config;
        this.container = container instanceof Group ? container : null;
        this.containerConfig = {
            name: name + `Grid`,
            scale: [1, -1],
            silent: true,
        };

        // style
        const { vLine = {}, hLine = {} } = config;
        // 水平网格线
        this.hLineStyle = {
            show: false,
            ...hLine,
        };
        // 垂直网格线
        this.vLineStyle = {
            show: true,
            ...vLine,
        };

        // 网格线的位置
        const { xLineData = [], yLineData = [] } = config;
        // 由y轴提供数据
        this.hLinePosition = yLineData.flatMap(this.filterData);
        // 由x轴提供数据
        this.vLinePosition = xLineData.flatMap(this.filterData);
    }

    // 数据转换，由轴线的渲染数据转换到网格线的渲染数据
    // 用于轴线筛选和判断
    filterData(data) {
        const [distance, label] = data;
        const res = distance === 0 ? [] : distance;
        return res;
    }

    // 水平网格线
    renderHorizontalGrid() {
        const { container, width, hLinePosition, hLineStyle } = this;
        const { show, ...style } = hLineStyle;
        if (!show) return this;
        hLinePosition.forEach((d) => {
            const line = new Line(style).attr({
                shape: { y1: d, x2: width, y2: d },
            });
            container.add(line);
        });
        return this;
    }

    // 垂直网格线
    renderVerticalGrid() {
        const { container, height, vLinePosition, vLineStyle } = this;
        const { show, ...style } = vLineStyle;
        if (!show) return this;
        vLinePosition.forEach((d) => {
            const line = new Line(style).attr({
                shape: { x1: d, x2: d, y2: height },
            });
            container.add(line);
        });
        return this;
    }

    render() {
        if (this.container === null) {
            this.container = new Group(this.containerConfig);
        }
        this.renderHorizontalGrid();
        this.renderVerticalGrid();
        return this.container;
    }
}

export { Grid };
