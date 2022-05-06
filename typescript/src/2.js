"use strict";
//命名空间a
var a;
(function (a) {
    class Person {
        constructor() {
            this.name = 'hello';
            this.age = 18;
        }
    }
    let p1 = new Person();
    // console.log(p1.name);
    // console.log(p1.age);
})(a || (a = {}));
//存取器 getter setter
//命名空间b
var b;
(function (b) {
    class Person {
        constructor(value) {
            this.customName = value;
        }
        get name() {
            return this.customName;
        }
        set name(val) {
            this.customName = val.toUpperCase();
        }
    }
    let p1 = new Person('tom');
    console.log(p1.name);
    p1.name = 'jack';
    console.log(p1.customName);
})(b || (b = {}));
//继承 和 访问修饰符
/**
 * public  自己和自己的子类可以访问
 * protected  自己和自己的子类可以访问，其他类能访问
 * private  私有的 只能自己访问， 子类和其他类都不能访问
 */
var c;
(function (c) {
    class Person {
        constructor(name, age) {
            this.name = name;
            this.age = age;
            this.amount = 100;
        }
        getName() {
            return this.name;
        }
        setName(name) {
            this.name = name;
        }
    }
    class Student extends Person {
        constructor(name, age, s_num) {
            super(name, age);
            this.s_num = s_num;
        }
        getStuNum() {
            // return this.s_num + this.age + this.amount
        }
        setStuNum(s_num) {
            this.s_num = s_num;
        }
    }
    Student.type = 'student';
})(c || (c = {}));
