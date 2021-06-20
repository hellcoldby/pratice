/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-05-25 23:35:53
 * @LastEditors: ygp
 * @LastEditTime: 2021-06-14 22:10:35
 */
function MyPromise(fn){
    this.value = null;
    this.status = 'pending'; //等待中。。。
    fn(this.resolve.bind(this), this.reject.bind(this));
    this._fulfilledQueues = []
    this._rejectedQueues = []
}

MyPromise.prototype.resolve = function(val){
  const run = ()=>{
      if(this.status !== 'pending') return;

      this.status = 'fulfilled'; 
      const runSuccess = (val)=>{
        let cb;
        while(cb = this._fulfilledQueues.shift()){
          cb(val)
        }
      }

      const runErr = (err)=>{
        let cb;
        while(cb = this._rejectedQueues.shift()){
          cb(err)
        }
      }

      //如果val 是promise对象，需要先执行promise，等状态变化后，再执行队列中的promise
      if(val instanceof MyPromise){
        val.then(res => {
          this.value = res;
          runSuccess(res);
        }, err=>{
          this.value = err;
          runErr(err);
        })
      }else{
        this.value = val;
        runSuccess(val);
      }
  }

  setTimeout(()=> run(), 0);
};

MyPromise.prototype.reject = function(err){
  if(this.status !== 'pending') return;

  const run =()=>{
    this.status = 'fulfilled';
    this.value = err;
    let cb;
    while(cb = this._rejectedQueues.shift()){
      cb(err);
    }
  }

  setTimeout(()=> run(), 0);
};

MyPromise.prototype.then = function(onFulfilled, onRejected){

  const {value:_value, status:_status} = this;

  return new MyPromise((nextResolve, nextRejected) => {

    let checkFulfilled = function(_value){

      try{

        //如果不是函数,继续传递_value
        if(typeof onFulfilled !== 'function'){ 
           nextResolve(_value);
        }else{
          //如果个promise 就放进队列
          const res = onFulfilled(_value);
          if(res instanceof MyPromise){
            res.then(nextResolve, nextRejected);
          }else{
            nextResolve(res);
          }
        }
      }catch(err){
        onRejected(err);
      }
    }

    let checkRejected = function(_value){
      try{

        if(typeof onRejected !== 'function'){ 
          nextRejected(_value);
        }else{
          //如果个promise 就放进队列
          const res = nextResolve(_value);
          if(res instanceof MyPromise){
            res.then(nextResolve, nextRejected);
          }else{
            nextRejected(res);
          }
        }
      }catch(err){
        onRejected(err);
      }
    }

    switch(this.status){
      case 'pending':
        this._fulfilledQueues.push(onFulfilled);
        this._rejectedQueues.push(onRejected);
        break;
      case 'fulfilled':
          //判断onFulfilled的类型
          checkFulfilled(_value);
        break;
      case 'rejected':
          //判断onRejected的类型
          checkRejected(_value);
        break;
    }
  });
  
}

MyPromise.prototype.catch = function(onRejected){
  return this.then(undefined, onRejected);
}

MyPromise.resolve = function(value){
  if(value instanceof MyPromise) return value;
  return new MyPromise(resolve => resolve(value));
}

MyPromise.reject = function(value){
  return new MyPromise((resolve, rejected)=> rejected(value));
}

MyPromise.all = function(list){
  return new MyPromise((resolve, reject) => {
    // 返回值的集合
    let values = [];
    let count = 0;
    for(let [i, p] of list.entries()){
      //如果参数不是MyPromise 实例，先调用MyPromise.resolve
      this.resolve(p).then(res => {
        values[i] = res;
        count++;
        if(count === list.length) resolve(values);
      }, err =>{
        reject(err);
      })
    }
  })
}


//只要有一个实例改变状态，新的promise就跟着改变
MyPromise.race = function(list) {
  return new MyPromise((resolve, reject) => {
    for(let p of list){
      this.resolve(p).then(res=>{
        resolve(res);
      },err=>{
        reject(err);
      })
    }
  })
}

//不管MyPromise 状态如何，都会执行的操作
MyPromise.finally = function(cb){
  return this.then(
    value => MyPromise.resolve(cb()).then(()=> value),
    reason => MyPromise.resolve(cb()).then(()=> { throw reason })
  )
}

new MyPromise((res, rej) =>{
  res('ok');
}).then(res=>{
  console.log(res);
})









