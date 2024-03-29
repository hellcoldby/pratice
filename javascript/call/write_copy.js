/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-03-27 14:18:34
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-27 15:48:21
 */



//1. 浅拷贝
function extendCopy(parent){
    let child = {};
    for(let i in parent){
        child[i] = parent[i];
    }
    child.uber = parent;  // 记录来源
    return child;

}

//2. 深拷贝 todo

let a = [1,3,5];
let b = {a: 1, b: 2, c: 3};
let c = [{a:1}, 2, [9, 8,7]];


console.log(deepClone(a));
console.log(deepClone(b));
console.log(deepClone(c));

//3. 深拷贝

function isObject(obj){
    if(typeof obj === 'object' && obj !== null) return true;
}

function myClone(source){
    
    if(!isObject(source)) return source;
    let target = Array.isArray(source)? []:{};
    if( key in source){
        if(Object.prototype.hasOwnProperty.call(source,key)){
            if(isObject(source)){
                target[key] = myClone(source);
            }else{
                target[key] = source[key];
            }
        }
    }
    return target;
}