/**
 * 判断括号有效性(自闭合)
 * '{}[]' true
 * '{{}[]' false
 * '[{()}]' true
 * 思路： 建立括号映射字典，遍历括号字符串，
 * 每一次push 入栈， 倒数第一个栈顶的字典映射和倒数第二个做对比。一致就消除。 继续入栈，对比， 一致就消除。
 *  最后栈消除为空，说明括号自闭合有效
 */
const str = "{{[]}}";

const isValid = function (str) {
    const stack = [];
    const map = {
        "}": "{",
        "]": "[",
        ")": "(",
    };

    for (let i = 0; i < str.length; i++) {
        const chart = str[i];
        stack.push(chart);

        if (stack.size < 2) continue;

        const last = stack[stack.length - 1];
        const last_sec = stack[stack.length - 2];

        //判断栈中最后两个一致就消除
        if (map[last] && map[last] === last_sec) {
            stack.pop();
            stack.pop();
            console.log(stack);
        }
    }

    //最后栈中没有内容时，说明括号闭合
    return stack.length === 0;
};

const res = isValid(str);
console.log(res);
