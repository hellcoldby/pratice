//命名空间a
namespace a{
    class Person{
        name:string = 'hello';
        age: number = 18;
    }
    
    let p1 = new Person();
    // console.log(p1.name);
    // console.log(p1.age);
}

//存取器 getter setter
//命名空间b
namespace b{
    class Person{
        customName:string;
       constructor(value:string){
           this.customName = value;
       }
       get name(){
              return this.customName;
       }
       set name(val:string){
         this.customName = val.toUpperCase();
       }
    }
    
    let p1 = new Person('tom');
    console.log(p1.name);
    p1.name = 'jack';
    console.log(p1.customName);
}


//继承 和 访问修饰符
/**
 * public  自己和自己的子类可以访问
 * protected  自己和自己的子类可以访问，其他类能访问
 * private  私有的 只能自己访问， 子类和其他类都不能访问
 */
namespace c{
    class Person{
        public name:string;
        protected age:number;
        private amount:number;
        constructor(name:string,age:number){
            this.name = name;
            this.age = age;
            this.amount = 100;
        }

        getName(){
            return this.name;
        }

        setName(name:string){
            this.name = name;
        }
    }


    class Student extends Person{
        static type = 'student';
        s_num:number;
        constructor(name:string,age:number,s_num:number){
            super(name, age);
            this.s_num = s_num;
        }

        getStuNum(){
            // return this.s_num + this.age + this.amount
        }
        setStuNum(s_num:number){
            this.s_num = s_num;
        }
    }
} 

