/**
 * 三数求和  --- 双指针( 这种指针向中间靠拢的方式也叫 “对撞指针”)
 *
 *  描述：
 * 整数的数组  nums  和 一个目标值  target。
 * 找出  nums  中的三个整数，使得它们的和与  target  最接近这三个数的和。输出这三个数。
 * 假定三个数都是唯一的
 *
 *
 * 例如：
 * nums = [-1, 0, 1, 2, -1, -4];   target = 2;
 * 结果: [[-1, 1, 2]]
 *
 *
 * 思路：--- 先排序，取出第一个作为最小值。
 * 1. 遍历 当前的序列的值 作为第一个数basic
 * 2. 查找下一个next 和 最后一个last  --->   basic + next + last ===  target 三个数的和和目标值
 * 3. 如果 三个数的和 > target ----> last--
 * 4. 如果 三个数的和 < target ----> next++
 */

const nums = [-1, 0, 1, 2, -1, -4];
const target = 0;

function callBackSum(nums, target) {
    let len = nums.length;
    //1. 先排序
    const _nums = nums.sort((a, b) => a - b);
    let res = [];
    //循环
    for (let i = 0; i < len - 3; i++) {
        let basic = _nums[i];
        let next = i + 1;
        let last = len - 1;

        while (next < last) {
            let sum = basic + _nums[next] + _nums[last];

            if (sum > target) {
                last--;
            } else if (sum < target) {
                next++;
            } else {
                res.push([basic, _nums[next], _nums[last]]);
                break;
            }
        }
    }
    console.log(res);
    return res;
}

const res = callBackSum(nums, target);
