class Promise{
    constructor(fn){
        
        this.value = null;
        this.reason = null;

        this.status = 'pending';



        this.resolve = value =>{
            this.status = 'success';
            this.value = value;
        }

        this.reject = reason =>{
            this.status = 'failed';
            this.reason = reason;
        }

        fn(this.resolve, this.reject);
    }

    then(onFulfilled, onRejected){
        
        onFulfilled = typeof onFulfilled === 'function'? onFulfilled: v=> v;

        return new Promise((resolve, reject)=>{
            if(this.status === 'success'){
               const res =  onFulfilled(this.value);
               resolve(res)
            }

            if(this.status === 'failed'){
                const res = onRejected(this.reason);
                reject(res);
            }
            
        })
    }
}
