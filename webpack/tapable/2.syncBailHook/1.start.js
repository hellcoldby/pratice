/**
 *  SyncBailHook  
 *  中断订阅执行。 通过事件里的 return
 */

let { SyncBailHook } = require('tapable');

class Lesson{
    constructor(){
        this.hooks = {
            arch: new SyncBailHook(['name'])
        }
    }


    tap(){// 注册
        this.hooks.arch.tap('node', function(name){
            console.log('node', name);
            return '想停止学习'
        })
        this.hooks.arch.tap('react', function(name){
            console.log('react',name);
        })
    }

    start(){//启动
        this.hooks.arch.call();
    }
}

let l = new Lesson();
l.tap(); //注册事件
l.start(); //启动钩子