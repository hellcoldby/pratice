/**
 * 求两个数组的交集
 *
 * 思路： 遍历其中一个数组，判断 每个元素有没出现在另一个数组中
 */

const ary1 = [1, 2, 2, 1];
const ary2 = [2, 2];

function intersect(ary1, ary2) {
    let tmp = [];
    ary1.forEach((item, index) => {
        if (ary2.indexOf(item) !== -1) {
            tmp.push(item);
        }
    });
    return tmp;
}

const res = intersect(ary1, ary2);

console.log(res);
