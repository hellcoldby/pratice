/**
 * 温度问题：
 * 给定一个每日温度列表 temperatures = [73, 74, 75, 71, 69, 72, 76, 73]，  遍历 以当日温度为基础，当日需要过几天 才会遇到高于温度
 * 你的输出应该是 [1, 1, 4, 2, 1, 1, 0, 0]
 *
 * 思路：
 */

const t = [73, 74, 75, 71, 69, 72, 76, 73];

function findDay(t) {
    const len = t.length;
    //记录序列
    const stack = [];
    //统计结果的数组
    const arr = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
        // 当日温度都和之前温度作对比，大于之前温度，stack就删除最后一个序列， 并计算差值
        while (stack.length && t[i] > t[stack[stack.length - 1]]) {
            const top = stack.pop();
            arr[top] = i - top;
        }
        stack.push(i);
    }

    return arr;
}
