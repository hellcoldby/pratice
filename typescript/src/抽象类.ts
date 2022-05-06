//abstract 抽象类 关键词
abstract class Animal{
    name:string;
    constructor(name:string){
        this.name = name;
    }

    abstract speak():void;  //这里的方法，必须被子类实现
}

// 接口
interface Flying{
    fly():void;
}

//Bird 继承了Animal, 并实现了Flying接口
class Bird extends Animal implements Flying{
    fly(){};
    speak(){};
}

const sparrow = new Bird('麻雀');


