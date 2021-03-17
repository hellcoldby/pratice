/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-02-21 19:06:19
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-17 15:41:16
 */

// 模拟实现一个 new 函数  new fn() --> toNew(fn)
 function toNew(){
    let obj = Object.create(null);
    const fn = [].shift.call(arguments);
    obj.prototype = fn.prototype;
    const res = fn.apply(obj, arguments);

    return res instanceof Object? res: obj;
 }
