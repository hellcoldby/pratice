/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-01-16 19:06:14
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-18 11:37:19
 */

//思路： 返回一个等待执行的函数
function toBind(obj){
    const _this = this;
    return function(){
        obj.call(_this)
    }
}
//参数
function toBind(obj){
    
    // const _this = this;
    const args = [].slice.call(arguments,1);

    // return function(){
        const bindArgs = [].slice.call(arguments);
        const concatArgs = args.concat(bindArgs);
    //     obj.call(_this, concatArgs);
    // }
}
//继承
function toBind(obj){
    
    // const _this = this;
    const args = [].slice.call(arguments,1);

    const fn = function(){
        const bindArgs = [].slice.call(arguments);
        const concatArgs = args.concat(bindArgs);
    //     obj.call(_this, concatArgs);
    }

    function tmpFn(){};
    tmpFn.prototype = this.prototype;
    fn.prototype = new tmpFn();
    return fn;
}