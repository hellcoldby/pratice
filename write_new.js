/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-02-21 19:06:19
 * @LastEditors: ygp
 * @LastEditTime: 2021-02-21 19:39:07
 */

// 模拟实现一个 new 函数  new fn() --> toNew(fn)
 function toNew(){
    const fn = [].shift.call(arguments);

    let obj = Object.create(null);
    const res = obj.apply(fn, arguments);

    obj.prototype = fn.prototype;
    return res instanceof Object? res: obj;
 }
