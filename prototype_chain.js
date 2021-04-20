/*
 * @Description: 原型
 * @Author: ygp
 * @Date: 2021-02-21 19:28:26
 * @LastEditors: ygp
 * @LastEditTime: 2021-02-21 21:05:43
 */

 /**
  * 
  * 1. js中，万物皆是对象。
  * 2. 对象又分为 普通对象 和 函数对象。
  *   
  *  内置的函数对象 ---- Function
  *  没有自己的属性和方法
  *  它从自己的原型链 Function.prototype 上继承一些属性和方法。
  *  
  *  Function.prototype.apply();
  *  Function.prototype.bind();
  *  Function.prototype.call();
  *  Function.prototype.toString();
  *   
  *   可以用 new Function ('a','b', 'return a +b') 来创建函数
  * 
  * 
  *   注意： 
  *   function createFunction1() {
        var x = 20;
        return new Function('return x;'); // 这里的 x 指向最上面全局作用域内的 x
     }
  * 
  *  
  *   函数声明创建的function (){}函数  是一个 Function 对象，具有 Function 对象的所有属性、方法和行为。
  *   函数声明 有变量提升
  *   函数表达式 没有提升
  *   
  *   
  *   
  * 
  */




  