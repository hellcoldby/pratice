/*
 * Description:动画方法
 * Author: vicky
 * Date: 2020-12-10 19:37:22
 * LastEditTime: 2020-12-10 22:09:54
 * FilePath: \packages\raycharts\src\charts\Funnel\animator.js
 */
import { Group } from '../../shape';
/**
 * @method addAnimate 添加动画
 * @param {*} child 被添加对象
 * @param {*} time 动画时间
 * @param {*} delay 延时
 * @param {*} aFun 动画方法
 */
export function addAnimate(child, time, delay, aFun) {
    if (child instanceof Group) {
        child.eachChild((child) => addAnimate(child, time, delay, aFun));
    } else {
        aFun(child, time, delay);
    }
}

/**
 * @method addAnimateOneByOne 动画顺序出现
 * @param {*} child
 * @param {*} time
 * @param {*} delay
 * @param {*} aFun
 * @param {*} count 动画对象总数
 */
export function addAnimateOneByOne(child, time, delay, aFun, count) {
    let shapeTime = time / count;
    if (child instanceof Group) {
        child.eachChild((child) => addAnimateOneByOne(child, time, delay, aFun, count));
    } else {
        aFun(child, shapeTime, delay + shapeTime * child.dataIndex);
    }
}

/**
 * @method fadeIn 渐隐渐现
 * @param {*} child 被添加对象
 * @param {*} duration 动画时间
 * @param {*} delay 延时
 */
export function fadeIn(child, duration, delay) {
    let endOpacity = child.style.opacity;
    child.style.opacity = 0;
    child.animateTo(
        {
            style: {
                opacity: endOpacity,
            },
        },
        { duration, delay },
    );
}
