new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve( {} )
    },2000)
}).then(res=>{
    console.log(res);
    // return new Promise(res=>{res(123)})
    return 456;
}).then(res=>{
    console.log(res);
})

const PENDING = 'pending';
const SUCCESS = 'success';
const FAIL = 'fail';

function checkPromise(value, resolve, reject){
    if(value instanceof Promise){
        value.then(res=>{
            checkPromise(res);
        }, err =>{
            reject(err);
        })
    }else{
        resolve(value);
    }
}

class _Promise{
    constructor(fn){
        this.value = null;
        this.state = PENDING;
        this.success_list = [];
        this.fail_list = [];
        const resolve = (value)=>{
            if(this.state === PENDING){
                this.state = SUCCESS;
                this.value = value;
                this.success_list.forEach(fn=>fn());
            }
        }
        const reject = (err)=>{
            if(this.state === PENDING){
                this.state = FAIL;
                this.value = err;
                this.fail_list.forEach(fn=>fn());
            }
        }

        try{
            fn(resolve, reject);
        }catch(err){
            reject(err)
        }
    }

    then(onFulfilled, onRejected){
        return new _Promise((_resolve, _reject)=>{
            if(this.state === PENDING){
                this.success_list.push(()=>{
                   const x = onFulfilled(this.value);
                   checkPromise(x, _resolve, _reject);
                });
                this.fail_list.push(()=>{
                   const x = onRejected(this.value);
                   checkPromise(x, _resolve, _reject);
                })
            }
    
            if(this.state === SUCCESS){
               const x= onFulfilled(this.value);
               checkPromise(x, _resolve, _reject);
            }
            if(this.state === FAIL){
               const x = onRejected(this.value)
               checkPromise(x, _resolve, _reject);
            }
        })

    }
}

_Promise.resolve = (value)=>{
    return new _Promise((res)=>{
        res(value)
    });
}

_Promise.all = (array)=>{
    if(!array[Symbol.iterator]){
        return new TypeError(`TypeError ${array} is not iterator`);
    } 
    const newArray = [];
    const length = array.length;
    const num = 0;
    return new _Promise((resolve, reject)=>{
        for(let key in array){
            _Promise.resolve(array[key]).then(res=>{
                if(++num === length){
                    return newArray;
                }
                newArray.push(res);
            },err=>{
                reject(err)
            });
        }

    })

}
