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


//编写一个程序将数组扁平化  去除其中重复部分数据，最终得到一个升序且不重复的数组
var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];




