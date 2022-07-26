/*
 * Description:
 * Author: vicky
 * Date: 2020-11-27 17:57:16
 * LastEditTime: 2020-12-10 13:36:52
 * FilePath: \packages\raycharts\src\shape\LineArea.js
 */
import * as zrender from 'zrender';
import _ from 'lodash';
import { getControlPoint } from '../utils/bezierCP';

const BrokenLine = zrender.Path.extend({
    type: 'brokenLine',
    shape: {
        linePoints: [],
        smooth: false,
        curvature: 0.3,
    },
    buildPath: function (path, shape) {
        const linePoints = shape.linePoints;
        const smooth = shape.smooth;
        const curvature = smooth === true ? shape.curvature : 0;

        // 单点（空）
        if (linePoints.length === 0 || linePoints.length === 1) return;
        // 两个点
        if (linePoints.length === 2) {
            path.moveTo(..._.nth(linePoints, 0));
            path.lineTo(..._.nth(linePoints, -1));
            return;
        }
        // 2+ （最后一个点不遍历）
        // 初始点位置
        path.moveTo(..._.nth(linePoints, 0));
        // 目标点位置
        for (let i = 0; i < linePoints.length - 1; i++) {
            const targetPoint = linePoints[i + 1];
            // 控制点位置（当前点的后一个，下一个点的前一个）
            const [, cp1] = getControlPoint(linePoints, i, curvature);
            const [cp2] = getControlPoint(linePoints, i + 1, curvature);
            // render
            path.bezierCurveTo(...cp1, ...cp2, ...targetPoint);
        }
    },
});

export default BrokenLine;
