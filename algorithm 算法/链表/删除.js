/**
 * 描述：删除重复节点
 * 输入: 1->1->2   输出: 1->2
 * 输入: 1->1->2->3->3  输出: 1->2->3
 * 
 * 
 * 思路： 将需要删除的目标结点的前驱结点 next 指针往后指一格
 */
import {n1,n2,n3,n4, m1,m2,m3,m4, showLink, ListNode} from './common.js';
n1.next = m1;
m1.next = n2;
n2.next = n3;
n3.next = m3;
const deleteDuplicates = function(head) {
    // 设定 cur 指针，初始位置为链表第一个结点
    let cur = head;
    // 遍历链表
    while(cur != null && cur.next != null) {
        // 若当前结点和它后面一个结点值相等（重复）
        if(cur.val === cur.next.val) {
            // 删除靠后的那个结点（去重）
            cur.next = cur.next.next;
        } else {
            // 若不重复，继续遍历
            cur = cur.next;
        }
    }
    return head;
};

const res = deleteDuplicates(n1)
showLink(res);