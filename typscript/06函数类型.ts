//6. 限制函数类型
/**----------------格式：(变量：类型): 返回类型----------------------- */
function sum(x: number, y: number): number {
    return x + y;
}
sum(1, 2, 3);  // ❌ 输入多余的参数，是不被允许的
sum(1);  // ❌ 少于要求的参数，是不被允许的

/**----------------可选参数格式 变量?: 类型 ------------------------- */
function sum2(x: number, y?: number): number {
    return x + y;
}
/**----------------参数默认值 ------------------------- */
function sum3(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
/**----------------剩余参数 ------------------------- */
function sum4(x: any[], ...items: any[] ){
    let array = [];
    items.forEach(function(item) {
        array.push(item);
    });
}   
/**----------------重载 ------------------------- */
function reverse(x: number | string)  :  number | string | void {
   
    if (typeof x === 'number') {
          return Number(x.toString().split('').reverse().join(''));
      } else if (typeof x === 'string') {
          return x.split('').reverse().join('');
      }
  }

/**-----------------箭头函数格式： （变量:类型）=>返回类型 -------------------------- */
let sum7: (x: number, y: number) => number = 
        function (x: number, y: number): number {
            return x + y;
        };


