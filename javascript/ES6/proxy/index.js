/**
 * proxy 创建一个对象的代理
 * 对属性 自定义 查找、赋值、枚举、函数调用
 * 
 * reflect 反射，提供拦截js的操作。和proxy相同
 * 
 * vue/core 中的响应模式就是基于这两个api 来实现的
 */


const parent = {
    name:'parent',
    get value(){
        return this.name;
    }
}

/**
 * receiver 不仅仅表示代理的对象
 * 也代表继承的对象
*/
const proxy = new Proxy (parent, {
    get(target, key, receiver){
        // console.log('receiver===proxy', receiver===proxy);
        // console.log('receiver===obj', receiver === child);
        // return target[key]
        /* 
        * Reflect get中的第三个参数receiver会修改this 的指向
        */
        return Reflect.get(target, key, receiver);
    }
})


const child = {
    name: 'test proxy'
}

Object.setPrototypeOf(child, proxy);
console.log(child.value);