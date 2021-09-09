
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

    static resolve(value){
        return new Promise((resolve, reject)=>{
            resolve(value);
        });
    }

    static reject(reason){
        return new Promise ((reason, reject)=>{
            reject(reason);
        })
    }

    constructor(fn){
        this.value = null;
        this.error = null;
        this.state = PENDING;
        this.onFulfilled_ary = [];
        this.onRejected_ary = [];

        let resolve = (val)=>{
            
            if(val instanceof Promise){
                return  val.then(resolve, reject)
            }

           this.value = val;
           this.state = FULFILLED;
           this.onFulfilled_ary.forEach(fn=>fn());
        }

        let reject = (error)=>{
            // console.log('错误', error);
            this.error = error;
            this.state = REJECTED;
        }

        try{
            fn(resolve, reject);
        }catch(err){
            reject(err);
        }
    }

    then(onFulfilled, onRejected){
     
        return new Promise((resolve, reject)=>{

            if(this.state === PENDING){
                this.onFulfilled_ary.push(()=>{
                    let x = onFulfilled(this.value);
                    checkPromise(x, resolve, reject);
                });

                this.onRejected_ary.push(()=>{
                    let x = onRejected(this.error);
                    checkPromise(x, resolve, reject);
                })
            }

            if(this.state === FULFILLED){
               let x = onFulfilled(this.value);
               checkPromise(x, resolve, reject);
            }
            if(this.state === REJECTED){
               let x = onRejected(this.error);
               checkPromise(x, resolve, reject);
            }

        });
    }

    catch (errCallback) {
        return this.then(null, errCallback);
    }

    finally(callback){
        return this.then(value => {
            return Promise.resolve(callback()).then(()=>value)
        }, reason=>{
            return Promise.resolve(callback()).then(()=>{throw reason})
        });
    }


    //all() 将多个Promise 实例，包装成一个新的Promise 实例。
    //接收一个数组 或者 具有iterator 接口作为参数，  而且成员都是promise实例。
    // 如果成员不是Promise实例，就用promise的resolve方法，将参数转为 Promise 实例。
    all(ary) {

        if(ary[Symbol.iterator] === undefined){
            const type = typeof ary;
            return new TypeError (`TypeError: ${type} ${ary} is not iterator`);
        }

        let newArray=[];
        let count = 0;
        let len = ary.length;
        return new Promise((resolve, reject)=>{
            for(let index in  ary){
                // 转化为promise 对象
                Promise.resolve(ary[index])
                .then(res=>{
                    newArray[index] = res;
                    if(++count === len){
                        resolve(newArray);
                    }
                }, err=>{
                    return reject(err);
                })
            }   
        })
    }
}


function checkPromise(x, resolve, reject){
    if(x instanceof Promise){
        x.then(res=>{
            checkPromise(res, resolve, reject);
        }, rej=>{
            reject(rej);
        })
    }else{
        resolve(x)
    }
}


