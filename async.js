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

