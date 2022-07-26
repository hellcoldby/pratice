/*
 * Description: Polygon 多边形相关方法
 * Author: vicky
 * Date: 2020-08-21 18:59:14
 * LastEditTime: 2021-11-26 17:39:35
 * FilePath: \packages\raycharts\src\charts\public\polygon.js
 */
import _ from 'lodash';
import { pointByRad, fFixed } from '../../utils/tool';
import { getExpNumByTail, getAllUltra } from '../../utils/dataUtils';
import { getDrawAreaInfo } from '../public/assist';

/**
 * @method getColumns
 * @description 获取分栏数据
 * @param {*} params
 * @param {*} lWOpen 线宽计算在内
 */
export function getColumns(params) {
    const {
        configData: {
            guide: { paxis, pcoor },
        },
    } = params;
    const dA = getDrawAreaInfo(params);
    //半径,当宽>高时，以宽度来衡量网格半径，同时减去整体宽度的30%，给左右侧文本留有空间。
    let r = dA.r;
    let cx = dA.cx,
        cy = dA.cy,
        startAngle = 0;

    //获取系列数和分类数
    const { chartData } = params;
    //系列
    let series = chartData?.seriesList ?? [];
    //系列最值
    let ultra = getAllUltra(chartData);
    //数据最大值
    let maxValue = ultra.max;
    //数据最小值
    let minValue = ultra.min;

    //计算分栏个数（多边形外垂心/30取整数即为分栏个数，最大分栏到10,半径不为0，最小分栏为1）
    let colNum = Math.floor(r / 30);
    colNum = colNum > 10 ? 10 : colNum;
    colNum = colNum === 0 ? 1 : colNum;
    //分栏间隔
    let rSpace = r / colNum;

    //分栏最大值,末位期望10
    let colMax = getExpNumByTail(maxValue, 10);
    //分栏最小值
    let colMin = minValue >= 0 ? 0 : getExpNumByTail(minValue, 10);

    //所有类别
    let cates = chartData?.categoryList ?? [];

    //边数
    let sides = cates.length;

    //实际分栏点
    let points = [];
    //数据点
    let numPoints = [];
    //分栏数据距离网格间距
    let numSpace = paxis.text_offset;

    //总值范围
    let sum = colMin < 0 ? (colMax >= 0 ? colMax + Math.abs(colMin) : Math.abs(colMin) - Math.abs(colMax)) : colMax;
    //获取所有分栏点信息
    for (let i = 1; i <= colNum; i++) {
        let c_r = rSpace * i;
        //各个分栏数值
        let colValue = fFixed(i * (sum / colNum) + colMin);
        let numPoint = getScalePoints(cx, cy, c_r + numSpace, sides, startAngle, cates);
        points.push({ ...getScalePoints(cx, cy, c_r, sides, startAngle, cates), colValue, colMax, colMin });
        numPoints.push({
            ...numPoint.info[0],
            colValue,
            colMax,
            colMin,
            centerX: cx,
            centerY: cy,
            radius: c_r + numSpace,
        });
    }

    //文本坐标距离网格间距
    let textSpace = pcoor.text_offset;
    //获取所有角度
    let aac = _.get(points[0], 'aac', null);
    //获取文本坐标
    let textPoints = { ...getScalePoints(cx, cy, r + textSpace, sides, startAngle, cates) };

    //获取数据实际坐标
    let dataPoints = [];
    for (let i = 0; i < series.length; i++) {
        let seriesInfo = series[i];
        let c_data = chartData?.dataBaseSeries[seriesInfo.sid] ?? [];
        let ultra = chartData?.ultraBaseSeries[seriesInfo.sid] ?? {};
        let dataPoint = getDataPoints(c_data, cx, cy, r, colMax, colMin, aac, ultra, seriesInfo);
        !_.isEmpty(dataPoint) && dataPoints.push(dataPoint);
    }
    return {
        points,
        textPoints,
        numPoints,
        dataPoints,
    };
}

