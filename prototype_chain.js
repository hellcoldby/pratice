/*
 * @Description: 原型链
 * @Author: ygp
 * @Date: 2021-02-21 19:28:26
 * @LastEditors: ygp
 * @LastEditTime: 2021-02-21 21:05:43
 */

 /**
  * 1. js中，万物皆是对象。
  * 2. 对象又分为 普通对象 和 函数对象。
  * 3. 内置函数对象 Function， 所有函数都是由它派生的
  *     
  * 4. 
  * 
  * 5. 打印 Function.__proto__  , Function.prototype 结果是一样的都是底层源码 f()[native code]
  *    所以 Function.__proto__  === Function.prototype //true 
  *    所有的函数对象出生，都会带上 prototype 和 __proto__
  *     prototype --- 身份证信息
  *     __proto__ --- 基因链信息
  *     
  * 
  * 
  * 
  * 6. 内置函数对象Object
  *    Object 的prototype(身份信息)可以打印出来
  *    Object.__proto__ (基因链信息)也指向了  f()[native code]
  * 7. new Object() 或者 {} 是没有 （prototype）身份信息的。 只有__proto__
  * 
  *     ({}).__proto__.__proto__ //null
  *     Object.prototype.__proto__ //null
  * 
  * 8. 在JavaScript 中，每个对象都有一个指向它的原型（prototype）对象的内部链接。
  *    这个原型对象又有自己的原型，直到某个对象的原型为 null 为止（也就是不再有原型指向），
  *    组成这条链的最后一环。这种一级一级的链结构就称为原型链（prototype chain）。
  *    
  * 
  */

  function grandFar(){}

  function far(){}

  function son(){}

  