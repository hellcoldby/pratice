/*
 * Description:
 * Author: vicky
 * Date: 2020-11-27 17:57:16
 * LastEditTime: 2020-12-10 13:36:52
 * FilePath: \packages\raycharts\src\shape\Trapezoid.js
 */
import * as zrender from 'zrender';
import _ from 'lodash';
import { getMaxR, getCenterPoint, getCircleSize, getAngleRange } from '../utils';

const getNth = (arr, i) => _.nth(arr, i % arr.length);

// 凸多边形 Convex polygon
const Trapezoid = zrender.Path.extend({
    type: 'Trapezoid',
    shape: {
        points: [],
        r: 0,
    },
    buildPath: function (path, shape) {
        // 传入点的坐标顺时针排序
        const pointsArr = shape.points;
        // console.log(shape.r);
        const rArr = getRArray(shape.r).map((i) => (i < 0 ? 0 : i));

        for (let i = 0; i < pointsArr.length; i++) {
            // 当前圆角
            const radius = getMaxR(pointsArr, rArr, i);

            // 圆半径
            const circleSize = getCircleSize(pointsArr, i, radius);

            // 圆的中心点
            const circleCenter = getCenterPoint(pointsArr, i, circleSize);

            // 起始角度和最终角度
            const [startAngle, endAngle] = getAngleRange(pointsArr, i);

            // 绘制圆弧
            path.arc(...circleCenter, circleSize, startAngle, endAngle);
        }
        path.closePath();
    },
});

/**
 * @method getRArray 获取圆角数组
 * @param {*} r
 * 用于创建圆角,左上、右上、右下、左下角的半径依次为 r1、 r2、 r3、 r4。
 * r 缩写为 1 相当于 [1, 1, 1, 1]；
 * r 缩写为 [1] 相当于 [1, 1, 1, 1]；
 * r 缩写为 [1, 2] 相当于 [1, 2, 1, 2]；
 * r 缩写为 [1, 2, 3] 相当于 [1, 2, 3, 2]。
 */
function getRArray(r) {
    if (r instanceof Array) {
        if (r.length === 4) {
            return r;
        }
        if (r.length === 3) {
            return [r[0], r[1], r[2], r[1]];
        }
        if (r.length === 2) {
            return [r[0], r[1], r[0], r[1]];
        }
        if (r.length === 1) {
            return [r[0], r[0], r[0], r[0]];
        }
    }
    if (typeof r === 'number') {
        return [r, r, r, r];
    }
    return [0, 0, 0, 0];
}

export default Trapezoid;
