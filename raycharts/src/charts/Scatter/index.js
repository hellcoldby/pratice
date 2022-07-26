import _ from 'lodash';
import { Group, Image, Rect, Circle, Text } from '../../shape';
import { color } from '../../utils/color';

import { DataSet } from './DataSet';
import RectCoord from './Coord/RectCoord';
import Spot from './Spot';
import DataBox from './DataBox';

class Scatter {
    name = 'Scatter';

    constructor(config) {
        const { configData, chartData, maxWidth, maxHeight, addHoverAction } = config;

        // 新的接口
        const { container, triggerHover } = config;
        this.contentSize = [maxWidth, maxHeight];
        this.triggerHover = addHoverAction;

        // 加载数据
        this.chartDataSet = new DataSet(chartData);

        // 数据映射
        this.categoryList = this.chartDataSet.categoryList();
        this.xName = this.chartDataSet.seriesNameAt(1);
        this.xAxisMapping = this.chartDataSet.seriesAt(1);
        this.yName = this.chartDataSet.seriesNameAt(2);
        this.yAxisMapping = this.chartDataSet.seriesAt(2);
        // todo: 通过方法调取数据的处理方式
        this.colorOriginalData = this.chartDataSet.categoryList();
        this.colorMapping = this.remapColorKey(this.colorOriginalData);
        // todo: 通过方法调取数据的处理方式
        this.sizeName = this.chartDataSet.seriesNameAt(3);
        this.sizeOriginalData = this.chartDataSet.seriesAt(3);
        this.sizeMapping = this.remapSizeData(this.sizeOriginalData);

        // 坐标轴
        this.rectCoordConfig = {
            originStyle: configData,
            boxSize: this.contentSize,
            xAxis: {
                type: 'value',
                direction: 'bottom',
                data: this.xAxisMapping,
            },
            yAxis: {
                type: 'value',
                direction: 'left',
                data: this.yAxisMapping,
            },
        };

        const sizeLimit = Math.min(maxHeight, maxWidth) / 2;
        // 图形
        this.graphConfig = {
            originStyle: configData,
            sizeLimit,
        };

        // 数据
        this.dataBoxConfig = {
            originStyle: configData,
            sizeLimit,
        };
    }

    // 枚举解析数据
    // todo: 移入DataSet
    remapColorKey(data) {
        let map = new Map();
        let count = 0;
        const remapData = data.map((key) => {
            if (map.has(key)) return map.get(key);
            map.set(key, count);
            return count++;
        });
        return remapData;
    }

    // 百分比解析数据
    // todo: 移入DataSet
    remapSizeData(data) {
        const maxData = Math.max(...data);
        const minData = Math.min(...data);
        const remapData = data.map((value) => {
            if (value === null) return 0;
            if (maxData <= minData) return 0;
            value = (value - minData) / (maxData - minData);
            return value;
        });
        return remapData;
    }

    render() {
        // 容器
        this.chartGroup = new Group({ name: this.name });

        // 坐标轴
        const coord = new RectCoord(this.rectCoordConfig);

        // 图形组
        const graphGroup = coord.getGraphGroup();
        const markGroup = coord.getContentGroup({ name: 'mark' });

        // 数据的重新解析
        const {
            categoryList,
            colorMapping,
            xName,
            xAxisMapping,
            yName,
            yAxisMapping,
            sizeName,
            sizeMapping,
            sizeOriginalData,
        } = this;

        // 迭代数据生成图形
        const remapSizeData = categoryList.forEach((category, index) => {
            const colorKey = colorMapping[index];
            const xValue = xAxisMapping[index];
            const yValue = yAxisMapping[index];
            const size = sizeMapping[index] ?? 0;
            const originalSize = sizeOriginalData[index];

            if (xValue === null || xValue === undefined) return;
            if (yValue === null || yValue === undefined) return;

            if (!coord.isVisibleData({ x: xValue, y: yValue })) return;

            // 绘图坐标
            const { x, y } = coord.getPosition({ x: xValue, y: yValue });

            // todo 要改成节点链，之后统一调度更新
            // 图形
            const graph = new Spot({
                ...this.graphConfig,
                position: [x, y],
                // calculate
                zBase: index,
                colorKey: colorKey,
                size: size,
            });
            const graphNode = graph.render();
            graphGroup && graphGroup.add(graphNode);

            // hover tip
            const labelList = [
                {
                    keyName: xName, // 左侧字段
                    value: xValue, // 右侧字段
                },
                {
                    keyName: yName, // 左侧字段
                    value: yValue, // 右侧字段
                },
            ];

            // 是否推入size
            if (originalSize !== null) {
                labelList.push({ keyName: sizeName, value: originalSize });
            }

            this.triggerHover(graphNode, {
                title: category,
                hasIcon: false,
                labelList,
            });

            // 数据标记
            const dataBox = new DataBox({
                ...this.dataBoxConfig,
                // calculate
                zBase: index,
                text: category,
                offSetSize: size,
                group: {
                    position: [x, y],
                    scale: [1, -1],
                },
            });
            const dataBoxNode = dataBox.render();
            graphGroup && graphGroup.add(dataBoxNode);
        });

        // 绘制
        this.chartGroup.add(coord.render());
        return this.chartGroup;
    }
}

export default (config) => new Scatter(config).render();
