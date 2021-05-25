/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-05-25 23:35:53
 * @LastEditors: ygp
 * @LastEditTime: 2021-05-26 00:37:35
 */


function MyPromise(fn){
    fn(this.resolve.bind(this), this.reject.bind(this));
}

MyPromise.prototype.resolve = function(val){
  console.log(val);
};
MyPromise.prototype.reject = function(err){
  console.log(err);
};
MyPromise.prototype.then = function(_val){
  return new Promise((_res, _rej)=>{

  })
}


new MyPromise((res, rej) =>{
  res('ok');
})









