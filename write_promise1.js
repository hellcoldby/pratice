/*
 * @Description: promise 解析
 * @Author: ygp
 * @Date: 2021-03-25 16:57:34
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-28 21:25:07
 */
/**
 * Promise 接收一个函数作为参数
 * function(resolve, reject){} -- 函数有个两个参数（也是函数）
 * resolve() --- 成功时执行
 * reject() --- 失败时执行
 * 
 * Promise的静态方法
 * 1. Promise.resolve() --- 成功时执行
 * 2. Promise.reject() --- 失败时执行
 * 
 * resolve('成功时执行的内容')
 * reject('失败时传递的内容') 
 * 
 * Promise.prototype.then(onFulfilled, onRejected) --- then有两个函数参数
 * onFulfilled(res) --- res代表成功时传递的内容
 * onRejected(err) --- err代表失败时传点的内容   
 * 
 * 
 * 
 * 多个 new Promise(resolve, reject)的返回值 --- p1, p2, p3，
 * 1.全部异步执行 --- Promise.all(p1,p2,p3)
 * 2.执行最快的结果（不看最终结果）--- Promise.race(p1,p2,p3);
 * 
 * 
 * 
 * 
 * p1 = new Promise(....);
 * p1.then() ---- 没有参数 --- p2.then(res)会接收p1的res
 * p1.then(res=> 'xxx') --- p2.then(r)--参数就是xxx
 * p1.then(res=> new Promise(...)) --- p2.then()会等p1.then()里边的执行完成
 * 
 * p1.then()--- 抛出错误，p2.then()也抛出错误
 * 
 */
// 第一版代码
function Promise(fn){
    
    this._value = undefined;

    try{
        fn(this._resolve.bind(this), this._reject.bind(this))
    }catch(err){
        this._reject(err);
    }

    this._resolve = function(val){
        this._value = val;
    }
    this._reject = function(err){
        this._value = err;
    }

}

Promise.prototype.then = function(){

}

Promise.prototype.catch = function(){

}