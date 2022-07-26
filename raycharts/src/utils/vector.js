import { vector } from 'zrender';

/**
 * 向量相加
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Vector}
 */
function add(v1, v2) {
    return vector.add([], v1, v2);
}

/**
 * 向量相减
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Vector}
 */
function sub(v1, v2) {
    return vector.sub([], v1, v2);
}

/**
 * 向量点乘
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return
 */
function dot(v1, v2) {
    return vector.dot(v1, v2);
}

/**
 * 负向量
 * @param {Vector2} v
 * @return {Vector}
 */
function negate(v) {
    return vector.negate([], v);
}

/**
 * 向量的模长
 * @param  {Vector2} v
 * @return {Number}
 */
function len(v) {
    return vector.len(v);
}

/**
 * 向量的距离
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 * @return {Number}
 */
function distance(v1, v2) {
    return vector.distance(v1, v2);
}

/**
 * 求两个向量最小值
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 * @return {Vector}
 */
function vectorMin(v1, v2) {
    return vector.min([], v1, v2);
}

/**
 * 求两个向量最大值
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 * @return {Vector}
 */
function vectorMax(v1, v2) {
    return vector.max([], v1, v2);
}

/**
 * 获取单位向量
 * 模长变为 1
 * @param  {Vector} v
 * @return  {Vector}
 */
function normalize(v) {
    return vector.normalize([], v);
}

/**
 * 求向量夹角
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 * @return {Number}
 */
function InAngle(v1, v2) {
    return Math.acos(dot(v1, v2) / (len(v1) * len(v2)));
}

/**
 * 向量当前角
 * @param  {Vector2} v1
 * @return {Number}
 */
export function vAngle([x, y]) {
    if (x >= 0 && y >= 0) {
        return Math.atan(y / x);
    } else if (x < 0 && y >= 0) {
        return Math.atan(y / x) + Math.PI;
    } else if (x < 0 && y < 0) {
        return Math.atan(y / x) + Math.PI;
    } else if (x >= 0 && y < 0) {
        return Math.atan(y / x) + Math.PI * 2;
    }
}

/**
 * 将向量 v 缩放 s 倍
 * @param  {Vector2} v
 * @param  {num} s
 * @return  {Vector}
 */
function scale(v, s) {
    return vector.scale([], v, s);
}

export default {
    add,
    sub,
    dot,
    negate,
    len,
    distance,
    vectorMin,
    vectorMax,
    normalize,
    InAngle,
    vAngle,
    scale,
};
