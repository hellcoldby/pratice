/*
 * @Description: 继承
 * @Author: ygp
 * @Date: 2021-03-18 12:19:12
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-18 14:40:08
 */

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