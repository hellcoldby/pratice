/**
 * Observer pattern
 * 观察者模式
 * 
 * 也叫 订阅/发布模式
 */

class Observer{
    constructor(){
      this.watchers = {};

    }

    subscribe(ev, cb){
        this.watchers[ev] = this.watchers[ev] || [];
        this.watchers[ev].push(cb);
    }

    publish(ev, params){
        if(this.watchers[ev] && this.watchers[ev].length){
            this.watchers[ev].forEach(cb => {
                cb.bind(this)(params);
            });
        }
    }

    remove(ev = null, cb = null){
        if(cb){
            if(this.watchers[ev] && this.watchers[ev].length){
                this.watchers[ev].splice(this.watchers[ev].findIndex(item => Object.is(item, cb), 1));
            }
        }else if(ev) {
            this.watchers[ev] = [];
        }else{
            this.watchers = {};
        }
    }
}


//发布订阅实例：

const ev1 = ()=>{console.log('提醒我起床')};
const ev2 = ()=>{console.log('提醒我天气情况')};
const ev3 = ()=>{console.log('提醒我交通情况')};

const o = new Observer();
o.subscribe('7点', ev1);
o.subscribe('8点', ev2);
o.subscribe('9点', ev3);


setTimeout(() => {
    o.publish('7点');
}, 1000);

setTimeout(() => {
    o.publish('8点');
}, 2000);

setTimeout(() => {
    o.publish('9点');
}, 3000);