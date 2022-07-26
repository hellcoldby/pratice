/*
 * Description:
 * Author: vicky
 * Date: 2020-10-27 19:14:07
 * LastEditTime: 2020-10-28 06:33:38
 * FilePath: \packages\raycharts\src\shape\CurvePolyline.js
 */
import * as zrender from 'zrender';
import _ from 'lodash';
import smoothBezier from '../utils/smoothBezier';

const CurvePolyline = zrender.Path.extend({
    type: 'CurvePolyline',
    shape: {
        points: [],
        smooth: 0,
        constraint: null,
    },
    buildPath: function (path, shape) {
        const points = shape?.points ?? [];
        const len = points?.length ?? 0;
        if (shape?.smooth > 0 && points.length >= 2) {
            if (points.length === 2) {
                let x0 = points[0][0],
                    y0 = points[0][1];
                let x1 = points[1][0],
                    y1 = points[1][1];
                path.moveTo(x0, y0);
                let x2 = (x0 + x1) / 2 - (y0 - y1) * shape.smooth;
                let y2 = (y0 + y1) / 2 - (x1 - x0) * shape.smooth;
                path.quadraticCurveTo(x2, y2, x1, y1);
            } else {
                const cPoints = smoothBezier(points, shape.smooth, false, shape.constraint);
                for (let i = 0; i < points.length - 1; i++) {
                    let x1 = points[i][0],
                        y1 = points[i][1];
                    let x2 = points[i + 1][0],
                        y2 = points[i + 1][1];
                    if (i === 0) {
                        path.moveTo(x1, y1);
                    }
                    let cpx1 = cPoints[i * 2][0];
                    let cpy1 = cPoints[i * 2][1];
                    let cpx2 = cPoints[i * 2 + 1][0];
                    let cpy2 = cPoints[i * 2 + 1][1];
                    path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
                }
            }
        } else {
            for (let i = 0; i < len - 1; i++) {
                let point = points[i];
                if (i === 0) {
                    path.moveTo(point[0], point[1]);
                }
                let nextPoint = points[i + 1];
                path.lineTo(nextPoint[0], nextPoint[1]);
            }
        }
    },
});

export default CurvePolyline;
