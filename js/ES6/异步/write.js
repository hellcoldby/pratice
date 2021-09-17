
/**
 * promise 承诺
 * promise ( fn(成功的话fn， 失败的话fn){...} )
 * 
 * 
 * promise.then() 履行承诺
 * promise.then( 成功时执行fn， 失败时执行fn ) 
 * 
 * 链式调用  then() 就需要返回一个新的承诺  --- 成功执行fn的返回值，作为新承诺的参数
 * promise.then().then().then().....
 * 
 * 
 * 
 * 
 */


const PENDING = 'pending';
const SUCCESS = 'success';
const FAIL = 'fail';

class Promise{
    constructor(fn){

        this.value = null;
        this.error = null;
        this.state = PENDING;
        this.success_list = [];
        this.fail_list = [];

        const resolve=(value) =>{
            this.state = SUCCESS;
            this.value = value;
            this.success_list.forEach(fn=>{fn()});
        }

       const reject=(error)=>{
            this.state = FAIL;
            this.error = error;
            this.error_list.forEach(fn=>{fn()});
        }

        try{
            fn(resolve, reject);
        }catch (err){
            reject(err)
        }
    }


    then(onFulfilled, onRejected){ 

        if(typeof onFulfilled !== 'function'){
            onFulfilled = val => val;
        }
        if(typeof onRejected !== 'function'){
            onRejected = err => err;
        }

        return new Promise((_resolve, _reject)=>{

            if(this.state===PENDING){
                this.success_list.push(()=>{
                    const x = onFulfilled(this.value);
                    checkPromise(x, _resolve, _reject)
                });
                this.fail_list.push(()=>{
                    const x = onRejected(this.error);
                    checkPromise(x, _resolve, _reject);
                })
            }
    
    
            if(this.state===SUCCESS){
                const x = onFulfilled(this.value);
                checkPromise(x, _resolve, _reject)
            }
    
            if(this.state===FAIL){
                const x = onRejected(this.error);
                checkPromise(x, _resolve, _reject)
            }
        });

    }
}

function checkPromise(x, _resolve, _reject){
    if(x instanceof Promise){
        x.then(res=>{
            checkPromise(res)
        }, err=>{
            _reject(err);
        })
    }else{
        _resolve(x);
    }

}










const pr = new Promise(

    function(resolve, reject){
        resolve('ok');
        // setTimeout(()=>{
        //     resolve('ok');
        // },3000)
    }

);

pr.then(
    function suc(res){
        console.log(res);
        return 'hello'
    }

).then(res=>{
    console.log(res);
})