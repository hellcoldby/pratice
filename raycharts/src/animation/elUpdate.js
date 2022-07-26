/*
 * Description:
 * Author: vicky
 * Date: 2021-01-28 16:19:04
 * LastEditTime: 2021-03-24 13:43:44
 * FilePath: \packages\raycharts\src\animation\elUpdate.js
 */
/**
 * @method elUpdate
 * @description animateTo 的封装方法
 * @param {Object}
 * @returns
 * @example
 * animateTo(target, time, delay, easing, callback, forceAnimate)
 */
export function elUpdate(sub, config) {
    sub.animateTo(config);
    return;
}
