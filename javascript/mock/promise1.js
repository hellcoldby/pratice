/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-09-01 14:58:26
 * @LastEditors: ygp
 * @LastEditTime: 2021-09-02 11:04:59
 */




const {loadImg, urls} = require('./mock1');

class PromiseQueue{
    constructor(options={}){
        this.concurrency = options.concurrency||1;
        this.currentCount = 0;
        this.pendingList = [];
    }

    add(task){
        this.pendingList.push(task);
        this.run();
    }

    run(){
        if(this.pendingList.length === 0 || this.currentCount === this.concurrency){
            return;
        }

        this.currentCount ++;
        const fn = this.pendingList.shift();
        const promise = fn();
        promise
            .then(this.complete.bind(this))
            .catch(this.complete.bind(this))
    }

    complete(){
        this.currentCount--;
        this.run();
    }

}

const queue = new PromiseQueue({
    concurrency: 3
});

urls.forEach(url =>{
    queue.add(()=>loadImg(url))
})