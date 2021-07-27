/**
 * es6 引入了 for...of 循环，作为遍历 具有 Iterator 接口的统一方法
 * 
 * 一个数据结构 只要部署了 Symbol.iterator 属性， 就被视为具有 iterator 接口
 * 例如： 数组 Set Map 类数组的对象
 */

function* foo(){
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

// for...of 循环自动遍历 Generator 函数运行时生成的 Iterator 对象，
// 切 不需要调用next 方法
for(let v of foo){  
    console.log(v); //1 2 3 4 5
}
//注意： next返回的对象 done 属性为true ， for...of循环就会终止，所以 return 6 不包含在循环之中


//为一个对象添加 遍历器属性：方法1
function* objectEntries(obj) {
    let propKeys = Reflect.ownKeys(obj);
  
    for (let propKey of propKeys) {
      yield [propKey, obj[propKey]];
    }
}

//为一个对象添加 遍历器属性：方法2
function* objectEntries() {
    let propKeys = Object.keys(this);
  
    for (let propKey of propKeys) {
      yield [propKey, this[propKey]];
    }
  }
  
  let jane = { first: 'Jane', last: 'Doe' };
  
  jane[Symbol.iterator] = objectEntries;

  //除了for...of循环以外，扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口。
  //这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。


  
  function* numbers () {
    yield 1
    yield 2
    return 3
    yield 4
  }
  
  // 扩展运算符
  [...numbers()] // [1, 2]
  
  // Array.from 方法
  Array.from(numbers()) // [1, 2]
  
  // 解构赋值
  let [x, y] = numbers();
  x // 1
  y // 2
  
  // for...of 循环
  for (let n of numbers()) {
    console.log(n)
  }
  // 1
  // 2