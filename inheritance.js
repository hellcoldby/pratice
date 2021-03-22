/*
 * @Description: 继承
 * @Author: ygp
 * @Date: 2021-03-18 12:19:12
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-22 10:33:05
 */

// 先对比一下 new  和 继承的 核心思路

/**
 *  1. new --- 当前函数
 *  - 1.1 创建空对象
 *  - 1.2 当前函数this 指向空对象
 *  - 1.3 空对象挂载当前函数的所有扩展方法
 * 
 * 
 *  2. 继承 --- 当前函数
 *  - 2.1 创建子函数
 *  - 2.2 当前函数的this 指向子函数
 *  - 2.3 子函数挂载当前函数所有的扩展方法
 */

// 对比之后你会发现：new 和 继承 的思路是一样的
// 不同之处在于，
// new 是内部函数内部创建一个空对象返回一个新对象，  
// 继承是你自己创建的函数，复用父级函数的属性方法


/** 
 * 继承有两类： 对象继承 类型继承
 */




//1. 对象继承 --- 用Object.create();
let person = {name: 'jack'}
// 相当于 p1.prototype = person.prototype
let p1 = Object.create(person);



//2. 类型继承 
// 2.1 组合继承 = 原型式继承 + call 继承
function person (name){
    this.name = name;
    this.color = ['red', 'blue'];
}

function Student(name){
    person.call(this, name, age); //通过call  来改变this 指向
}
Student.prototype = new person(); //改变Student 的身份信息为 Person


//3. 继承封装
function inherit(Child, Parent){
    const Tmpfn = function(){};
    Tmpfn.prototype = Parent.prototype;
    Child.prototype = new Tmpfn();
    Child.prototype.constructor = Child;  // 修改身份 ，不该也不影响使用
}

//4. 无脑拷贝父级的所有属性
function extend(parent, child) {
    var i;
    child = child || {};
    for(i in parent) {
        if(parent.hasOwnProperty(i)) {
            child[i] = parent[i];
        }
    }
    return child;
}


//5. 最成熟的继承方案  这是最成熟的方法，也是现在库实现的方法
function inheritPrototype(child, parent){
    let pro = Object.create(parent.prototype);
    //相当于
    // let tmp = function () {};
    // tmp.prototype = parent.prototype;
    // tmp.prototype.constructor = tmp;
    pro.constructor = child;
    child.prototype = pro;
}


//6. 混合继承 ---- MDN 文档中提供的方法
function MyClass() {
    SuperClass.call(this);
    OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它
// Object.assign 会把  OtherSuperClass原型上的函数拷贝到 MyClass原型上
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
MyClass.prototype.constructor = MyClass;

//7. Es6 类继承
// 用 class 关键字 表示类（一个构造函数）
// 用 constructor 表示构造函数 this 属性 方法的定义 （一个class只能有一个constructor）

class A {
    constructor(name, age){
        this.name = name;
        this.age = age;
    }

    say(){
        return this.name;
    }
}

//继承 ----  es6 中的继承 和 寄生组合继承的方式是一样的
class B extends A {
    constructor(name, age){
        super(name, age);
        
    }

    toA(){
        return this.name + this.age + ''
    }
}

// 声明 class 类， 需要先声明 再使用，函数声明会提升， 类不会


function inheritPrototype(child, parent){
    child.prototype = Object.create(parent && parent.prototype, {
        constructor: {
            value: subType,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    if(child){
        Object.setPrototypeOf 
        ? Object.setPrototypeOf(child, parent) 
        : child.__proto__ = parent;
    }
}