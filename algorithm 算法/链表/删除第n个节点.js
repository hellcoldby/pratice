/**
 * 删除倒数第 2个节点
 * 
 * 示例： 1--->2--->3--->4
 * 删除倒数第2个节点： 1--->2--->4
 */
 import {n1,n2,n3,n4, m1,m2,m3,m4, showLink, ListNode} from './common.js';

 let l = n1;
 n1.next = n2;
 n2.next = n3;
 n3.next = n4;

//l --- 链表 n --- 倒数第几个
function delDup(l, n){
    let head = new ListNode();
    head.next = l;
    let slow = head;
    let fast = head;

    while(n){
        fast = fast.next;
        n--;
    }

    while(fast.next){
        fast = fast.next;
        slow = slow.next;
    }

    slow.next = slow.next.next;

    return head.next;

};

const res = delDup(l, 2);
showLink(res);