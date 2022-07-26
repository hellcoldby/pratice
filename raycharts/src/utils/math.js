/*
 * Description:math 高精度处理(主要用于浮点数计算，解决浮点数计算bug)
 * Author: vicky
 * Date: 2020-11-18 20:33:23
 * LastEditTime: 2020-11-18 21:48:06
 * FilePath: \packages\raycharts\src\utils\math.js
 */
import { add as _add, subtract as _subtract, multiply as _multiply, divide as _divide, bignumber } from 'mathjs';

/**
 * @member add 加法
 * @param {*} a
 * @param {*} b
 */
export function add(a, b) {
    return _add(bignumber(a), bignumber(b));
}

/**
 * @member subtract 减法
 * @param {*} a
 * @param {*} b
 */
export function subtract(a, b) {
    return _subtract(bignumber(a), bignumber(b));
}

/**
 * @member multiply 乘法
 * @param {*} a
 * @param {*} b
 */
export function multiply(a, b) {
    return _multiply(bignumber(a), bignumber(b));
}

/**
 * @member divide 除法
 * @param {*} a
 * @param {*} b
 */
export function divide(a, b) {
    return _divide(bignumber(a), bignumber(b));
}
