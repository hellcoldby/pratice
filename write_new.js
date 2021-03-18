/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-02-21 19:06:19
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-18 16:14:11
 */

// 模拟实现一个 new 函数  new fn() --> toNew(fn)

// 目的： 照着原函数 仿造一个新的函数。
// 思路： 

 function toNew(){
    let obj = Object.create(null);
    const fn = [].shift.call(arguments);
    obj.prototype = fn.prototype;
    const res = fn.apply(obj, arguments);

    return res instanceof Object? res: obj;
 }


 