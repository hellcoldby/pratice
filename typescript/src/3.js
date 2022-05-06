"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
//装饰器
var a;
(function (a) {
    function enhancer(target) {
        target.prototype.xx = 'xx';
        target.prototype.yy = 'yy';
    }
    let Person = class Person {
        constructor() { }
    };
    Person = __decorate([
        enhancer
    ], Person);
    let p = new Person();
    console.log(p.xx);
    console.log(p.yy);
})(a || (a = {}));
var b;
(function (b) {
    function enhancer(target) {
        return class Child extends Person {
            constructor() {
                super(...arguments);
                this.age = 10;
            }
        };
    }
    let Person = class Person {
        constructor() {
            this.name = 'person';
        }
    };
    Person = __decorate([
        enhancer
    ], Person);
    let p = new Person();
    console.log(p.age);
})(b || (b = {}));
var c;
(function (c) {
    // 如果装饰的是个普通属性,那么target指向类的原型  person.prototype
    // 如果装饰的是一个类的属性 static, 那么这个target指向类的定义
    function upperCase(target, propertyName) {
        let value = target[propertyName];
        const getter = () => value;
        const setter = (newVal) => {
            value = newVal.toUpperCase();
        };
        // delete target[propertyName];
        //用自定义的getter setter 替换掉默认的方法
        Object.defineProperty(target, propertyName, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
    //修饰方法 有三个属性，第三个代表修饰的函数
    function methodEnumberable(flag) {
        return function (target, methodName, propertyDescriptor) {
            propertyDescriptor.enumerable = flag;
        };
    }
    //修饰方法 有三个属性，第三个代表修饰的函数
    function toNumber(target, methodName, propertyDescriptor) {
        let oldMethod = propertyDescriptor.value;
        propertyDescriptor.value = function (...args) {
            return oldMethod.apply(this, args.map(item => Number(item)));
        };
    }
    class Person {
        constructor() {
            this.name = 'hello';
        }
        getName() {
            console.log('getName');
        }
        sum(...args) {
            return args.reduce((acc, item) => acc + item, 0);
        }
    }
    __decorate([
        upperCase //修饰普通属性，只有两个属性
    ], Person.prototype, "name", void 0);
    __decorate([
        methodEnumberable(true) //修饰方法，有三个属性
    ], Person.prototype, "getName", null);
    __decorate([
        toNumber
    ], Person.prototype, "sum", null);
    let p = new Person();
    p.name = 'hello';
    for (let attr in p) {
        console.log('attr=' + attr);
    }
    console.log(p.sum(1, '2', '3'));
})(c || (c = {}));
var d;
(function (d) {
    //修饰参数
    function addAge(target, methodName, paramIndex) {
        console.log(target, methodName, paramIndex);
        target.age = 10;
    }
    class Person {
        login(username, password) {
            console.log(this.age, username, password);
        }
    }
    __decorate([
        __param(1, addAge)
    ], Person.prototype, "login", null);
})(d || (d = {}));
// 属性方法先执行， 谁先写就先执行
// 方法的时候， 先参数再方法， 
// 最后是类
