import _ from 'lodash';
import vector from './vector';

const { add, sub, dot, negate, len, distance, vectorMin, vectorMax, normalize, InAngle, vAngle, scale } = vector;

const getNth = (arr, i) => _.nth(arr, i % arr.length);
export const radian2angle = (radian) => (radian * 180) / Math.PI;
export const angle2radian = (angle) => (angle * Math.PI) / 180;
function getLength([x1, y1], [x2, y2]) {
    const x = x1 - x2;
    const y = y1 - y2;
    return Math.sqrt(x * x + y * y);
}
// 获取圆角最大值
export function getMaxR(pointsArr, rArr, i) {
    const dPrev = getLength(getNth(pointsArr, i), getNth(pointsArr, i - 1));
    const dNext = getLength(getNth(pointsArr, i), getNth(pointsArr, i + 1));
    const rPrev = getR(getNth(rArr, i), getNth(rArr, i - 1), dPrev);
    const rNext = getR(getNth(rArr, i), getNth(rArr, i + 1), dNext);
    return Math.min(rPrev, rNext);
}

function getR(r, r0, distance) {
    return r + r0 > distance ? (distance * r) / (r + r0) : r;
}

// 获取内切圆半径
export function getCircleSize(pointsArr, i, radius) {
    const pPrev = getNth(pointsArr, i - 1);
    const pCurr = getNth(pointsArr, i);
    const pNext = getNth(pointsArr, i + 1);
    const currAngle = InAngle(sub(pPrev, pCurr), sub(pNext, pCurr));
    const circleSize = radius * Math.tan(currAngle / 2);
    return circleSize;
}

// 获取角内切圆圆心
export function getCenterPoint(pointsArr, i, circleSize) {
    const pPrev = getNth(pointsArr, i - 1);
    const pCurr = getNth(pointsArr, i);
    const pNext = getNth(pointsArr, i + 1);
    return getCutCenter(pPrev, pCurr, pNext, circleSize);
}

function getCutCenter(pPrev, pCurr, pNext, size) {
    const vPrev = normalize(sub(pPrev, pCurr));
    const vNext = normalize(sub(pNext, pCurr));
    const vCent = normalize(add(vPrev, vNext));
    const halfAngle = InAngle(vPrev, vCent);
    const dCent = size / Math.sin(halfAngle);
    const circleCenter = add(pCurr, scale(vCent, dCent));
    return circleCenter;
}

// 获取角度范围
export function getAngleRange(pointsArr, i) {
    const pPrev = getNth(pointsArr, i - 1);
    const pCurr = getNth(pointsArr, i);
    const pNext = getNth(pointsArr, i + 1);
    const startAngle = vAngle(sub(pPrev, pCurr)) + Math.PI / 2;
    const endAngle = vAngle(sub(pNext, pCurr)) - Math.PI / 2;
    return [startAngle, endAngle];
}

// // 获取角内切圆圆心
// export function getCut([x1, y1], [x2, y2], [x3, y3], r) {
//     const AB = getLength([x1, y1], [x2, y2]);
//     const BC = getLength([x2, y2], [x3, y3]);
//     const AC = getLength([x1, y1], [x3, y3]);
//     // 周长
//     const perimeter = AB + BC + AC;
//     // 内切圆半径
//     const Rc = ((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / perimeter;
//     // 内切圆圆心 x 坐标
//     const Xc = (x1 * BC + x2 * AC + x3 * AB) / perimeter;
//     // 内切圆圆心 y 坐标
//     const Yc = (y1 * BC + y2 * AC + y3 * AB) / perimeter;

//     // x1 为端点 获得两个解
//     const ratioX = Rc / (Xc - x2);
//     const offsetX = -(ratioX * x2);
//     const targetX1 = (r - offsetX) / ratioX;
//     const targetX2 = (-r - offsetX) / ratioX;

//     // y1 为端点 获得两个解
//     const ratioY = Rc / (Yc - y2);
//     const offsetY = -(ratioY * y2);
//     const targetY1 = (r - offsetY) / ratioY;
//     const targetY2 = (-r - offsetY) / ratioY;

//     // 半中点 到每个解的距离
//     const [halfX, halfY] = [(x1 + x3) / 2 - x2, (y1 + y3) / 2 - y2];
//     const distance_1 = getLength([halfX, halfY], [targetX1 - x2, targetY1 - y2]);
//     const distance_2 = getLength([halfX, halfY], [targetX2 - x2, targetY2 - y2]);

//     // 返回距离近的
//     return distance_1 < distance_2 ? [targetX1, targetY1] : [targetX2, targetY2];
// }
