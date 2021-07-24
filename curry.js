/*
 * @Description: 函数柯理化
 * @Author: ygp
 * @Date: 2021-04-05 00:26:37
 * @LastEditors: ygp
 * @LastEditTime: 2021-06-21 00:51:54
 */

/**
 * 思路：
 * 将 多个参数的函数， 拆解成每次传递一个或多个的函数， 参数数量达到要求就执行结果
 * 例如:  function add(1,2,3);
 * 柯理化：  curry(add)(1)(2)(3)  或者 curry(add)(1,2)(3) 或者 curry(add)(1)(2,3);
 */

 function test(a, b, c){
    
    console.log('res---', a, b, c);
}

//es5 第一版： 
function curry5(fn){
    const fn_len = fn.length;
    //记录参数的个数
    let args = [].slice.call(arguments,1);

    function generate(){
        //合并每次传递来的参数
        [].push.apply(args, arguments);
       
        if(args.length >= fn_len){
           return fn.apply(this, args);
        }else{
            return generate;
        }
    }

    return generate;
}


//es5_1
function curry5_1 (fn){
  
    function generate(){
        let args = [].slice.call(arguments);
       if(args.length === fn.length){
           return fn.apply(this, args);
       }else{
         return function(){
             [].push.apply(args, arguments);
            return  generate.apply(this, args);
         }   
       }
    }
    return generate;
}

//利用扩展运算符号
function curry6(fn){
    
    //记录参数的个数
    let args = [];
    function generate(){
        //合并每次传递来的参数
        args = [ ...arguments];
        if(args.length >= fn.length){
           return fn.apply(this, ...args);
        }else{
            return generate;
        }
    }

    return generate;

    
}

function curry6_1 (fn){
   
    function generate(...args){
       if(args.length === fn.length){
           return fn.call(this, ...args);
       }else{
         return function(){
            return  generate.call(this, ...args, ...arguments);
         }   
       }
    }
    return generate;
}

//es6

function curry6_2(){
    judge = (...args) =>
        args.length >= fn.length
            ? fn(...args)
            : (...arg) => judge(...args, ...arg)
    return judge;
}


curry5(test)(1)(2)(3);
curry5_1(test)(1)(2)(3);
curry6_1(test)(1)(2)(3);