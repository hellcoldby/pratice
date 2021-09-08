
/**
 * promise --- 承诺
 * promise(如果成功， 如果失败)
 * 
 * promise.then(获取成功的结果， 获取失败的原因) ---> 默默许下新的承诺
 * 
 * promise.then().then().then().then()..... 重复履行承诺
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise{
    constructor(fn){
        this.value = null;
        this.error = null;
        this.state = PENDING;

        this.resolve = (val)=>{
        //    console.log('解决',val);
           this.value = val;
           this.state = FULFILLED;
        }

        this.rejected = (error)=>{
            // console.log('错误', error);
            this.error = error;
            this.state = REJECTED;
        }

        fn(this.resolve, this.rejected);
    }

    then(onFulfilled, onRejected){
        //需要返回一个新的 promise 才能链式调用
        return new Promise((resolve, reject)=>{
            //检测履行承诺的结果
            if(this.state === FULFILLED){
               let x = onFulfilled(this.value);
               //如果 x 是个 promise,等成功执行完成，后在then中履行当前的承诺
               checkPromise(x, resolve, reject);
            }
            if(this.state === REJECTED){
               let x = onRejected(this.error);
               checkPromise(x, resolve, reject);
            }

        });
    }
}


function checkPromise(x, resolve, reject){
    if(x instanceof Promise){
        x.then(res=>{
            checkPromise(res, resolve, reject);
        })
    }else{
        resolve(x)
    }
}






const pr = new Promise (function(resolve, rejected){
    resolve('im----ok');
});
pr.then(res=>{
    console.log('then---',res);
    return new Promise(resolve=>{
        resolve('hello');
    });
    // return 'hello'
}).then(res=>{
    console.log(res);
})
