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

const nums1 = [1, 2, 3];
const nums2 = [7, 2, 5, 8, 6];

type isArray = Array<number>;

function merge(ary1: isArray, ary2: isArray): isArray {
    const l1: number = ary1.length;
    const l2: number = ary2.length;
    const l_sum: number = l1 + l2;

    let i = l1 - 1;
    let j = l2 - 1;
    let k = l_sum - 1;

    while (i >= 0 && j >= 0) {
        if (ary1[i] < ary2[j]) {
            ary1[k] = ary2[j];
            j--;
        } else {
            ary1[k] = ary1[i];
            i--;
        }
        k--;
    }
    return ary1;
}

const res = merge(nums1, nums2);
console.log(res);
