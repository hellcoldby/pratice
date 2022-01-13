import { Stack } from "./common.js";
/**
 * 判断括号有效性(自闭合)
 * '{}[]' true
 * '{{}[]' false
 * '[{()}]' true
 *
 */
const str = "{{{[";

const isValid = function (str) {
    const stack = new Stack();
    const map = {
        "}": "{",
        "]": "[",
        ")": "(",
    };

    for (let i = 0; i < str.length; i++) {
        const chart = str[i];
        stack.push(chart);

        if (stack.size < 2) continue;

        const last = stack[stack.size - 1];
        const last_sec = stack[stack.size - 2];

        //判断栈中最后两个一致就消除
        if (map[last] === map[last_sec]) {
            stack.pop();
            stack.pop();
        }
    }

    //最后栈中没有内容时，说明括号闭合
    return stack.size === 0;
};

isValid();
