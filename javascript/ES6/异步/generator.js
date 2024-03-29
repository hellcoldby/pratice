//Generator 是个普通函数，有两个特征：
// 1. function 关键字与函数之间有个星号
// 2. 函数内部使用yield 表达式 （yield 的意思是 产出）



//定义：
function* ok(){  //这个函数有三个状态 hello  world  和 ending
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
function* foo(){} // 默认用这种
function*foo(){}



//yield 暂停：
//函数内不使用 yield, 这时就是一个单纯的暂缓执行函数
function* gen(){
    console.log('执行了');
}
const g1 = gen();

setTimeout(()=>{
    g1.next();
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
const g2 = gen1();
g2[Symbol.iterator]() === g2;  // true;






// next 参数： 作为上一个yield 表达式的值
  function* foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
  }
  
var b = foo(5);

console.log(b.next()); // next 执行yield()--- 6, 并没有赋值操作
console.log(b.next(15)); // y赋值为 2 * 15 = 30, yield 结果为30/3 = 10, 
console.log(b.next(13));//  z赋值为13，  5+30+13 = 48




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

let g3 = gen();
g3.next();  // {value: 1, done: false}
g3.return('foo'); // {value: 'foo', done: true} --- 终止遍历
g3.next(); // {value: undefined, done: true}


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






// next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。
//next()是将yield表达式替换成一个值。
//throw()是将yield表达式替换成一个throw语句。
//return()是将yield表达式替换成一个return语句。


//generator 嵌套
// generator 内如的 generator 需要手动遍历

function* bar() {
    yield 'x';
    for (let v of foo()) {
      yield v;
    }
    yield 'y';
  }
  
  for (let v of bar()){
    console.log(v);
  }

// yield*
// yield*  表达式
// es6 提供了 yield* 表达式，用来执行另一个函数 (就不用手动遍历了)
function* bar() {
    yield 'x';
    yield* foo();
    yield 'y';
  }
// yield* 后边跟一个数组 返回数组的遍历器对象
function* gen(){
    yield* ["a", "b", "c"];
  }
  
// 实际上，任何数据结构只要有 Iterator 接口，就可以被yield*遍历
gen().next() // { value:"a", done:false } 





//generator 作为对象属性
let obj = {
    * myGeneratorMethod() {
      
    }
  }
//等价
  let obj = {
    myGeneratorMethod: function* () {
      // ···
    }
  };

const { fstat } = require('fs');
  /**==================generator 异步应用==================================== */

  //异步请求数据
  let fetch = require('node-fetch');
  function* gen(){
    let url = 'http://api.github.com/user/github';
    let result = yield fetch(url);
    console.log(result.bio);
  }

  //获取数据
  let g = gen();
  let result = g.next();
  //处理数据
  result.value.then(function(data){
    return data.json();
  }).then(function(data){
    g.next(data);
  })







//Thunk 函数 : 自动执行 Generator 函数的一种方法
/**
 * thunk -- 直译：数据转换
 * 函数参数的 “求职策略”
 * 函数的参数 该何时求值
 * 
 * 
 */

let x = 1;
function f(m){ return m * 2 };

f(x + 5);

//1. 传值调用，在进入函数体之前先 计算 x+5 = 6; c语言就是采用这种策略
// 传值调用先计算
//2. 传名调用，将x+5 传入函数体，用到它的时候再求值； Haskell 就是这种策略  （x+5) * 2

//Thunk函数的实现----- 采用2. 传名调用的方式

const thunk = function(){ return x + 5; };
function f(thunk) {
  return thunk() * 2;
}


/**
 * JS 中采用的是传值调用，和Thunk含义有所不同。
 */
//例如：
//多参数版本 
 fs.readFile(fileName, callback);

 //单参数版本
 const Thunk1 = function(fileName) {
   return function (callback) {
     return fs.readFile(fileName, callback);
   }
 }

 //Thunk 就是
 const rThunk = Thunk(fileName);
 rThunk(callback);


 // 任何函数，只要参数有回调函数，就能写成Thunk 函数的形式。 
 //Thunk 函数转换器
 const Thunk2 = function(fn) {
   return function () {
     const args = Array.prototype.slice.call(arguments);
     return function (callback) {
       args.push(callback);
       return fn.apply(this, args);
     }
   }
 }

 //es6 版本
 const Thunk3 = function(fn){
   return function(...args){
     return function(callback) {
       return fn.call(this, ...args, callback);
     }
   }
 }


 //co 模块自动执行generator 的thunk 模块
 function co(gen){
  let it = gen();
  let res;
  function next(args){
    res = it.next(args);
    if(!res.done){
      next(res.value)
    }
  }
  next();
 };

 co(ok)