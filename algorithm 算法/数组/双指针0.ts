/**
 * 合并 --- 双指针
 * 
 * 描述：
 *  两个有序数组  nums1 和 nums2 
 *  请将 num2 合并到 nums1 中， 使nums1 成为一个有序数组。
 *  
 * 例如：
 *  nums1 = [1, 2, 3];
 *  nums2 = [2, 5, 6];
 * 
 * 输出：
 *  [1,2,2,3,5,6]
 * 
 * 思路：
 *  标准解法就是双指针法， 定义两个指针，各指向数组部分的尾部， 每次指针对所指的元素进行比较。
 *  取出较大的元素，从 nums1 的末尾前面填补
 * 
 *  
 */
 
type isArray = Array<number>;
const  nums1: isArray = [1, 2, 3];
const  nums2: isArray = [7, 2, 5, 8, 6];

function merge (arr1:isArray, arr2:isArray){
    const len1 = arr1.length;
    const len2 = arr2.length;
    const len_sum = len1 + len2;

    let i = len1 - 1;
    let j = len2 - 1;
    let k = len_sum - 1;

    while(i>=0 && j>=0){
        if(arr1[i] >= arr2[j]){
            arr1[k] = arr1[i];
            i--;
            k--;
        }else{
            arr1[k] = arr2[j];
            j--;
            k--;
        }
       
    }

    return arr1;
}

const res = merge(nums1, nums2);
console.log(res);


