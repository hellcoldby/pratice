/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-01-16 19:05:58
 * @LastEditors: ygp
 * @LastEditTime: 2021-01-16 22:57:27
 */
let foo = {
    value: 1
};
function bar(){
    console.log(this.value);
}

bar.call(foo); // -- 1;

// 原理-- 将bar函数挂载到foo上，并执行.最后删除foo.bar;
foo = {
    value:1,
    bar: function bar(){}
}
delete foo.bar;

//模拟实现第一步
Function.prototype.call = function(fn){
    fn.con = this;
    fn.con();
    delete fn.con;
}
//模拟实现第二步（参数）
Function.prototype.call = function(fn){
    
}