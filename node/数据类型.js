/**
 * 基本数据类型(值类型)
 * number string  boolean null undefined  Symbol
 * 引用数据类型
 * Object  Array Function
 */


// 判断数组类型的几种方法和优缺点

typeof []; // typeof 只适用于基本数据类型。 缺点：对于引用数据类型和null 返回的都是 object

//1. 判断 Array 是否在[]的原型链中   缺点： null 和 undefined 返回的事false
 [] instanceof Array

 //2. 判断Array 是否在[]的原型链中 
 Array.prototype.isPrototypeOf([]);

 //3. toString 每一个对象都继承了底层Object上的toString 方法，返回[object, type]
 Object.prototype.toString.call([]); //[object Array]

 //4. isArray
 Array.isArray([]);

 //5. constructor   缺点：  null 和 undefined 没有constructor 属性
 [].constructor = Array

