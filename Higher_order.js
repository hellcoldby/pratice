/** 
 * 高阶函数
 * 函数作为参数
 * 
 */

/**
 * js内置的一些高阶函数
 * Array.prototype.map，
 * Array.prototype.filter
 * Array.prototype.reduce
 */

//封装一个判断 数据类型的函数
function isType(type) {
    return (obj)=> Object.prototype.toString.call(obj) === '[object]'+type+']';
}

function add(a){
    function sum(b){
        a = a + b;
        return sum; // 返回 sum 就可以循环调用了
    }
    sum.toString = function(){ return a };
    return sum;
}

let res1 = add(1);
let res2 = add(1)(2);
let res3 = add(1)(2)(3);

// console.log(res1, res2, res3);
console.log(res1 + res2 + res3);