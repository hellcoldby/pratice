
function MyPromise(fn){
    this.value = null;
    this.state = 'pending';
    this.suc_list = [];
    //如果成功
    function resolve (value){ 
        this.state = 'success'
        this.value = value;
        this.suc_list.forEach(fn => {
            fn();
        });
    }
    //如果失败
    function reject(reason) {
        this.state = 'fail'
        this.value = reason;
    }
    fn(resolve.bind(this), reject.bind(this));
}

MyPromise.prototype.then = function(onFulfilled, onRejected){
    return new MyPromise((_resolve, _reject)=>{
        //发布订阅 异步任务
        if(this.state === 'pending'){
            this.suc_list.push(()=>{ const x = onFulfilled(this.value); _resolve(x)});
        }
    
        //如果成功
        if(this.state === 'success'){
            const x = onFulfilled(this.value);
            _resolve(x)
        }
        //如果失败
        if(this.state === 'fail'){
           const x =  onRejected(this.reason);
           _reject(x)
        }
    })
}





const p =  new MyPromise((resolve, reject)=>{
    setTimeout(()=>{
        resolve('hello');
    },2000)
}).then(res=>{console.log(res); return 3}).then(res=>{
    console.log(res)
})
