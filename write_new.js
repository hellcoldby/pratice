/*
 * @Description: 
 * Q: new 是为了解决什么问题？
 * A: 构造函数复用，生成的每个实例都有自己的内存地址，互不影响，除了原型上的公共方法
 * @Author: ygp
 * @Date: 2021-01-16 19:05:45
 * @LastEditors: ygp
 * @LastEditTime: 2021-01-16 20:03:44
 */

function toNew(fn){
    let obj = Object.create(null);
    //截取第一个参数,arguments已经改变
    const _fn = [].shift.call(arguments);
    const res = _fn.apply(obj, arguments);
    //obj继承fn原型上的属性和方法
    Reflect.setPrototypeOf(obj, _fn.prototype);
    //有return 就返回 res, 没有就返回 函数本身
    return res instanceof obj? res : obj;
}

//有return 就返回 res, 没有就返回 函数本身
function Animals(color, name){
    this.name = name;
    this.color = color;
    return{
        color,
        name,
    }
}