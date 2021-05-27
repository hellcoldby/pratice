/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-05-25 23:35:53
 * @LastEditors: ygp
 * @LastEditTime: 2021-05-28 01:26:02
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

  return new MyPromise((nextResolve, nextRejected) => {
    switch(this.status){
      case 'pending':
        break;
      case 'fulfilled':
        onFulfilled(this.value);
        break;
      case 'rejected':
        onRejected(this.value);
        break;
    }
  });
  
}


new MyPromise((res, rej) =>{
  res('ok');
}).then(res => {
  console.log(res);
})









