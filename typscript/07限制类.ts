/**
 * 三种修饰符
 * Public   公有  默认所有的属性和方法都是 public
 * Private  私有 只能在当前类内部调用
 * Protected  受保护的  只能在自身和子类内部访问
 */
class Animal {
    private age;
    protected name;
    public constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

class Cat extends Animal {
    constructor(name, age) {
        super(name, age);
        console.log(this.name);
        // console.log(this.age); //❌ 只能在 Animal中访问
    }
}

//给类 增加类型
class Animal1 {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): string {
        return `My name is ${this.name}`;
    }
}
