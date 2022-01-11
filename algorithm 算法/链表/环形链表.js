/**
 * 如何判断链表是否成环
 *
 * 思路：遍历的时候，给每一个结点标记一个flag
 *
 *
 */

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
 * 定位环的起点
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
