/**
 * 贝塞尔平滑曲线
 * @module zrender/shape/util/smoothBezier
 * @author pissang (https://www.github.com/pissang)
 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 */

/**
 * 向量相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function add(out, v1, v2) {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];
    return out;
}

/**
 * 向量相减
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function sub(out, v1, v2) {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    return out;
}

/**
 * 求两个向量最小值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */
function min$1(out, v1, v2) {
    out[0] = Math.min(v1[0], v2[0]);
    out[1] = Math.min(v1[1], v2[1]);
    return out;
}

/**
 * 求两个向量最大值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */
function max$1(out, v1, v2) {
    out[0] = Math.max(v1[0], v2[0]);
    out[1] = Math.max(v1[1], v2[1]);
    return out;
}

/**
 * 克隆一个向量
 * @param {Vector2} v
 * @return {Vector2}
 */
function clone(v) {
    let ArrayCtor$1 = typeof Float32Array === 'undefined' ? Array : Float32Array;
    let out = new ArrayCtor$1(2);
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * 向量缩放
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {Number} s
 */
function scale$1(out, v, s) {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
    return out;
}

/**
 * 计算向量间距离
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Number}
 */
function distance(v1, v2) {
    return Math.sqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]));
}

/**
 * 贝塞尔平滑曲线
 * @alias module:zrender/shape/util/smoothBezier
 * @param {Array} points 线段顶点数组
 * @param {number} smooth 平滑等级, 0-1
 * @param {boolean} isLoop 是否闭合图形
 * @param {Array} constraint 将计算出来的控制点约束在一个包围盒内
 *                           比如 [[0, 0], [100, 100]], 这个包围盒会与
 *                           整个折线的包围盒做一个并集用来约束控制点。
 * @param {Array} 计算出来的控制点数组
 */
export default function smoothBezier(points, smooth, isLoop, constraint) {
    var cps = []; //

    var v = [];
    var v1 = [];
    var v2 = [];
    var prevPoint;
    var nextPoint;

    var min;
    var max;
    //如果包围盒存在
    if (constraint) {
        min = [Infinity, Infinity];
        max = [-Infinity, -Infinity];
        //遍历点集合，
        for (let i = 0, len = points.length; i < len; i++) {
            //求出向量点的最小值
            min$1(min, min, points[i]);
            //求出向量点的最大值
            max$1(max, max, points[i]);
        }
        // 求出最小坐标和最大坐标再 与指定的包围盒做并集
        min$1(min, min, constraint[0]);
        max$1(max, max, constraint[1]);
    }

    //遍历点集合，
    for (let i = 0, len = points.length; i < len; i++) {
        var point = points[i];

        if (isLoop) {
            prevPoint = points[i ? i - 1 : len - 1];
            nextPoint = points[(i + 1) % len];
        } else {
            if (i === 0 || i === len - 1) {
                //克隆第一个值 或者 最后一个值
                cps.push(clone(points[i]));
                continue;
            } else {
                prevPoint = points[i - 1];
                nextPoint = points[i + 1];
            }
        }

        //两个向量相减， 向量差
        sub(v, nextPoint, prevPoint);

        // 根据平滑度缩放向量差
        scale$1(v, v, smooth);

        //当前点到上一个点的距离， 勾股定理求出
        var d0 = distance(point, prevPoint);
        //当前点到下一个点的距离， 勾股定理求出
        var d1 = distance(point, nextPoint);

        //计算出前后点在总距离中占的百分比
        var sum = d0 + d1;
        if (sum !== 0) {
            d0 /= sum;
            d1 /= sum;
        }

        //根据占位百分比 计算前一个点的向量差
        scale$1(v1, v, -d0);
        //根据占位百分比 计算后一个点的向量差
        scale$1(v2, v, d1);

        //根据向量差，计算前后点的坐标
        var cp0 = add([], point, v1);
        var cp1 = add([], point, v2);

        //计算出边界
        if (constraint) {
            max$1(cp0, cp0, min);
            min$1(cp0, cp0, max);

            max$1(cp1, cp1, min);
            min$1(cp1, cp1, max);
        }
        cps.push(cp0); //前一个向量坐标
        cps.push(cp1); //后一个向量坐标
    }

    if (isLoop) {
        cps.push(cps.shift());
    }

    return cps;
}
