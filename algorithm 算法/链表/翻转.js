
import {n1,n2,n3,n4,n5, m1,m2,m3,m4, showLink, ListNode} from './common.js';
// 1->2->3->4->5->null
n1.next = n2;
n2.next = n3;
n3.next = n4;
n4.next = n5;

var reverseList = function (head) {
    // 特殊情况
    if (head === null || head.next === null) return head;
    // 从第二个节点开始迭代反转
    // 注意这几句的顺序不能颠倒
    let previous = head;
    head = head.next;
    let current = head;
    previous.next = null;
    do {
      head = head.next;
      current.next = previous;
      previous = current;
      current = head;
    } while (head !== null)
    return previous;
};
  
// showLink(n1);
let h2 = reverseList(n1);
showLink(h2);
  