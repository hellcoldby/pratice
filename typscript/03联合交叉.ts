/**-----------------------联合类型------------------------------ */
let age:string | number;  //数字 或 字符串
age = '十二';
age = 12;


interface A {
    name: string;
}

interface B {
    sex: number;
}

function test(a: A | B) {}

test({sex:666}); //✅
test({name:'xxx'});//✅
test({ sex: 0, name:'sss' });//✅
test({ sex: 0, name:'sss', other:234 });  //error ❌


/**-----------------------交叉类型------------------------------ */
interface A {
    name: string;
}
interface B {
    sex: number;
}

function test1(a: A & B){};

test1({ sex: 666 }); //error ❌
test1({ name: "xxx" });  //error ❌

test1({sex:666, name: 'hhh'})   // ✅