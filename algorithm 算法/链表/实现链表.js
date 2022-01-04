// 面试题 实现一个链表的常见功能

//创建一个结点
class Node{
    constructor(element){
        this.element = element;
        this.next = null;
    }
}

//实现链表增删改查
class LinkList {
    constructor(){
        this.length = 0;
        this.head = null; //指针
    }

    // 返回索引对应的元素 --- 查找
    getElement(index){
        if(index<0 || index >= this.length) return null;

        let cur = this.head;
        let i = 0;
        while(i<index){
            cur = cur.next;
            i++;
        }
        return cur;
    }
    
    // 添加节点 --- 增加
    append(element){
        let node = new Node(element);
        if(!this.head){
            this.head = node;
        }else{
            let cur = this.getElement(this.length -1);
            cur.next = node;
        }
        this.length++;
    }

    //在指定位置添加节点 --- 插入
    insert(index, element){

    }

    // 删除指定位置的元素 --- 删除
    removeAt(index){

    }

    //查找指定元素的索引 --- 索引
    indexOf(element){

    }
}