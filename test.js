// 手写promise

function myPromise(fn){

    this._value= undefined;
    this._statues = 'OPENING'; // 标记状态

    try{
        fn(this._resolve.bind(this), this._reject.bind(this));
    }catch(err){
        this._reject(err)
    }

    //成功
    this._resolve = function(val){
        this._statues = 'FULFILLED';
        this._value = val;
    }

    //失败
    this._reject = function(err){
        this._statues = 'REJECTED';
        this._value = err;
    }

    //存储then 返回的 myPromise() --- 状态为PENDING 等待执行;
    this._fulfilledQueues = [];
    this._rejectedQueues = [];
}

// 成功触发 onFulfilled , 失败触发 onRejected
myPromise.prototype.then = function(onFulfilled, onRejected){

    //返回一个promise,可以连续调用then
    return new myPromise((resolve, reject)=>{

        function await_resolve(val){
            if(typeof onFulfilled !== 'function'){
                resolve(val);
            }else{
                //如果then 返回的是个promise,就先
                let res = resolve(val);
                if(res instanceof myPromise){

                }
            }
        }

        function await_reject(val){
            if(typeof onRejected !== 'function'){
                reject(val);
            }else{

            }
        }


        switch(this._statues){
            case 'PENDING': 
                this._fulfilledQueues.push(await_resolve);
                this._rejectedQueues.push(await_reject);
                break;
            case 'FULFILLED':
                await_resolve(this._value);
                break;
            case 'REJECTED':
                await_reject(this._value);
                break;
        }
    });

}


let p1 = new Promise((resolve)=>{
	setTimeout(()=>{
		resolve( 'hahahaha' );
	}, 2000)
});

let p2 = p1.then(res =>{
	console.log(res);
    return  new Promise (res => {
        res('hello')
    });
});

p2.then(res=>{
    console.log(res);
})