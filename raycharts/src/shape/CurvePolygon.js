/*
 * Description:
 * Author: vicky
 * Date: 2020-10-27 19:14:07
 * LastEditTime: 2020-10-28 06:33:38
 * FilePath: \packages\raycharts\src\shape\CurvePolygon.js
 */
import * as zrender from 'zrender';
import _ from 'lodash';
import smoothBezier from '../utils/smoothBezier';

const CurvePolygon = zrender.Path.extend({
    type: 'CurvePolygon',
    shape: {
        points: [],
        smooth: 0,
        constraint: null,
    },
    buildPath: function (path, shape) {
        const points = shape?.points ?? [];
        const len = points?.length ?? 0;
        if (shape?.smooth > 0 && points.length >= 4) {
            if (points.length === 4) {
                let x0 = points[0][0],
                    y0 = points[0][1];
                let x1 = points[1][0],
                    y1 = points[1][1];
                let x2 = points[2][0],
                    y2 = points[2][1];
                let x3 = points[3][0],
                    y3 = points[3][1];
                path.moveTo(x0, y0);
                path.lineTo(x1, y1);
                let x4 = (x1 + x2) / 2 - (y1 - y2) * shape.smooth;
                let y4 = (y1 + y2) / 2 - (x2 - x1) * shape.smooth;
                path.quadraticCurveTo(x4, y4, x2, y2);
                path.lineTo(x3, y3);
            } else {
                let newPoints = _.cloneDeep(points);
                let sP = newPoints[0];
                let eP = newPoints[newPoints.length - 1];
                newPoints = _.pull(newPoints, sP, eP);
                const cPoints = smoothBezier(newPoints, shape.smooth, false, shape.constraint);
                for (let i = 0; i < points.length - 2; i++) {
                    let x1 = points[i][0],
                        y1 = points[i][1];
                    let x2 = points[i + 1][0],
                        y2 = points[i + 1][1];
                    if (i === 0) {
                        path.moveTo(x1, y1);
                        path.lineTo(x2, y2);
                    } else {
                        let int = i - 1;
                        let cpx1 = cPoints[int * 2][0];
                        let cpy1 = cPoints[int * 2][1];
                        let cpx2 = cPoints[int * 2 + 1][0];
                        let cpy2 = cPoints[int * 2 + 1][1];
                        path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
                    }
                }
                path.lineTo(points[points.length - 1][0], points[points.length - 1][1]);
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

export default CurvePolygon;
