
/**
 * promise 承诺   一件事
 * promise 承诺 （ fn(成功的话， 失败的话){} ）
 * 
 * promise.then() 履行承诺  履行后 许下一个新的承诺 
 * promise.then( 成功时执行fn， 失败时执行fn )   
 * 
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';


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
        
        //如果onFulfilled 不是函数类型, 就改造成函数类型,继续返回一个新的 promise
        if(typeof onFulfilled !== 'function'){
            onFulfilled = ( val )=> val;
        }

     

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
}
/**
 * all() 将多个Promise 实例，包装成一个新的Promise 实例。
 * 接收一个数组 或者 具有iterator 接口作为参数，  而且成员都是promise实例。
 * 如果成员不是Promise实例，就用promise的resolve方法，将参数转为 Promise 实例。
 */

Promise.all =(ary) =>{

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
                 reject(err);
            })
        }   
    })
}



// var p1 = new Promise((resolve)=>{setTimeout(()=>{return resolve(3);},3000)});
// var p2 =Promise.resolve(1);
// var p3 =Promise.resolve(2);


// var p = Promise.all([p1,p2,p3]);

// p.then(e=>{console.log(e)});

let p = new Promise(resolve=>{
    resolve('hahaha');
});

p.then(21312).then(res=>{
    console.log(res);
})