import _ from 'lodash';
import { add, subtract, multiply, divide } from '../../../utils/math';
import { Group, Image, Rect, Text } from '../../../shape';

import parse from '../parse/decorator';
import { parseCoord } from './parse';
import { Axis } from './Axis';
import { Grid } from './Grid';
import MarkLine from './MarkLine';

class RectCoord {
    constructor(config) {
        // basic
        const { baseAnchor, contentSize } = config;
        this.baseAnchor = baseAnchor;
        this.contentSize = contentSize;

        // 坐标系组
        const { container } = config;
        this.container = container instanceof Group ? container : null;
        this.containerConfig = {
            name: name + `RectCoord`,
        };
        this.contentList = [];

        // 坐标轴
        const { xAxis, yAxis } = config;
        this.xAxisConfig = this.flatAxisConfig(xAxis);
        this.yAxisConfig = this.flatAxisConfig(yAxis);

        // 网格线
        const { grid } = config;
        this.gridConfig = {
            ...grid,
            size: contentSize,
        };

        // 标记线
        const { originStyle } = config;
        this.markLineConfig = {
            originStyle,
            baseAnchor,
            size: contentSize,
        };

        const { render } = config;
    }

    /**  ----------------------------- 初始计算 -----------------------------  **/
    // 针对坐标轴的配置的二次处理
    // todo 考虑到多轴调用使用 flatMap
    flatAxisConfig(config) {
        const { data, type, length, ...restConfig } = config;
        if (_.isEmpty(data)) return {};
        switch (type) {
            case 'value': {
                // 获取分段信息
                let [start, end, step, pixelRatioValue] = getScaleData(data, length);
                // 如果存在标轴端点值覆盖计算值
                if (_.has(restConfig, 'originValue') && _.has(restConfig, 'finalValue')) {
                    start = restConfig.originValue;
                    end = restConfig.finalValue;
                    const gap = subtract(end, start);
                    const septate = getSeptateByLength(length);
                    step = Number(divide(gap, septate));
                    pixelRatioValue = Number(divide(length, gap));
                }

                const res = {
                    // 保留原有属性
                    type,
                    length,
                    // 计算属性
                    originValue: start,
                    finalValue: end,
                    gapValue: step,
                    pixelRatioValue,
                    // 计算结果优先级低于配置值
                    ...restConfig,
                };
                return res;
            }
            case 'category':
            default:
                return config;
        }
    }

    /**  ----------------------------- 位置处理 -----------------------------  **/
    // Axis 获取坐标轴组
    redirectAxisGroup = (direction, originGroup) => {
        const { baseAnchor, contentSize } = this;
        const [x, y] = baseAnchor;
        const [w, h] = contentSize;
        // init axis group
        const group =
            originGroup instanceof Group ? originGroup : new Group({ name: `Axis-${direction}` });
        // translate by direction
        switch (direction) {
            case 'left':
                group.attr({ position: [x, y], rotation: Math.PI / 2, scale: [1, -1] });
                break;
            case 'right':
                group.attr({ position: [x + w, y], rotation: Math.PI / 2 });
                break;
            case 'top':
                group.attr({ position: [x, y - h], scale: [1, -1] });
                break;
            case 'bottom':
            default:
                group.attr({ position: [x, y] });
                break;
        }
        return group;
    };

    /**  ----------------------------- 对外接口 -----------------------------  **/
    // 值转换到坐标
    // todo 针对类别轴的返回值，以及多轴的返回值支持
    getPosition = (info) => {
        const { x: xValue, y: yValue } = info;
        const { originValue: xOP, pixelRatioValue: xPRV } = this.xAxisConfig;
        const { originValue: yOP, pixelRatioValue: yPRV } = this.yAxisConfig;

        // const x = multiply(subtract(xValue, xOP), xPRV);
        const x = (xValue - xOP) * xPRV;
        // const y = multiply(subtract(yValue, yOP), yPRV);
        const y = (yValue - yOP) * yPRV;

        return { x, y };
    };

    isVisibleData = ({ x: xValue, y: yValue }) => {
        const { originValue: xOV, finalValue: xFV } = this.xAxisConfig;
        const { originValue: yOV, finalValue: yFV } = this.yAxisConfig;
        return xOV <= xValue && xValue <= xFV && yOV <= yValue && yValue <= yFV;
    };

    // 坐标轴内容区域
    getContentGroup = (config) => {
        const { baseAnchor, contentSize } = this;
        const group = new Group({
            position: baseAnchor,
            scale: [1, -1],
        }).attr(config);
        // add in contentList
        const { contentList } = this;
        contentList.push(group);
        return group;
    };

    // 图形组 自定义时会做裁切
    getGraphGroup = (config) => {
        this.graphGroup = this.getContentGroup({ name: 'Graph' }).attr(config);
        return this.graphGroup;
    };

