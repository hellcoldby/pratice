/*
 * Description:
 * Author: vicky
 * Date: 2020-11-02 19:47:36
 * LastEditTime: 2021-11-26 18:05:08
 * FilePath: \packages\raycharts\src\charts\public\decorate.js
 */
import _ from 'lodash';
import { fFixed } from '../../utils/tool';
import renderEndPoint from '../../components/endPoint';
import renderDataBox from '../../components/dataBox';
import { G_NAME } from '../../utils/common';
import { Group } from '../../shape';

/**
 * @method drawBubbles
 * @description 绘制数据数组
 * @param {*} params
 * bubbles：绘制数据气泡信息数组
 */
export function drawBubbles(params) {
    const { bubbles } = params;
    let bubblesGroup = new Group({ name: G_NAME.data });
    bubbles.forEach((item) => {
        bubblesGroup.add(addBubble({ ...params, bubbleData: item }));
    });
    return bubblesGroup;
}

/**
 * @method addBubble
 * @description 绘制数据文本和气泡，此气泡位置支持偏移，暂不支持position
 * @param {*} params
 * 1、props所有属性
 * 2、需要单独配置的属性包括：
 * bubbleData：{cx,cy,r,x,y,value,isMax, isMin,seriesSum}【cx,cy,r是圆心数据，仅在雷达图的时候存在，存在时会按照会按照圆形方位调整位置,value数据，sign数据标识包括max，min ,normal,用来type切换的,seriesSum系列总值，方便切换数据type】
 * z【图层位置】
 */
export function addBubble(params) {
    const {
        bubbleData: { value, isMax, isMin, x, y, seriesSum },
        z,
        configData,
    } = params;
    let type = configData?.data?.type;
    let percent = fFixed((seriesSum === 0 ? 0 : value / seriesSum) * 100, 2);
    let textStr = type === 'normal' ? `${value}` : `${percent}%`;
    return renderDataBox(configData)({
        name: `dataText`,
        baseZ: z,
        dataText: textStr,
        isMin: isMin,
        isMax: isMax,
    }).attr({ position: [x, y] });
}

/**
 * @method drawPoints
 * @description 绘制端点数组
 * @param {*} params
 * points：端点数组
 */
export function drawPoints(params) {
    const { points, maxSize } = params;
    let pointsGroup = new Group({ name: G_NAME.point });
    points.forEach((item) => {
        pointsGroup.add(addPoint({ ...params, pointData: { ...item, maxSize } }));
    });
    return pointsGroup;
}

/**
 * @method addPoint
 * @description 绘制端点
 * @param {*} params
 * 1、props所有属性
 * 2、需要单独配置的属性包括：
 * pointData：{x,y,angle（端点最终角度位置）}
 * z【图层位置】
 */
export function addPoint(params) {
    const {
        pointData: { x, y, angle, maxSize, isMax, isMin },
        z,
    } = params;
    return renderEndPoint(params.configData)({
        name: 'point',
        baseZ: z,
        maxSize: maxSize,
        isMin: isMin,
        isMax: isMax,
    }).attr({
        position: [x, y],
        rotation: angle ? 2 * Math.PI - angle : 0,
    });
}
