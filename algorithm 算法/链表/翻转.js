/**
 * 链表的翻转
 * 1->2->3->4->5->null
 * 5->4->3->2->1->null
 *
 * 思路 ：
 *  遍历每个结点  把每个结点的next 指向前一个结点 就完成了翻转
 *
 *  我们需要一个辅助结点prev 来保存上一个结点  我们还需要辅助结点next 来保存下一个结点
 *
 */

import { n1, n2, n3, n4, n5, m1, m2, m3, m4, showLink, ListNode } from "./common.js";

n1.next = n2;
n2.next = n3;
n3.next = n4;
n4.next = n5;

function reverse(head) {
    let pre = null;
    let cur = head;

    while (cur !== null) {
        //保存下一个结点
        let next = cur.next;
        //下一个结点 指向 前置结点
        cur.next = pre;
        //前置结点 变更为 当前结点
        pre = cur;
        //当前结点 变更为 下一个结点
        cur = next;
    }
    return pre;
}

const res = reverse(n1);
showLink(res);

/**
 * 局部翻转
 *
 *  描述： 翻转从位置 m 到 n 的链表。请使用一次遍历完成翻转。
 *  实例： 输入: 1->2->3->4->5->NULL, m = 2, n = 4
 *  输出: 1-> 4->3->2 ->5->NULL
 *
 *  思路：
 *  1. 切断3的指针 翻转指向2 切断4的指针 翻转指向3
 *  2. 4指3，3指2，这都没问题，关键在于，如何让1指向4、让2指向5呢？
 *  3. 需要把结点1 缓存下来。
 *
 *
 */

function reverseBetween(head, m, n) {
    /**--------定位到区间开始位置 begin------------ */
    //创建空结点
    const dummy = new ListNode();
    dummy.next = head;
    //定义遍历指针,初始位置，指向dummy
    let p = dummy;
    //p走到m-1位置
    for (let i = 0; i < m - 1; i++) {
        p = p.next;
    }
    /**--------定位到区间开始位置  end------------ */

    //保存翻转区间 开始位置---第一个结点
    let start = p.next;

    /**--------翻转指针 begin------------ */
    let pre = start;
    let cur = pre.next;
    //遍历翻转
    for (let i = m; i < n; i++) {
        let next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    /**--------翻转指针 end------------ */
}
