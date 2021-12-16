
//创建链表
function ListNode(val) {
    this.val = val;
    this.next = null;
}

//打印链表
function showLink(head) {
    let temp = head;
    while (temp != null) {
      console.log(temp.val);
      temp = temp.next;
    }
  }
  
let n1 = new ListNode(1);
let n2 = new ListNode(2);
let n3 = new ListNode(3);
let n4 = new ListNode(4);
let n5 = new ListNode(5);

let m1 = new ListNode(1);
let m2 = new ListNode(2);
let m3 = new ListNode(3);
let m4 = new ListNode(4);

export {
    ListNode,
    showLink,
    n1,
    n2,
    n3,
    n4,
    n5,
    m1,
    m2,
    m3,
    m4 
}