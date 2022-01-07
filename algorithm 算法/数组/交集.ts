/**
 * 求两个数组的交集
 *
 * 思路： 遍历其中一个数组，判断 每个元素有没出现在另一个数组中
 */

type isArray = Array<string | number>; //定义一个类型

const ary1: isArray = [1, 2, 2, 1];
const ary2: isArray = [2, 2];

function intersect(ary1: isArray, ary2: isArray): isArray {
    let tmp: isArray = [];
    ary1.forEach((item, index) => {
        if (ary2.indexOf(item) !== -1) {
            tmp.push(item);
        }
    }); /*  */
    return tmp;
}

const t1 = ["a", "b", "c"];
const t2 = ["b"];

const res = intersect(t1, t2);
console.log(res);