/**
 * @method getDataPoints
 * @description 获取数据点集合
 * @param {*} data 数据
 * @param {*} cx
 * @param {*} cy
 * @param {*} r
 * @param {*} colMax 分栏最大值
 * @param {*} colMin 分栏最小值
 * @param {*} maxValue 分栏最大值
 * @param {*} minValue 分栏最小值
 * @param {*} aac 角度和cate信息
 */
function getDataPoints(data, cx, cy, r, colMax, colMin, aac, ultra, series) {
    if (aac) {
        let points = [];
        let pointsInfo = [];
        let xArr = [],
            yArr = [];
        let sum = colMax > 0 ? Math.abs(colMin) + colMax : Math.abs(colMin) - Math.abs(colMax);
        //系列总值
        let seriesSum = _.sumBy(data, (e) => {
            return Math.abs(e) ?? 0;
        });
        data.forEach((item, index) => {
            if (item !== null) {
                let aNum = item >= 0 ? item + Math.abs(colMin) : Math.abs(item);
                let percent = sum !== 0 ? aNum / sum : 0;
                const point = pointByRad(cx, cy, r * percent, aac[index].angle);
                points.push([point.x, point.y]);
                //将当前数据是否是极值做标注
                pointsInfo.push({
                    x: point.x,
                    y: point.y,
                    ...aac[index],
                    cx,
                    cy,
                    r: r * percent,
                    colMax,
                    colMin,
                    value: item,
                    isMax: item === ultra.max,
                    isMin: item === ultra.min,
                    maxValue: ultra.max,
                    minValue: ultra.min,
                    seriesSum,
                });
                xArr.push(point.x);
                yArr.push(point.y);
            }
        });
        return {
            points,
            pointsInfo,
            series,
        };
    }
    return {};
}

/**
 * @method getRulePoints
 * @description 获取多边形点信息
 * @param {*} centerX
 * @param {*} centerY
 * @param {*} radius 半径
 * @param {*} sides  边数
 * @param {*} startAngle  开始角度
 */
export function getScalePoints(centerX, centerY, radius, sides, startAngle, cates) {
    //点信息记录
    const pInfo = [];
    //点数组
    const points = [];
    let angle = startAngle;
    //记录angle和cate信息
    let aac = [];
    for (let i = 0; i < sides; i++) {
        //getPoint根据中心点、半径和角度获取指定角度的点坐标
        const point = pointByRad(centerX, centerY, radius, angle);
        let cate = cates[i];
        pInfo.push({
            x: point.x,
            y: point.y,
            angle,
            cate,
        });
        aac.push({ angle, cate });
        points.push([pInfo[i].x, pInfo[i].y]);
        //累加 平方角度（360度 / 边数）
        angle += (2 * Math.PI) / sides;
    }
    return {
        info: pInfo,
        points,
        centerX,
        centerY,
        radius,
        aac,
    };
}

/**
 * @method getTextPosition
 * @description 根据象限 调整文本的位置
 * @private
 * @param {*} x
 * @param {*} y
 * @param {*} textW 文本宽度
 * @param {*} textH 文本高度
 *
 */
export function getTextPosition(center, text) {
    let cx = center.cx,
        cy = center.cy;
    // r = center.r;
    let tx = text.x,
        ty = text.y,
        tw = text.width,
        th = text.height;
    let qd = { x: tx, y: ty };
    //x小于cx-tw
    if (tx <= cx - tw) {
        qd.x = qd.x - tw;
    }
    //x在cx-tw和cx+tw之间
    if (tx > cx - tw && tx < cx + tw) {
        qd.x = qd.x - (cx - tx + tw) / 2;
    }
    //y小于cy-th
    if (ty < cy - th) {
        qd.y = qd.y - th;
    }
    //y在cy-th和cy+th之间
    if (ty >= cy - th && ty < cy + th) {
        qd.y = qd.y - (cy - ty + th) / 2;
    }
    return qd;
}
