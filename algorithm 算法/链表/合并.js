/**
 * 描述： 
 * 输入： 1->2->4,  1->3->4 
 * 输出： 1->1->2->3->4->4
 * 
 */
 
import {n1,n2,n3,n4, m1,m2,m3,m4, showLink, ListNode} from './common.js';

let l1 = n1;
let l2 = m1;
// 1->2->4
l1.next = n2;
n2.next = n4;

//1->3->4 
l2.next = m3;
m3.next = m4;

//2. 合并链表
function mergeTwoLists  (l1, l2){
    let head = new ListNode();
    let cur = head;
    while(l1 && l2 ){
        if(l1.val <= l2.val){
            cur.next = l1;
            l1 = l1.next;
        }else{
            cur.next = l2;
            l2 = l2.next;
        }
        cur = cur.next;
    }
    cur.next = l1 !== null? l1 : l2;
    return head.next;
}

const res = mergeTwoLists(l1,l2);
showLink(res);