//实现一个栈
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
