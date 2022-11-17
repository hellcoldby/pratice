/**
 * 数组拉平
 */


//1. 递归判读长度
const arr1 = [1, 2, [11, 22, 33], [111, [1111, 2222]]];
function flat1(arr){
    let tmp = [];
    for(let i=0; i<arr.length; i++){
        if(arr[i] instanceof Array){
            tmp = tmp.concat(flat1(arr[i]))
        }else{
            tmp.push(arr[i]);
        }
    }
    return tmp;
}

console.log('flat1: ', flat1(arr1));

//2. toString()
const arr2 = [1, 2, [11, 22, 33], [111, [1111, 2222]]];
function flat2(arr){
    return arr.toString().split(',').map(val=> parseInt(val))
}
console.log('flat2: ', flat2(arr2));

//3. flat()
const arr3 = [1, 2, [11, 22, 33], [111, [1111, 2222]]];
function flat3(arr){
    return arr.flat(2);
}
console.log('flat3: ', flat3(arr3));