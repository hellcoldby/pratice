import * as zrender from 'zrender';
import { Group, Rect } from '../shape';

import Background from '../components/background';

import mainLayout from './mainLayout';

const limitValue = (per, limit) => (limit * per) / 100;

export default class EntryLayout extends Group {
    constructor(config) {
        super({ name: `RayChart` });
        const { configData, width, height, chartData, addHoverAction } = config;
        this.config = config;

        // 目前对宽高不做更新处理
        this.width = width;
        this.height = height;

        // 背景板
        this.background = new Background({ configData, width, height });
        this.add(this.background);

        // 主表格
        this.mainChart = this.buildMainChart(config);
        this.add(this.mainChart);

        // 背景层裁切
        this.clipBox = new Rect(this.formClipBox({ configData, width, height }));

        this.setClipPath(this.clipBox);
    }

    updateGroup(config) {
        // 新配置合并旧配置
        this.config = _.assign(this.config, config);

        // 更新部分
        const { configData, width, height } = this.config;
        this.clipBox.animateTo(this.formClipBox({ configData, width, height }));
        this.background.updateGroup({ configData, width, height });

        // 重绘部分
        this.remove(this.mainChart);
        this.mainChart = this.buildMainChart(this.config);
        this.add(this.mainChart);
    }

    buildMainChart(config) {
        const { zoom, configData, chartData, addHoverAction } = config;
        const {
            position: chart_position,
            width: chart_width,
            height: chart_height,
        } = this.getChartSize(configData);

        const mainChart = mainLayout(
            {
                width: chart_width,
                height: chart_height,
            },
            {
                zoom,
                configData,
                chartData,
                addHoverAction,
            },
        ).attr({ position: chart_position });
        return mainChart;
    }

    formClipBox(config) {
        const { configData, width, height } = config;
        const {
            border: {
                radius: {
                    tleft: radius_tl,
                    tright: radius_tr,
                    bright: radius_br,
                    bleft: radius_bl,
                },
                line_width,
            },
        } = configData.background;
        const rOffSet = limitValue(line_width, Math.min(width * 0.1, height * 0.1)) * 0.5;
        const fixRadius = (radius, offset) => (radius === 0 ? 0 : radius + offset);
        return {
            name: 'ClipBox',
            shape: {
                x: 0,
                y: 0,
                width: width,
                height: height,
                r: [
                    fixRadius(radius_tl, rOffSet),
                    fixRadius(radius_tr, rOffSet),
                    fixRadius(radius_br, rOffSet),
                    fixRadius(radius_bl, rOffSet),
                ],
            },
        };
    }

    getChartSize(configData) {
        const { width, height } = this;
        const {
            border: { line_width },
            padding: {
                left: padding_left,
                top: padding_top,
                right: padding_right,
                bottom: padding_bottom,
            },
        } = configData.background;
        const limitLineWidth = limitValue(line_width, Math.min(width, height) * 0.1);
        const limitP_left = limitValue(padding_left, width * 0.2);
        const limitP_top = limitValue(padding_top, height * 0.2);
        const limitP_right = limitValue(padding_right, width * 0.2);
        const limitP_bottom = limitValue(padding_bottom, height * 0.2);
        return {
            position: [limitLineWidth / 2 + limitP_left, limitLineWidth / 2 + limitP_top],
            width: width - limitLineWidth - limitP_left - limitP_right,
            height: height - limitLineWidth - limitP_top - limitP_bottom,
        };
    }
}
