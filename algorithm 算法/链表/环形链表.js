/**
 * 1. 如何判断链表是否成环
 *
 * 思路：遍历的时候，给每一个结点标记一个flag
 *
 *
 */
 import {n1,n2,n3,n4, m1,m2,m3,m4, showLink, ListNode} from './common.js';

 n1.next = n2;
 n2.next = n3;
 n3.next = n4;
 n4.next = n2;
 
 // 1->2->3->4->2;


 


function hasCycle(head) {
    while (head) {
        if (head.flag) {
            return true;
        } else {
            head.flag = true;
            head = head.next;
        }
    }
    return false;
}

/**
 * 2. 定位环的起点
 * 描述：给定一个链表， 返回链表 开始入环的第一个结点。 如果链表无环，则返回null。
 *
 * 思路：遍历链表的 标记每一个结点， 发现第一个结点的位置,返回即可
 *
 */

function detectCycle(head) {
    while (head) {
        if (head.flag) {
            return head;
        } else {
            head.flag = true;
            head = head.next;
        }
    }
    return null;
}

/**
<<<<<<< HEAD
 * 环形链表 双指针法
 *
 */
=======
 * 3. 用双指针 实现链表的定位
 * 
 * 思路：定义两个指针 ，快的fast 比慢的slow 每次多走两步。
 * fast闭环回头的时候，一定和slow 相遇 
 */

function doubleCycle(head){

    let slow = head;
    // 快指针多走两步
    let fast = head.next.next;

    while(fast.next){
        if(fast.next === slow){
            return fast;
        }
        console.log('...');
       fast = fast.next;
       slow = slow.next;
    }

}


const res = doubleCycle(n1);
console.log(res);
>>>>>>> 2b44b96 (remove package.json)
