/**
 * async 是什么？
 * 它是generator 函数的语法糖
 */

const gen = function* (){
    const f1 = yield readFile('/etc/fstab');
    const f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
}

const asyncRead = async function(){
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
}

/**
 * 对比发现： 
 * async 将 generator 函数的星号(*) 替换成 async, 将 yield 替换成 await 仅此而已。
 * 
 * async 的改进体现在以下四点：
 * 1. 内置执行器
 *      -- generator 必须靠执行器执行， 所以才有了co模块， 而async自带执行器。
 * 2. 更好的语义
 *      -- async 和 await, 比起星号和yield, 语义更清楚了。
 * 3. 更广的适用性
 *      -- co模块约定，yield 命令后面只能是Thunk 函数和Promise 对象，
 *      -- async 函数的await 命令后面，可以是Promise 对象和 原始类型的值（数值、字符串和布尔值，但会自动转换成 Promise.resolved()对象）
 * 4. 返回值是Promise
 *      -- async的返回值是Promise对象，这比Generator 函数的返回值是Iterator 对象方便多了。 你可以用then 方法指定下一步的造成。
 */




//多种使用形式
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then();

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then( );

// 箭头函数
const foo = async () => {};








/**
 * async 函数内部返回的是一个 promise 对象
 */
async function f(){
    return 'hello world';
}

//res是 async 的返回值
f().then(res => console.log(res));


/**
 * async 内部抛出错误 会导致Promise 对象变成 reject 状态
 * 抛出的错误对象被catch 方法回到函数接收
 */

async function f(){
  throw new Error('出错了');
}

f().then(
  v => console.log('resolve', v),
  e => console.log('reject', e)
)
// reject Error: 出错了


/**
 * async 返回Promise 对象， 必须等内部所有await 命令后的 Promise 对象执行完，才会发生状态改变
 * 除非遇到 return 语句或者抛出错误。
 * 也就是说只有async 内部的异步操作执行完毕，才会执行then 
 */
 async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}
getTitle('https://tc39.github.io/ecma262/').then(console.log)
// "ECMAScript 2017 Language Specification"






/**
 * await 命令
 * 
 * await 命令后面是个Promise 对象，返回该对象的结果。
 * 如果不是Promise 对象，就返回对应的值
 */

async function f(){
  return await 123;
}
f().then(v => console.log(v)) //123






/**
 * 第二个await语句是不会执行的，因为第一个await语句状态变成了reject。
 */

 async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}

/**
 * 我们希望即使前一个异步操作失败，也不要中断后面的异步操作
 * 第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行。
 */

 async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world

/**
 * 另一种方法是await后面的 Promise 对象再跟一个catch方法，处理前面可能出现的错误。
 */
 async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world