
class MyPromise{
    constructor(fn){
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.fulfilled_ary = [];
        this.rejected_ary = [];

        const resolve = (value)=>{
            if(this.state === 'pending'){
                this.state = 'fulfilled';
                this.value = value;
                this.fulfilled_ary.forEach(fn=>fn());
            }
        }

        const reject = (reason) =>{
            if(this.state === 'pending'){
                this.state = 'rejected';
                this.reason = reason;
                this.rejected_ary.forEach(fn=>fn());
            }
        }

        fn(resolve, reject);
    }

    then(onFulfilled, onRejected){

        if(this.state === 'pending'){
            this.fulfilled_ary.push(()=>{
                onFulfilled(this.value);
            });
            this.rejected_ary.push(()=>{
                onRejected(this.value);
            })
            
        }

        if(this.state === 'fulfilled'){
                onFulfilled(this.value);
        }

        if(this.state === 'rejected'){
                onRejected(this.reason);
        }
    }
}


const p = new MyPromise((resolve, reject)=>{
    // setTimeout(()=>{
        resolve(123);
    // },1000)
    reject('err');
});

p.then((res)=>{
    console.log(res);
    return 123;
})