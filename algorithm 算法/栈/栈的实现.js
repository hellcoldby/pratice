/**
 * 用栈实现一个队列
 * push(x) -- 将一个元素放入队列的尾部
 * pop() -- 从队列首部移除元素
 * peek() -- 返回队列首部的元素
 * isEmpty() -- 返回队列是否为空
 */
export class Stack {
    constructor() {
        this.items = [];
    }

    push(ele) {
        this.items.push(ele);
    }

    pop() {
        return this.items.pop();
    }

    //获取顶栈
    peek() {
        return this.items[this.items.length - 1];
    }

    //判断空
    isEmpty() {
        return this.items.length === 0;
    }

    clear() {
        this.items = [];
    }

    size() {
        return this.items.length;
    }
}

//实现一个栈，同时支持获取最小值
const MinStack = function () {
    this.stack = [];
    // 定义辅助栈
    this.stack2 = [];
};

/**
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function (x) {
    this.stack.push(x);
    // 若入栈的值小于当前最小值，则推入辅助栈栈顶
    if (this.stack2.length == 0 || this.stack2[this.stack2.length - 1] >= x) {
        this.stack2.push(x);
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
    // 若出栈的值和当前最小值相等，那么辅助栈也要对栈顶元素进行出栈，确保最小值的有效性
    if (this.stack.pop() == this.stack2[this.stack2.length - 1]) {
        this.stack2.pop();
    }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
    return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
    // 辅助栈的栈顶，存的就是目标中的最小值
    return this.stack2[this.stack2.length - 1];
};
