/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-02-21 19:06:19
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-22 10:16:05
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

 // 先对比一下 new  和 继承的 核心思路

/**
 *  1. new --- 当前函数
 *  - 1.1 创建空对象
 *  - 1.2 当前函数this 指向空对象
 *  - 1.3 空对象挂载当前函数的所有扩展方法
 * 
 * 
 *  2. 继承 --- 当前函数
 *  - 2.1 创建子函数
 *  - 2.2 当前函数的this 指向子函数
 *  - 2.3 子函数挂载当前函数所有的扩展方法
 */

// 对比之后你会发现：new 和 继承 的思路是一样的
// 不同之处在于，
// new 是内部函数内部创建一个空对象返回一个新对象，  
// 继承是你自己创建的函数，复用父级函数的属性方法

 