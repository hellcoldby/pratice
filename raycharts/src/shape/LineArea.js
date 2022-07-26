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

const LineArea = zrender.Path.extend({
    type: 'LineArea',
    shape: {
        vertexPoints: [],
        basePoints: [],
        smooth: true,
        curvature: 0.3,
    },
    buildPath: function (path, shape) {
        // 传入点的坐标顺时针排序
        const vertex = shape.vertexPoints;
        const base = shape.basePoints;
        const smooth = shape.smooth;
        const curvature = smooth === true ? shape.curvature : 0;

        // 未对齐
        if (vertex.length !== base.length) return;
        // 单点（空）
        if (vertex.length === 0 || vertex.length === 1) return;
        // 两个点
        if (vertex.length === 2) {
            path.moveTo(...vertex[0]);
            path.lineTo(...vertex[1]);
            path.lineTo(...base[1]);
            path.lineTo(...base[0]);
            path.closePath();
            return;
        }
        // 2+
        let __cPoints = [];
        // 初始点位置
        path.moveTo(..._.nth(vertex, 0));

        // 上部曲线
        for (let i = 0; i < vertex.length - 1; i++) {
            // 目标点
            const targetIndex = i + 1;
            // 控制点位置（当前点的后一个，下一个点的前一个）
            const [, cp1] = getControlPoint(vertex, i, curvature);
            const [cp2] = getControlPoint(vertex, targetIndex, curvature);
            // render
            path.bezierCurveTo(...cp1, ...cp2, ...vertex[targetIndex]);
            // dev
            (__cPoints?.[i] ?? (__cPoints[i] = {})).vertex = getControlPoint(vertex, i, curvature);
        }

        // 右侧垂线
        path.lineTo(..._.nth(base, -1));

        // 下部曲线（反算）
        for (let i = base.length - 1; i > 0; i--) {
            // 目标点位置
            const targetIndex = i - 1;
            // 控制点位置（当前点的前一个，前一个点的后一个）
            const [cp1] = getControlPoint(base, i, curvature);
            const [, cp2] = getControlPoint(base, targetIndex, curvature);
            // render
            path.bezierCurveTo(...cp1, ...cp2, ...base[targetIndex]);
            (__cPoints?.[i] ?? (__cPoints[i] = {})).base = getControlPoint(base, i, curvature);
        }

        this.__cPoints = __cPoints;

        // 左侧垂线 封闭图形
        path.closePath();
    },
});

export default LineArea;
