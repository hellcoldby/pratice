//装饰器
namespace a{
    interface Person{
        xx:string;
        yy: string;
    }
    function enhancer(target: any){
        target.prototype.xx = 'xx';
        target.prototype.yy = 'yy';
    }


    @enhancer 
    class Person {
        constructor() {}
    }
    let p = new Person();
    console.log(p.xx);
    console.log(p.yy);
}

namespace b{
    interface Person{
        age:number;
    }
    function enhancer(target: any){ //装饰器 替换掉Person,返回的格式要和 Person 相同
        return class Child extends Person{
            public age: number = 10;
        }
    }


    @enhancer 
    class Person {
        public name:string = 'person';
        constructor() {}
    }
    let p = new Person();
    console.log(p.age); 
}

namespace c{
    // 如果装饰的是个普通属性,那么target指向类的原型  person.prototype
    // 如果装饰的是一个类的属性 static, 那么这个target指向类的定义

    function upperCase(target:any, propertyName: string){
        let value = target[propertyName];
        const getter = ()=> value;
        const setter = (newVal: string) =>{
            value = newVal.toUpperCase();
        }
        // delete target[propertyName];

        //用自定义的getter setter 替换掉默认的方法
        Object.defineProperty(target, propertyName, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        })
    }

 
    //修饰方法 有三个属性，第三个代表修饰的函数
    function methodEnumberable(flag:boolean){
        return function(target:any, methodName: string, propertyDescriptor: PropertyDescriptor){
            propertyDescriptor.enumerable = flag;
        }
    }
   //修饰方法 有三个属性，第三个代表修饰的函数
    function toNumber(target:any, methodName: string, propertyDescriptor: PropertyDescriptor){
        let oldMethod = propertyDescriptor.value;
        propertyDescriptor.value = function(...args: any[]){
            return oldMethod.apply(this, args.map(item => Number(item)));
        }
    }

    class Person {
        @upperCase  //修饰普通属性，只有两个属性
      
        name: string = 'hello';
        @methodEnumberable(true) //修饰方法，有三个属性
        getName(){
            console.log('getName');
        }
        @toNumber
        sum(...args:any[]){
            return args.reduce((acc, item)=> acc + item, 0)
        }

    }
 
    let p = new Person();
    p.name = 'hello';
   
    for(let attr in p){
        console.log('attr=' + attr);
    }

    console.log(p.sum(1, '2', '3'))



}

namespace d{
    //修饰参数
    function addAge(target:any, methodName: string, paramIndex: number){
        console.log(target, methodName, paramIndex);
        target.age = 10;
    }

    interface Person{
        age: number;
    }

    class Person {
        login(username:string, @addAge password:string){
            console.log(this.age, username, password);
        }
    }
}

// 属性方法先执行， 谁先写就先执行
// 方法的时候， 先参数再方法， 
// 最后是类
