import _ from 'lodash';
import { Group, Rect, Text, Line } from '../../../shape';
import { add, subtract, multiply, divide } from '../../../utils/math';

/**
 * Axis type
 *  - 'category'
 *  - 'value'
 *  - 'time'
 *  - 'log'
 */
class Axis {
    constructor(config) {
        // basic
        const { show, length, direction } = config;
        this.show = show;
        this.axisLength = length;
        this.direction = direction;

        // group
        const { container, name } = config;
        this.container = container instanceof Group ? container : null;
        this.containerConfig = {
            name: name + `axisGroup`,
            silent: true,
        };

        // style
        const { line = {}, scale = {}, label = {} } = config;
        // Line
        this.lineStyle = {
            show: true,
            ...line,
        };
        // Scale
        this.scaleStyle = {
            show: true,
            ...scale,
        };
        // Label
        this.labelStyle = {
            show: true,
            ...label,
        };

        // basic data
        const { originValue, finalValue, gapValue, pixelRatioValue } = config;
        this.originValue = originValue ?? 0;
        this.finalValue = finalValue ?? 1;
        this.gapValue = gapValue ?? 0.2;
        this.pixelRatioValue = pixelRatioValue ?? divide(length, 1);

        // calculate data
        this.initAxisData();
    }

    initAxisData() {
        const { axisLength, originValue, finalValue, gapValue } = this;
        // set
        let scaleData = [];
        let labelData = [];
        // 首次推入
        scaleData.push([0, 6]);
        labelData.push([0, originValue]);
        // point
        let labelRef = this.getNextValue(originValue);
        while (labelRef < finalValue) {
            const currPixel = this.getPixelByValue(labelRef);
            scaleData.push([currPixel, 6]);
            labelData.push([currPixel, labelRef]);
            labelRef = this.getNextValue(labelRef);
        }
        // 推入终点
        scaleData.push([axisLength, 6]);
        labelData.push([axisLength, finalValue]);

        this.scaleData = scaleData;
        this.labelData = labelData;
        return this;
    }

    getNextValue = (value) => {
        const { gapValue, originValue, finalValue } = this;
        // todo 设计更合理的模型以兼容两种读取下一个键值的方式
        // const next = multiply(add(Math.floor(divide(value, gapValue)), 1), gapValue);
        if (
            gapValue === 0 ||
            (finalValue - originValue) * gapValue < 0 ||
            (finalValue - originValue) / gapValue > 666
        )
            return finalValue;
        const next = add(value, gapValue);
        return Number(next);
    };

    getPixelByValue = (value) => {
        const { originValue, pixelRatioValue } = this;
        const pixel = multiply(subtract(value, originValue), pixelRatioValue); // + 0;
        return Number(pixel);
    };

    // 轴线
    renderAxis() {
        const {
            container,
            axisLength,
            lineStyle: { show, ...style },
        } = this;
        if (!show) return this;
        const line = new Line(style).attr({
            shape: { x2: axisLength },
        });
        container.add(line);
        return this;
    }

    // 刻度
    renderAxisScale() {
        const {
            container,
            scaleData,
            scaleStyle: { show, ...style },
        } = this;
        if (!show) return this;
        scaleData.forEach((item, index) => {
            const [distance, scaleSize] = item;
            const scale = new Line(style).attr({
                shape: { x1: distance, x2: distance, y2: scaleSize },
            });
            container.add(scale);
        });
        return this;
    }

    // 标签
    renderAxisLabels() {
        const {
            container,
            labelData,
            direction,
            labelStyle: { show, offset, ...style },
        } = this;
        if (!show) return this;

        labelData.forEach((item, index) => {
            const [distance, labelName] = item;
            const d = Number(distance);
            const label = new Text(style).attr({ style: { text: labelName } });
            const { width: w, height: h } = label.getBoundingRect();
            const ratio = 0.4;
            // translate by direction
            switch (direction) {
                case 'left':
                    label.attr({
                        position: [d + h * ratio, w + offset],
                        rotation: -Math.PI / 2,
                        scale: [-1, 1],
                    });
                    break;
                case 'right':
                    label.attr({ position: [d + h * ratio, offset], rotation: -Math.PI / 2 });
                    break;
                case 'top':
                    label.attr({
                        position: [d - w / 2, h + offset],
                        rotation: -Math.PI,
                        scale: [-1, 1],
                    });
                    break;
                case 'bottom':
                default:
                    label.attr({ position: [d - w / 2, offset] });
                    break;
            }
            container.add(label);
        });
        return this;
    }

    render() {
        if (this.container === null) {
            this.container = new Group(this.containerConfig);
        }
        if (!this.show) return this.container;
        this.renderAxis();
        this.renderAxisScale();
        this.renderAxisLabels();
        return this.container;
    }
}

export { Axis };
