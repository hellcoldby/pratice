//2. 任意类型
let b1;
let b2:any;
b2 = 123;  // let b2:any = 123;
b2 = 'tom'; // let b2:any = tom;
b2 = true; // let b2:any = true;

//允许访问任意属性
console.log(b1.max); //✅   
console.log(b1.max.length); //✅
//允许调用任意方法
b1.max(21); //✅


//类型推导
let c1 = 7;
c1 = 'tom'; //默认推导c1是number类型
