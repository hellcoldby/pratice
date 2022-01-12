import {n1,n2,n3,n4, m1,m2,m3,m4, showLink, ListNode} from './common.js';
n1.next = m1;
m1.next = n2;
n2.next = n3;
n3.next = m3;


//删除重复节点
function delDuplicate(head){
    //遍历指针只能用while ,因为不知道指针的长度
    let cur = head;
    //只要结点next还有值
    while(cur && cur.next){
        if(cur.val === cur.next.val){
            cur.next = cur.next.next;
        }else{
            cur = cur.next;
        }
    }

    return head;
}


//删除重复结点并删除自身
function delSelfDuplicate(head){
    //需要一个空指针放在头部，以防无法删除第一个结点
    let sub = new ListNode();
    sub.next = head;

    let cur = sub;
    while(cur && cur.next){
        if(cur.next.val === cur.next.next.val){
            while(cur.next.val === val){
                cur.next = cur.next.next;
            }
        }else{
            cur = cur.next;
        }

    }

    return head;
}