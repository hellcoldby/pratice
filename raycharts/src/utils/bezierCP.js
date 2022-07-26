import _ from 'lodash';
import vector from './vector';
const { add, sub, dot, negate, len, distance, vectorMin, vectorMax, normalize, InAngle, scale } = vector;

/**
 * 获取 当前点的前后控制点
 *
 * @param arr       点数组
 * @param i         序号
 * @param curvature 曲率
 * @return cPoint[][]
 */
export function getControlPoint(arr, i, curvature = 0) {
    if (i <= 0) {
        return [_.nth(arr, 0), _.nth(arr, 0)];
    } else if (i >= arr.length - 1) {
        return [_.nth(arr, -1), _.nth(arr, -1)];
    } else {
        return getControlPointApp(arr[i], getNth(arr, i - 1), getNth(arr, i + 1), curvature);
    }
}
/**
 * 获取 当前点的前后控制点(App方法)
 *
 * @param point     point
 * @param pointPrev pointPrev
 * @param pointNext pointNext
 * @return PointF[]
 */
function getControlPointApp(point, pointPrev, pointNext, curvature = 0.33) {
    const v1 = sub(pointPrev, point);
    const v2 = sub(pointNext, point);

    const v1Len = len(v1);
    const v2Len = len(v2);

    const centerV = normalize(add(normalize(v1), normalize(v2)));

    const ncp1 = [centerV[1] * 1, centerV[0] * -1];
    const ncp2 = [centerV[1] * -1, centerV[0] * 1];
    // 按照点位先后顺序返回控制点位置
    if (InAngle(ncp1, v1) < Math.PI / 2) {
        const point1 = add(scale(ncp1, v1Len * curvature), point);
        const point2 = add(scale(ncp2, v2Len * curvature), point);
        return [point1, point2];
    } else {
        const point1 = add(scale(ncp1, v2Len * curvature), point);
        const point2 = add(scale(ncp2, v1Len * curvature), point);
        return [point2, point1];
    }
}

/**
 * 获取 当前点的前后控制点(Web方法)
 *
 * @param point     point
 * @param pointPrev pointPrev
 * @param pointNext pointNext
 * @return PointF[]
 */
function getControlPointWeb(point, pointPrev, pointNext, curvature = 0.33) {
    const pointArr = [];

    const v0 = scale(sub(pointNext, pointPrev), curvature);
    let distance0 = distance(point, pointPrev);
    let distance1 = distance(point, pointNext);
    const distanceSum = distance0 + distance1;
    if (distanceSum != 0) {
        distance0 = distance0 / distanceSum;
        distance1 = distance1 / distanceSum;
    }
    const v1 = scale(v0, -distance0);
    const v2 = scale(v0, distance1);
    const point1 = add(point, v1);
    const point2 = add(point, v2);
    pointArr[0] = point1;
    pointArr[1] = point2;

    return pointArr;
}
/**
 * 防止数组溢出
 * @param arr     arr
 * @param i       index
 * @return item
 */
const getNth = (arr, i) => (i <= 0 ? arr[0] : i >= arr.length - 1 ? arr[arr.length - 1] : arr[i]);