    render() {
        if (this.container === null) {
            this.container = new Group(this.containerConfig);
        }

        const { container, redirectAxisGroup } = this;

        // xAxis
        const { xAxisConfig } = this;
        const xAxis = new Axis(xAxisConfig);
        const xAxisGroup = this.redirectAxisGroup(xAxisConfig.direction, xAxis.render());
        container.add(xAxisGroup);

        // yAxis
        const { yAxisConfig } = this;
        const yAxis = new Axis(yAxisConfig);
        const yAxisGroup = this.redirectAxisGroup(yAxisConfig.direction, yAxis.render());
        container.add(yAxisGroup);

        // Grid
        const { gridConfig } = this;
        const grid = new Grid({
            ...gridConfig,
            container: this.getContentGroup({ name: 'Grid', silent: true }),
            xLineData: xAxis.labelData,
            yLineData: yAxis.labelData,
        });
        container.add(grid.render());

        // MarkLine
        const markLine = new MarkLine({
            ...this.markLineConfig,
            // calculate
            getXPosition: (v) => this.getPosition({ x: v }).x,
            getYPosition: (v) => this.getPosition({ y: v }).y,
        });
        container.add(markLine.render());

        // render contentList
        const { contentList } = this;
        contentList.forEach((item) => {
            container.add(item);
        });

        return container;
    }
}

export default parse(parseCoord)(RectCoord);

function getSeptateByLength(length, min = 0, max = 1) {
    // 值数据类型需要进行检查
    const septateMap = [
        [400, 2],
        [600, 5],
        [Infinity, 10],
    ];
    // TODO: 刻度范围依赖于分段个数，分段数依赖于轴高度，轴高度依赖于刻度依赖分段个数
    // ? 暂且设定当正负值存在的时候，各个阶段的限制比例放大1.2倍
    // 分段
    const scale = (min ^ max) < 0 ? 1.2 : 1;
    const septate = septateMap.find(([f]) => length < f * scale)[1];
    return septate;
}

function getScaleData(data, length) {
    const valid = data.filter(validNumber);
    // todo 确定，补充最小值或者最大值的逻辑是否合理
    const validMin = Math.min(...valid, 0);
    const validMax = Math.max(...valid, 0);
    // 值数据类型需要进行检查
    const septate = getSeptateByLength(length, validMin, validMax);
    // 刻度值
    const [limitMin, limitMax, gapValue] = getLimitOfValue([validMin, validMax], septate);
    // 间隔像素
    const pixelRatioValue = divide(length, subtract(limitMax, limitMin));
    return [Number(limitMin), Number(limitMax), Number(gapValue), Number(pixelRatioValue)];
}

/**
 * 数据检查
 * @param {Any}
 * @returns {boolean}
 */
function validNumber(i) {
    return i !== '' && i !== false && i !== null && !isNaN(Number(i));
}

/**
 * 给定数据最大值和最小值，计算出刻度范围
 * @param {Array} range [min,max]
 * @param {number} separate 主轴的分段数目
 * @returns {Array} scoop [min,max,gap]
 */
function getLimitOfValue([min, max], separate) {
    if (max === 0 && min === 0) {
        // 最大值为0，最小值为0
        return [0, 1, divide(1, separate)];
    } else if (max >= 0 && min >= 0) {
        // 都在正方向
        const extreme = ceilValue(max);
        const gap = Math.abs(divide(extreme, separate));
        return [0, extreme, gap];
    } else if (max <= 0 && min <= 0) {
        // 都在负方向
        const extreme = ceilValue(min);
        const gap = Math.abs(divide(extreme, separate));
        return [extreme, 0, gap];
    } else {
        // 最大值与最小值不同方向
        if (min + max >= 0) {
            // 极端值在正方向
            let rangeMax = ceilValue(max);
            let gap = Math.abs(divide(rangeMax, separate));
            let rangeMin = multiply(Math.floor(divide(min, gap)), gap);
            return [rangeMin, rangeMax, gap];
        } else {
            // 极端值在负方向
            let rangeMin = ceilValue(min);
            let gap = Math.abs(divide(rangeMin, separate));
            let rangeMax = multiply(Math.ceil(divide(max, gap)), gap);
            return [rangeMin, rangeMax, gap];
        }
    }
}

/**
 * 数值取整
 * 0   -> 1         按照小数部分的有效数字，最高位的下一位取整
 * 1   -> 100       按照有效数字，最高位的下一位取整
 * 100 -> Infinite  按照5倍最大位数减一作为刻度取证
 * @param {number}
 * @returns {number}
 */
function ceilValue(value) {
    const flag = value > 0 ? 1 : -1;
    const absValue = Math.abs(value);
    if (absValue === 0) {
        return 0;
    } else if (absValue < 1) {
        const notation = String(absValue).split('.')[1].length;
        const int = Number(`${absValue}e${notation}`);
        const intNotation = String(int).split('.')[0].length;
        const intPoint = _.ceil(int, -intNotation + 1);
        const point = Number(`${intPoint}e${-notation}`);
        return point * flag;
    } else if (absValue < 100) {
        const notation = String(absValue).split('.')[0].length;
        const point = _.ceil(absValue, -notation + 1);
        return point * flag;
    } else {
        const notation = String(absValue).split('.')[0].length;
        const halfUnit = Number(`5e${notation - 2}`);
        const baseValue = _.floor(absValue, -notation + 1) + halfUnit;
        const point = baseValue > absValue ? baseValue : baseValue + halfUnit;
        return point * flag;
    }
}
