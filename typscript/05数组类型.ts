//5. 数组类型
let array: Array<number> = [1, 1, 2, 3, 5]; // <>的写法叫做泛型，后边会解释泛型
let array0 : number[] = [1,2,3,5];

let array1: number[] = [1, '1', 2, 3, 5];// ❌   数组中不允许出现其他类型
array1.push('111');  // ❌  只允许传入number类型的参数

//接口定义数组
interface NumberArray {
    [index: number]: number;
}
let array2: NumberArray = [1, 1, 2, 3, 5];

//类数组---内置定义好了的类型IArguments
function sum() {
    //let args: number[] = arguments; // ❌ 不能用数组定义
    let args: IArguments = arguments;  // ✅
}
// 数组任意类型
let list: any[] = ['tom', 25, { website: 'http://xcatliu.com' }];