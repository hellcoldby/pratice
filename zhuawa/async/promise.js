class Promise{
    constructor(fn){
        
        this.value = null;
        this.reason = null;

        this.resolve = (value) =>{
            this.value = value;
        }   
        this.reject = (reason) =>{
            this.reason = reason;
        }
        fn(this.resolve, this.reject);
    }

    then(onFulfilled, onRejected){
        //需要先判断 onFulfilled 的类型

        return new Promise((_resolve) =>{
            const success =  onFulfilled(this.value); // 需要判断 返回值的类型，方便链式调用
            _resolve(success);
        });

    }
}

const pr = new Promise(resolve=>{
    resolve('hello');
});

pr.then(val => {
    console.log(val);
    return 'world'
}).then(val => {
    console.log(val);
})
