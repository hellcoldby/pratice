/**
 * 题目描述：给定一个数组 nums 和滑动窗口的大小 k，请找出所有滑动窗口里的最大值。
 *
 * 输入: nums = [1,3,-1,-3,5,3,6,7], 和 k = 3 输出: [3,3,5,5,6,7]
 *
 *
 * 思路分析：双指针+遍历法
 */

const maxSlidingWindow = function (nums, k) {
    // 缓存数组的长度
    const len = nums.length;
    // 初始化结果数组
    const res = [];
    // 初始化双端队列
    const deque = [];
    // 开始遍历数组
    for (let i = 0; i < len; i++) {
        // 当队尾元素小于当前元素时
        while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
            // 将队尾元素（索引）不断出队，直至队尾元素大于等于当前元素
            deque.pop();
        }
        // 入队当前元素索引（注意是索引）
        deque.push(i);
        // 当队头元素的索引已经被排除在滑动窗口之外时
        while (deque.length && deque[0] <= i - k) {
            // 将队头元素索引出队
            deque.shift();
        }
        // 判断滑动窗口的状态，只有在被遍历的元素个数大于 k 的时候，才更新结果数组
        if (i >= k - 1) {
            res.push(nums[deque[0]]);
        }
    }
    // 返回结果数组
    return res;
};

const nums = [1,1,1,1,1];
const res = maxSlidingWindow(nums, 3);
console.log(res);