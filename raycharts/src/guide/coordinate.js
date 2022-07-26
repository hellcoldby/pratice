/*
 * @Description:
 * @Author: ygp
 * @Date: 2020-11-03 15:34:44
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-22 18:24:58
 */

import * as zrender from 'zrender';
import position_info from './coordinate/position_info';
import draw_x_axis from './coordinate/draw_x_axis';
import draw_y_axis from './coordinate/draw_y_axis';
import draw_x_guide from './coordinate/draw_x_guide';
import draw_y_guide from './coordinate/draw_y_guide';
import draw_y_label from './coordinate/draw_y_label';
import draw_x_label from './coordinate/draw_x_label';
import draw_x_title from './coordinate/draw_x_title';
import draw_y_title from './coordinate/draw_y_title';
import draw_x_rules from './coordinate/draw_x_rules';
import draw_y_rules from './coordinate/draw_y_rules';

function renderAxisGroup(props) {
    const { configData } = props;
    const chartData = {
        ...props.chartData,
        series: props.chartData.DEPRECATED_series,
        data: props.chartData.DEPRECATED_data,
    };

    const info = position_info({ ...props, chartData });
    const params = { ...props, ...info, chartData };

    // 坐标系组
    const axisGroup = new zrender.Group({ name: `axisGroup${configData._type}` });
    axisGroup.info = info;

    // 绘制x轴
    draw_x_axis(axisGroup, params);
    // 绘制y轴
    draw_y_axis(axisGroup, params);
    draw_x_guide(axisGroup, params);
    draw_y_guide(axisGroup, params);
    draw_y_label(axisGroup, params);
    draw_x_label(axisGroup, params);
    draw_x_title(axisGroup, params);
    draw_y_title(axisGroup, params);
    // 刻度
    draw_x_rules(axisGroup, params);
    draw_y_rules(axisGroup, params);

    return axisGroup;
}

export default renderAxisGroup;
