/**
 * Promise函数做参数：
 * 1. resolve --- resolve(yyy)代表执行成功 --- then 中传递yyy
 * 2. reject  --- reject(xxx)代表执行失败 --- catch 中传递xxx
 * 
 * 
 * 
 * Promise的静态方法
 * 1. Promise.resolve(yyy) 代表执行成功 --- then中传递yyy
 * 2. Promise.reject(xxx) 代表执行失败 --- catch 中传递xxx
 * 
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

class MyPromise {
    constructor(handler) {
        if(typeof handler !== 'function'){
            throw new Error ('MyPromise must accept a function as a paramter');
        }
        this._status = 'PENDING';
        this._value = undefined;

        try{
            handler(this._resolve.bind(this), this._reject.bind(this));
        }catch(err){
            this._reject(err);
        }
    }

    _resolve(val){
        if(this._status !== 'PENDING') return;
        this._status = 'FULFILLED';
        this._value = val;
    }

    _reject(err){
        if(this._status !== 'PENDING') return;
        this._status = 'REJECTED';
        this._value = err;
    }

}