import { greeting } from './utils'

greeting();
let a = 1;
let b = 2;
const c = a + b;

const fun = ()=>{return 'hello '}

class A {
    static a = 'hello'
    constructor(name){
        this.name = name;
    }
    info(age){
        console.log(this.name + age)
    }
}



const array = [1,2,3]
const newAry = Array.from(array);
console.log(newAry);