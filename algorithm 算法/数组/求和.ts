/**
 * 描述：
 * 给定一个整数数组 numbers 和  一个目标值 target，
 * 请你在该数组中找出 和为目标值 的那两个整数，并返回他们的数组下标。
 *
 * 例如：nums = [2, 7, 11, 15];  target = 9;
 * 如果 nums[0] + nums[1] = 9; 就返回 [0,1]
 *
 *
 * 思路：
 * 1. 遍历数组
 * 2. 用 {值：序列} 标记每一个值  同时  寻找 obj.[target-当前值] 这个标记有没有出现过
 * 3. 如果出现过就输出
 *
 */

const array: number[] = [2, 7, 11, 15];
const target: number = 9;

function twoSum(array: number[], target: number) {
    interface diffType {
        [key: number]: number;
    }
    const diff: diffType = {};
    for (let i = 0; i < array.length; i++) {
        diff[array[i]] = i;
        if (diff[target - array[i]] !== undefined) {
            return [diff[target - array[i]], i];
        }
    }
}

const res = twoSum(array, target);
console.log(res);

export {};
