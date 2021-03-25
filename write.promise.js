/**
 * promise
 */

new Promise((resolve, reject)=>{


	resolve('success');  //执行成功的函数,--- then 的参数就是resolve 返回的值


}).then(res=>{
	console.log(res); 
}).catch(()=>{});


new Promise((resolve, reject)=>{


	reject('error'); //执行失败的函数，--- catch的参数就是reject 返回的值


}).then(res=>{
	console.log(res);
}).catch(err=>{
	console.log(err);
});