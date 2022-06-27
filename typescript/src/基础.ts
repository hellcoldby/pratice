export{};

//基础数据类型
let name:string = 'hello';
let age:number = 20;
let married:boolean = false;
let hobbies:string[] = ['singing','dancing','coding'];
let interests:Array<string> = ['singing','dancing','coding'];
let old:string | number;  //数字或字符串
old = '十二';
old = 12;



//元组 
type tuple=[string,number,boolean];
const ele:tuple = ['hello',2,true];

//枚举
enum Color0{ red,green,blue}; //0,1,2 
console.log(Color0.red, Color0[2]);
enum Color{ red='hello',green='123',blue=1}; //枚举赋值必须能够计算
console.log(Color.red, Color.blue); //不能索引
const enum Color1{ red,green,blue}; //0,1,2
console.log(Color1.red); //不能索引

//dom 类型
let div:HTMLDivElement = document.createElement('div');
div!.innerHTML = 'hello'; // 断言div一定存在 

//null undefined
let myName:string = null; // 配置文件"strictNullChecks": false ----允许null
myName = 'tom';
let yourName:string = undefined;
yourName = 'jerry'
  
//函数返回值 void --- 函数没有返回值
function test():void{
    console.log('test');
    return null; //ok
    return undefined; //ok
}

//never --- 函数永远不会结束
function error(message:string):never{
    //例如，抛出错误
    throw new Error(message);
}

function while1():never{ //never 类型的函数永远不会结束
    while(true){
        console.log('while');
    }
    console.log('end')
}


//包装对象
let name1:string = 'hello';
name1.toLocaleLowerCase(); //将name 转成小写

//断言
let name2:string| number;
(name2 as string).toLocaleLowerCase();  //name2 断言为一个字符串
(name2 as number).toFixed(2); //name2 断言为一个数字

//函数定义
function hello(name:string):void{
    console.log('hello'+name);
}

//type 定义一个类型 或者 类型别名
type GetType = (firstName:string, lastName:string) => string;

//函数表达式
let getUserName:GetType = function(firstName:string, lastName:string):string {
    return lastName + firstName;
}

//可选参数
function print(name?:string, age?:number, home?:string):void{
    console.log(name);
    console.log(age);
}

//这些都ok
print(); 
print('hello');
print('hello',18);
print('hello',18,'beijing');
print(undefined,undefined,undefined);  


//剩余参数
function sum(...numbers: Array<number>){
    return numbers.reduce((acc, item)=>acc +item, 0);
}

//函数的重载  注意：这三个定义必须写在一起
function attr(val:string):void;
function attr(val:number):void;
function attr(val:any):void{  //重载--- 注意：这三个定义必须写在一起
    if(typeof val === 'string'){
        console.log(val);
    }else if(typeof val === 'number'){
        console.log(val);
    }
}

//重载 限定类型 --- 类型必须一样 全为number 或者全为string
function sum2(a:string, b:string):void;
function sum2(a:number, b:number):void;
function sum2(a:string|number, b:string|number):void{

}
sum2('d', 'd'); 
sum2(1,1);


