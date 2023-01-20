/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-06-07 06:44:08
 * @LastEditors: ygp
 * @LastEditTime: 2021-06-21 00:57:46
 */
// 实现 add(1)(2)(3)

//es5
function add(...args){
    return function(y){
        return function(z){

            console.log(args, y ,z)
            return args[0] + y + z;
        }
    }
}

 const res = add(1)(2)
 console.log(res(3));
//es6
// const add1 = x => y => z => x+y+z;

// 柯理化的实现原理
/**
 * 获取函数本有的参数个数，
 * 在柯理化函数中，计算传入的参数个数，合并参数知道和本来参数个数一致
 */

function curry(fn){
   
    let concat = [];
    function sum(...args){
        concat = [ ...args];
        if(concat.length = fn.length){
            fn.apply(this, concat);
        }else{
            return  sum;
        }
    }
    return sum;
    
}
function curry1(fn){
    function sum(...args){
        if(args.length === fn.length){
            fn.apply(this, args);
        }else{
            return function(...rest){
                const ary = [...args, ...rest];
                return sum.apply(this, ary);
            }
        }
    }
    return sum;
}