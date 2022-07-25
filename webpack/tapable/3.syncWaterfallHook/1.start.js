/**
 *  上一个函数的返回值，作为下一个的参数
 */
let { SyncWaterfallHook } = require('tapable');

class Lesson{
    constructor(){
        this.hooks = {
            arch: new SyncWaterfallHook(['name'])
        }
    }


    tap(){// 注册
        this.hooks.arch.tap('node', function(data){
            console.log('node', data);
            return 'node hook';
        })
        this.hooks.arch.tap('react', function(data){
            console.log('react',data);
            return 'react hook';
        })
    }

    start(){//启动
        this.hooks.arch.call();
    }
}

let l = new Lesson();
l.tap(); //注册事件
l.start(); //启动钩子