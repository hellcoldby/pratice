class Promise{
    constructor(fn){
        this.statue = 'pending'
        this.value = null;
        this.reason = null;
        this.resolve = (value)=>{
            this.value = value;
        }
        this.reject = (reason)=>{
            this.reason = reason;
        }
        fn(this.resolve, this.reject)
    }

    then(onFulfilled, onRejected){
        const onFulfilled = typeof onFulfilled === 'function'? onFulfilled : v => v;
        const onRejected = typeof onRejected === 'function'? onRejected : v=> v;

        return new Promise((_resolve, _reject)=>{
            if(this.statue === 'success'){
               const res = onFulfilled(this.value);
               checkRes(res, _resolve, _reject);
               
            }
    
            if(this.statue === 'fail'){
                const res = onRejected(this.reject);
                checkRes(res, _resolve, _reject);
            }
            
        })

    }

    static resolve (value){
        return new Promise(resolve => {
            resolve(value);
        });
    }

    static reject (reason){
        return new Promise(reject=>{
            reject(reason);
        })
    }
}


function checkRes(res, _resolve, _reject) {
    if(res instanceof Promise){
        res.then(value => {
            checkRes(value, _resolve, _reject);
        });
    }else if(typeof x === 'object'  &&  typeof x !== null || typeof x === 'function'){

        try {
            let then = x.then;
            if(typeof then === 'function'){
                then(y=>{
                    checkRes(y, _resolve, _reject);
                }, z=>{
                    _reject(z);
                })
            }
        }catch(err){
            _reject(err);
        }

       
    }else{
        _resolve(res);
    }


}
