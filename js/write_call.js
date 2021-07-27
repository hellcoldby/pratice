/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-02-21 19:06:19
 * @LastEditors: ygp
 * @LastEditTime: 2021-02-21 23:18:19
 */

 Function.prototype.toCall = function(fn){
     fn = fn? Object(fn): window;
     fn.con = this;
     let args = [];
     for(let i=1; i<arguments.length; i++){
        args.push(arguments[i] + '');
     }
     const res =  eval('fn.con('+args+')');
     delete fn.con;
     return res;
 }