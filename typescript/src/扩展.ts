namespace a{
    type E = Exclude<string | number , string>; //从前者中排除后者
    type F = Extract<string | number , string>; //从前者中提取后者

    let e:E = 10;
    let f:F = '10';

    type G = NonNullable<string | number | null | undefined>; //排除null和undefined
    let g:G = 10;
    let g1:G = '10';


    function getUserInfo(){
        return {name:'hello', age:10}
    }
    //定义返回值类型
    type H = ReturnType<typeof getUserInfo>; 



    //InstanceType 获取构造函数的实例类型
    class Person {
        name:string;
        constructor(name:string){
            this.name = name;
        }
    }

    type P = InstanceType<typeof Person>;
    let p:P = new Person('hello');
}

