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
    getElementAt(index){
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
            let cur = this.getElementAt(this.length -1);
            cur.next = node;
        }
        this.length++;
    }

    //在指定位置添加节点 --- 插入
    insert(index, element){
        if(index<0 || index >= this.length) return null;

        let node = new Node(element);
        if(index === 0){
            this.head = node;
        }else{
            //找到上一个位置
            let previous = this.getElementAt(index -1);
            previous.next = node;
            node.next = previous.next.next;
        }
    }

    // 删除指定位置的元素 --- 删除
    removeAt(index){
        if(index<0 || index >= this.length) return null;

        let cur = this.head;
        if(index === 0){
            this.head = cur.next;
        }else{
            let previous = this.getElementAt(index -1);

            let cur = previous.next;
            previous.next = cur.next;
        }
        this.length--;

        //返回删除的元素
        return cur.element;
    }

    //查找指定元素的索引 --- 索引
    indexOf(element){
        let i=0;
        while(i < this.length){
            if(cur.element === element) return i;
            cur = cur.next;
            i++;
        }

        return -1;
    }
}