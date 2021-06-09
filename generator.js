//Generator 是个普通函数，有两个特征：
// 1. function 关键字与函数之间有个星号
// 2. 函数内部使用yield 表达式 （yield 的意思是 产出）

const createLogger = require("yeoman-environment/lib/util/log");


//定义：
function* ok(){  //这个函数有三个状态 hello  world  和 return
   yield 'hello';
   yield 'world';
   return 'ending';
}

//执行：
const hw = ok(); //调用ok 后并不会立即执行，返回的也不是 return的结果，而是一个内部的指针对象

//暂停：
//函数中的 yield 'hello' 表示暂停

//继续执行:  
//每次调用都返回一个value 和 done 两个属性对象, value 表示当前内部状态的值 
hw.next(); // {value: 'hello', done: false}
hw.next(); // {value: 'world', done: false}
hw.next(); // {value: 'ending', done: true}  遇到return 输出ending
hw.next(); // {value: undefined, done: true} 没有return 输出undefined

//es6没有规定 function * -- 星号写在那个位置所以  以下四种都可以
function * foo(){}
function *foo(){}
function* foo(){}
function*foo(){}



//yield 暂停：

//函数内不使用 yield, 这时就是一个单纯的暂缓执行函数
function* gen(){
    console.log('执行了');
}
const g = gen();

setTimeout(()=>{
    g.next();
}, 2000)


//注意： yield 只能用在generator 函数里面，用在其他地方都会报错

//yield 在表达式中，必须放在圆括号内
function* demo(){
    // console.log('hello' + yield); //错误
    // console.log('hello' + yield 123); // 错误

    console.log('hello' + (yield)); // ok
    console.log('hello' + (yield 123)); //ok
}

//yield 作为函数参数 或放在等号右边，可以不加括号
function* demo1(){
    foo(yield 'a', yield 'b'); //ok
    let input = yield; //ok
}


//generator 是遍历器生成函数
// 任何数据结构只要部署 Iterator 接口，就可以完成遍历操作

//Iterator:
//Iterator 的作用有三个： 1，提供一个统一的简单的访问接口 
//2. 数据结构成员按某种次序排列
//3. 可用新的遍历命令 for...of 循环
// 遍历过程：
// 1. 创建一个指针指向数据结构的起始位置，本质是个指针对象
// 2. 第一次调用对象的next方法， 指针指向数据结构的第一个成员
// 3. 第二次调用对象的next方法， 指针指向数据结构的第二个成员
// 4. 不断的调用next方法，直到它指向数据结构的结束位置。

//给一个对象添加遍历器
let obj = {};
obj[Symbol.iterator] = function* (){
    yield 1;
    yield 2;
    yield 3;
}

console.log([...obj])  // [1,2,3]

//generator 返回的就是一个遍历器对象
function* gen1(){}
const g = gen1();
g[Symbol.iterator]() === g;  // true;






// next 参数： 作为上一个yield 表达式的值
function* foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
  }
  
var b = foo(5);
b.next() // { value:6, done:false }  第一次调用b的 next 方法 返回yield --> x+1 = 6
b.next(12) // { value:8, done:false } 第二次调用，将上一次yield 改为--> 12, 上一次y= 2 * 12，这次的  yield --->24/3
b.next(13) // { value:42, done:true } z = yield 13,  5 + 24 +13 = 42
//注意： next参数表示上一个yield 表达式的返回值，所以第一次传递参数是无效的。








//throw: 在函数体外抛出错误，在函数体内捕获
let err = function* (){
    try{
        yield;
    }catch(e){
        console.log('内部捕获', e);
    }
}

let e = err();
e.next(); // 至少要执行一次 next
try{
    e.throw('a');  //函数体外抛出错误 --- 内部捕获
    e.throw('b'); // 函数体外抛出错误 --- 函数体内已经捕获完毕，所以 外部捕获
}catch(error){
    console.log('外部捕获', error);
}

//如果函数体内部 没有try...catch 代码块，那么throw 方法抛出的错误，将被
// 外部的 try...catch 代码块捕获
// 如果函数内部和外部 都没有部署 try...catch 代码块，程序将报错，直接终端执行

//也可以直接抛出Error 对象的实例
e.next()  // 至少要执行一次 next
e.throw(new Error('出错了！'));




//return : 返回给定的值，并且终结遍历 Generator 函数
function* gen(){
    yield 1;
    yield 2;
    yield 3;
}

let g = gen();
g.next();  // {value: 1, done: false}
g.return('foo'); // {value: 'foo', done: true} --- 终止遍历
g.next(); // {value: undefined, done: true}


//如果 return 方法不提供参数 则返回值的value属性为undefined
g.return(); // {value: undefined, done: true}


//如果 Generator 函数内部有try...finally代码块，且正在执行try代码块，
//那么return()方法会导致立刻进入finally代码块
function* numbers(){
    yield 1;
    try{
        yield 2;
        yield 3;
    }finally{
        yield 4;
        yield 5;
    }
    yield 6;
}

const n = numbers();
n.next(); // { value: 1, done: false }
n.next(); // { value: 2, done: false }
n.return(7); // { value: 4, done: false }
n.next(); // { value: 5, done: false }
n.next(); // { value: 7, done: true } --- 最后返回 return 里的参数

//调用return()方法后，就开始执行finally代码块，不执行try里面剩下的代码了，
//然后等到finally代码块执行完，再返回return()方法指定的返回值。