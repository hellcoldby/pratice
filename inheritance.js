/*
 * @Description: 继承
 * @Author: ygp
 * @Date: 2021-03-18 12:19:12
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-18 16:46:33
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

//2. 类型继承 --- 基于原型prototype的继承
function person (name){
    this.name = name;
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

//5. 混合继承
function MyClass() {
    SuperClass.call(this);
    OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它
// Object.assign 会把  OtherSuperClass原型上的函数拷贝到 MyClass原型上
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;