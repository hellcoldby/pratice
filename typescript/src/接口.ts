// implements 实现多接口
namespace a{
    interface Speakable{
        speak():void;
    }
    
    interface Eatable{
        eat():void;
    }
    
    // implements --- 可以实现多个接口
    class Person implements Speakable, Eatable{
        speak(){}
        eat(){}
    }
}

// interface 实现的任意属性
namespace b{
    interface planeA{
        [propName:string]:number
    }

    let obj:planeA = {
        x:1,
        a:2,
    }
}

// interface 接口的继承
namespace c{
    interface typeA{
        speak():void;
    }
    interface B extends typeA{
        speakChinese():void;
    }

    class Person implements B{
        speak(){};
        speakChinese(){};
    }

}