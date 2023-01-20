
/**
 * proxy pattern 代理模式
 * 
 */

class Factory{
    constructor(count){
        this.productions = count || 1000;
    }
    //生产
    produce(count){
        this.productions += count;
    }
    //批发
    wholesale(count){
        this.productions -= count;
    }
}

//代理 继承 过滤需求
class ProxyFactory extends Factory{
    constructor(count){
        super(count);
    }
    //生产
    produce(count){
        if(count > 5){
            super.produce(count);
        }else{
            console.log('低于5件不接单');
        }
    }
    //批发
    wholesale(count){
        if(count > 10){
            super.wholesale(count);
        }else{
            console.log('低于10件不批发');
        }
    }
}

// es6 中的 proxy 对象
// target --- 被拦截的对象
// handler --- 用来定制拦截的行为

const target = {
    name: 'sss'
};

const handler = {
    get: function(target, key){
        console.log(`${key}被读取`);
        return target[key];
    },
    set: function(target, key, value){
        console.log(`${key}被设置`);
        target[key] = value;
    }
}

const proxy = new Proxy(target, handler);
targetWithLog.name; // 控制台输出：name 被读取
 targetWithLog.name = 'others'; // 控制台输出：name 被设置为 others



 //设置拦截
 var proxy = new Proxy({}, {
    get: function(target, property) {
      return 35;
    }
  });
  
  proxy.time // 35
  proxy.name // 35
  proxy.title // 35