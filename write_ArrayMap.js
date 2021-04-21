/*
 * @Description: 手写 map  filter  from
 * @Author: ygp
 * @Date: 2021-04-20 17:07:06
 * @LastEditors: ygp
 * @LastEditTime: 2021-04-21 13:23:55
 */

// 返回新数组
Array.prototype.MyMap = function(fn, context){
    var arr = Array.prototype.slice.call(this); //
    var mappedArr = [];
    for(var i=0; i<arr.length; i++){
        mappedArr.push(fn.call(context, arr[i], i, this));
    }
    return  mappedArr;
}

// 返回条件符合的数组
Array.prototype.MyFilter = function(fn, context){
    var arr = Array.prototype.slice.call(this);
    var filterArr = [];
    for(var i=0; i<arr.length; i++){
        if(fn.call(context, arr[i])){
            filterArr.push(arr[i]);
        }
    }
    return filterArr;
}

// 类数组转换为数组
Array.prototype.myForm = function(fn, context){
    var arr = Array.prototype.slice.call(this);
    if(fn){
        var mappedArr = [];
        for(var i=0; i<arr.length; i++){
            mappedArr.push(fn.call(context, arr[i], i, this));
        }
        return mappedArr;
    }
}


Array.prototype.myReduce = function(fn, initValue){
    var arr = Array.prototype.slice.call(this);
    var res, startIndex;
    res = initValue? initValue: arr[0];
    startIndex  = initValue? 0 : 1;
    for(var i = startIndex; i < arr.length; i++){
        res = fn.call(null, res, arr[i], i, this);
    }
    return res;
}
