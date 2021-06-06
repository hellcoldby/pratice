/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-05-25 23:35:53
 * @LastEditors: ygp
 * @LastEditTime: 2021-06-07 07:44:08
 */


function MyPromise(fn){
    this.value = null;
    this.status = 'pending'; //等待中。。。
    fn(this.resolve.bind(this), this.reject.bind(this));
}

MyPromise.prototype.resolve = function(val){
  this.status = 'fulfilled'; //完成
  this.value = val;
};
MyPromise.prototype.reject = function(err){
  this.status = 'rejected'; //失败
  this.value = err;
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


new MyPromise((res, rej) =>{
  res('ok');
}).then(res=>{
  console.log(res);
})









