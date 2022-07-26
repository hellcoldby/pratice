/**
 * 自定义贝塞尔面积图
 */

import { Path } from '../../shape';
import { getControlPoint } from '../../utils/bezierCP';
import _ from 'lodash';

const BezierArea = Path.extend({
    type: 'BezierArea',
    shape: {
        up_points: [],
        down_points: [],
        smooth: false,
        curvature: 0.3,
    },
    buildPath: function (ctx, shape) {
        const up_points = shape.up_points;
        const down_points = shape.down_points;
        const smooth = shape.smooth;
        const curvature = smooth === true ? shape.curvature : 0;
        const pLen = up_points.length;
        if (!pLen || pLen === 1) return;

        // 左侧垂线
        const l_line = {
            start_x: down_points[pLen - 1]?.[0],
            start_y: down_points[pLen - 1]?.[1],
            end_x: up_points[0]?.[0],
            end_y: up_points[0]?.[1],
        };

        // 右侧垂线
        const r_line = {
            start_x: up_points[pLen - 1]?.[0],
            start_y: up_points[pLen - 1]?.[1],
            end_x: down_points[0]?.[0],
            end_y: down_points[0]?.[1],
        };

        ctx.moveTo(l_line.start_x, l_line.start_y);
        drawLine(l_line);
        drawBezier(up_points);
        drawLine(r_line);
        drawBezier(down_points);
        ctx.closePath();

        function drawLine(pos) {
            ctx.lineTo(pos.start_x, pos.start_y);
            ctx.lineTo(pos.end_x, pos.end_y);
        }

        function drawBezier(linePoints) {
            // 两个点
            if (linePoints.length === 2) {
                ctx.lineTo(..._.nth(linePoints, 0));
                ctx.lineTo(..._.nth(linePoints, -1));
                return;
            }
            // 2+ （最后一个点不遍历）
            // 初始点位置
            ctx.lineTo(..._.nth(linePoints, 0));
            // 目标点位置
            for (let i = 0; i < linePoints.length - 1; i++) {
                const targetPoint = linePoints[i + 1];
                // 控制点位置（当前点的后一个，下一个点的前一个）
                const [, cp1] = getControlPoint(linePoints, i, curvature);
                const [cp2] = getControlPoint(linePoints, i + 1, curvature);
                // render
                ctx.bezierCurveTo(...cp1, ...cp2, ...targetPoint);
            }
        }
    },
});

const BezierLine = Path.extend({
    type: 'BezierLine',
    shape: {
        points: [],
        down_points: [],
        smooth: false,
        curvature: 0.3,
    },
    buildPath: function (ctx, shape) {
        const points = shape.points;
        const smooth = shape.smooth;
        const curvature = smooth === true ? shape.curvature : 0;
        const pLen = points.length;
        if (!pLen || pLen === 1) return;

        ctx.moveTo(points[0]?.[0], points[0]?.[1]);
        drawBezier(points);

        function drawBezier(linePoints) {
            // 两个点
            if (linePoints.length === 2) {
                ctx.lineTo(..._.nth(linePoints, 0));
                ctx.lineTo(..._.nth(linePoints, -1));
                return;
            }
            // 2+ （最后一个点不遍历）
            // 初始点位置
            ctx.lineTo(..._.nth(linePoints, 0));
            // 目标点位置
            for (let i = 0; i < linePoints.length - 1; i++) {
                const targetPoint = linePoints[i + 1];
                // 控制点位置（当前点的后一个，下一个点的前一个）
                const [, cp1] = getControlPoint(linePoints, i, curvature);
                const [cp2] = getControlPoint(linePoints, i + 1, curvature);
                // render
                ctx.bezierCurveTo(...cp1, ...cp2, ...targetPoint);
            }
        }
    },
});

// 数据包含正负值判断 1-正值 2-负值 3-正负都有
function getValueType(info) {
    const { forwardMax, minusMin } = info;
    let valueType = 1;
    // 全正值
    if (forwardMax && minusMin >= 0) {
        valueType = 1;
    } else if (forwardMax <= 0 && minusMin) {
        // 全负值
        valueType = 2;
    } else if (forwardMax && minusMin) {
        // 正负值
        valueType = 3;
    }
    return valueType;
}

// 检测数值有效性
function check_value_void(value, index) {
    if (value === '' || value === null || value === undefined) {
        return String(index);
    }
}

export { BezierArea, BezierLine, getValueType, check_value_void };
