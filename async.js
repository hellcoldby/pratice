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
 * async 的改进
 * 
 */

