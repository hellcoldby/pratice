/**
 * 排序算法
 */

let arr = [4,7, 2, 3,5,1,6,8];

//1. 冒泡排序 --- 每个元素都从头到尾对比一遍，遇到比自己小的就交换位置 复杂度： O(n^2);
function bubbleSort(arr){
    for(let i=0; i<arr.length; i++){
        for(let j=0; j<arr.length; j++){
            if(arr[j] > arr[j+1]){
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }
    return arr;
}
console.log(bubbleSort(arr));



