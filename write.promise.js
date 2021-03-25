/*
 * @Description: promise
 * @Author: ygp
 * @Date: 2021-03-25 13:07:25
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-25 13:12:09
 */

// 先看示例
/**	--------------------start-------------------------------------------- */
new Promise((resolve, reject) => {
	resolve('success');  //执行成功的函数,--- then 的参数就是resolve 返回的值
}).then(res => {
	console.log(res);
}).catch(() => { });


new Promise((resolve, reject) => {
	reject('error'); //执行失败的函数，--- catch的参数就是reject 返回的值
}).then(res => {
	console.log(res);
}).catch(err => {
	console.log(err);
});
/**	----------------------end------------------------------------------ */


//静态方法
/**	--------------------start-------------------------------------------- */
Promise.resolve('success').then(res => {
	console.log(res); // 打印success
});

Promise.reject('error').then(res => {
	console.log(res);
}).catch(err => {
	console.log(err);
})
/**	----------------------end------------------------------------------ */


//多个promise
/**	--------------------start-------------------------------------------- */
const p1 = new Promise((resolve, reject) => {
	resolve(1);
});
const p2 = new Promise((resolve, reject) => {
	resolve(2);
});
const p3 = new Promise((resolve, reject) => {
	resolve(3);
});


Promise.all([p1, p2, p3]).then(res => {
	console.log(res);
}, err => {
	console.log(err);
});
/**	----------------------end------------------------------------------ */

//多个中有一个正常执行
/**	--------------------start-------------------------------------------- */
Promise.race([p1, p2, p3]).then(res => {
	console.log(res);
}, err => {
	console.log(err);
});
/**	----------------------end------------------------------------------ */




//解析
// Promise 接收两个函数参数 resolve 和 reject 
// Promise 有三种状态： pending, fulfilled, reject, 初始状态为pending
// 调用 resolve 状态由 pending ---》fulfilled
// 调用 reject  状态由 pending ---》 rejected
// 改变之后不会变化

//then 接收两个参数 onFulfilled 和 onRejected 函数 --- 不是函数 必须被忽略
// onFulfilled --- 状态成功调用 只能调用一次
// onRejected --- 状态失败调用 只能调用一次
// then 可以链式调用    
// 1. 每次返回   如果不是Promise 就作为下一个Promise参数
// 2. 每次返回  如果是Promise 会等 Promise 执行

let pr1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve();
	}, 1000);
});

//1. 返回普通值
let pr2 = pr1.then(res => {
	return '返回一个普通值'
});

pr2.then(res => {
	console.log(res); // 打印这是一个普通值
})

//2. 返回一个Promise
pr2 = p1.then(res => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('返回一个Promise')
		}, 2000)
	});
});
pr2.then(res => {
	console.log(res); // 3秒钟后打印， 返回一个Promise
})

// 如果pr1.then 抛出异常,p2 必须变成失败
// 如果pr1.then 没有参数, p2必须变为成功，忽略pr1.then(),返回pr1的值,



//自定义done
// Promise 不管then 还是 catch 方法结尾，最后一个方法抛出错误，都有可能
// 无法捕捉到 （promise 内部的错误不会冒泡到全局）
// 定义一个 done 方法 放在回调函数的尾端，保证抛出任何可能的出现的错误

Promise.prototype.done = function (onFulfilled, onRejected) {
	this.then(nFulfilled, onRejected)
		.catch(function (res) {
			setTimeout(() => {
				throw res;
			}, 0)
		})
}

//finally方法用于指定不管Promise对象最后状态如何，都会执行的操作
Promise.prototype.finally = function (callback) {
	let P = this.constructor
	return this.then(
		value => P.resolve(callback()).then(() => value),
		reason => P.resolve(callback()).then(() => {
			throw reason
		})
	)
}
