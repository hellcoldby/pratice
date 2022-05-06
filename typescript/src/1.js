"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//基础数据类型
let name = 'hello';
let age = 20;
let married = false;
let hobbies = ['singing', 'dancing', 'coding'];
let interests = ['singing', 'dancing', 'coding'];
let old; //数字或字符串
old = '十二';
old = 12;
const ele = ['hello', 2, true];
//枚举
var Color0;
(function (Color0) {
    Color0[Color0["red"] = 0] = "red";
    Color0[Color0["green"] = 1] = "green";
    Color0[Color0["blue"] = 2] = "blue";
})(Color0 || (Color0 = {}));
; //0,1,2 
console.log(Color0.red, Color0[2]);
var Color;
(function (Color) {
    Color["red"] = "hello";
    Color["green"] = "123";
    Color[Color["blue"] = 1] = "blue";
})(Color || (Color = {}));
; //枚举赋值必须能够计算
console.log(Color.red, Color.blue); //不能索引
; //0,1,2
console.log(0 /* red */); //不能索引
//dom 类型
let div = document.createElement('div');
div.innerHTML = 'hello'; // 断言div一定存在 
//null undefined
let myName = null; // 配置文件"strictNullChecks": false ----允许null
myName = 'tom';
let yourName = undefined;
yourName = 'jerry';
//函数返回值 void --- 函数没有返回值
function test() {
    console.log('test');
    return null; //ok
    return undefined; //ok
}
//never --- 函数永远不会结束
function error(message) {
    //例如，抛出错误
    throw new Error(message);
}
function while1() {
    while (true) {
        console.log('while');
    }
    console.log('end');
}
//包装对象
let name1 = 'hello';
name1.toLocaleLowerCase(); //将name 转成小写
//断言
let name2;
name2.toLocaleLowerCase(); //name2 断言为一个字符串
name2.toFixed(2); //name2 断言为一个数字
//函数定义
function hello(name) {
    console.log('hello' + name);
}
//函数表达式
let getUserName = function (firstName, lastName) {
    return lastName + firstName;
};
//可选参数
function print(name, age, home) {
    console.log(name);
    console.log(age);
}
//这些都ok
print();
print('hello');
print('hello', 18);
print('hello', 18, 'beijing');
print(undefined, undefined, undefined);
//剩余参数
function sum(...numbers) {
    return numbers.reduce((acc, item) => acc + item, 0);
}
function attr(val) {
    if (typeof val === 'string') {
        console.log(val);
    }
    else if (typeof val === 'number') {
        console.log(val);
    }
}
function sum2(a, b) {
}
sum2('d', 'd');
sum2(1, 1);
