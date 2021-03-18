/*
 * @Description: 用故事讲代码
 * @Author: ygp
 * @Date: 2021-03-17 16:53:19
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-18 12:15:58
 */

//你发明了一个暴富提款机
function magic(x){
    this.money = x * 10;
    console.log(this ,'放入了'+num +'元', '现在拥有'+ this.money+'元');
    return this.money;
};

// 不管谁放钱到里边，都会变成公家（window)的
magic(10);
//打印结果： Window {window: Window, self: Window, document: document, name: "", location: Location, …} "放入了10元" "现在拥有" 1000

// 别人不乐意了，自己的钱，翻倍了，但充公了。这不行啊

// 怎么办啊？
// 最好提款机有个识别信息的口，你插卡啊，身份证
//身份证
let obj = {name:'tom'};

magic.call(obj, 50);
//打印结果：  {name: "gy", money: 5000} "放入了50元" "现在拥有" 5000

//这个call 是如何制造出来的呢？

Function.prototype.toCall = function(obj){
    obj.mac = this; // 1.转译机器归属 --- 登记到你的名下
    obj.mac(); // 2. 运作暴富
    delete obj.mac; //3. 删除机器的归属
}
//参数
Function.prototype.toCall = function(obj){
    let args = [];
    for(let i=1; i<arguments.length; i++){
       args.push(arguments[i] + '');
    }


    // obj.mac = this; // 1.转译机器归属 --- 登记到你的名下
    
    const res =  eval('fn.con('+args+')');
    // const res = obj.mac(); // 2. 运作暴富
    // delete obj.mac; //3. 删除机器的归属
    return res;

}


// 一次放一张钱 ，不过瘾，能不能一次放一捆钱呢？
magic.apply(obj, [50, 100, 500, 1000]); // 造起来

Function.prototype.toApply = function(obj, arr){

    //判断第二个参数
    let args = [];
    let res = null;
    if(!arr){
        res = fn.con();
    }else{
        for(let i=1; i<arr.length; i++){
            args.push(arr[i]+'');
        }
        res =  eval('fn.con('+ args +')');
    }

    

    // obj.mac = this; // 1.转译机器归属 --- 登记到你的名下
    
    // const res =  eval('fn.con('+args+')');
    // const res = obj.mac(); // 2. 运作暴富
    // delete obj.mac; //3. 删除机器的归属
    // return res;

}

// 还有，call 和 apply 都是立即执行， 能不能先把钱放进去，我说开始生产，然后再吐呢
magic.bind(obj, 50);

//思路: 返回一个可执行的函数，里边是执行的动作
Function.prototype.toBind = function(obj){
    const _this = this;
    return function(){
        _this.call(obj)
    }
}

//参数处理
Function.prototype.toBind = function(obj){

    let args = [].slice.call(arguments, 1); //从第二个参数开始获取

    // const _this = this;
    // return function(){
            const bindArgs = [].slice.call(arguments);
            const mergeArgs = args.concat() //合并参数
             _this.apply(obj, mergeArgs);
    // }
}

//之前的机器，还有一些扩展的功能，例如：发现你的钱超过10000会播放歌曲
magic.prototype.ext = function(){
    if(this.money>=10000){
        console.log('lalalalala');
    }
}

/**
 * 
 * 什么时候用继承呢？
 * 给机器扩展功能的时候
 * 你造了一台机器，但想 共享使用 公用另一台机器的个别功能。
 * 
 * 什么时候用new?
 * 你要利用这台机器，批量生成东西的时候。
 */







//toBind 返回的可执行函数 需要继承这些功能才行
Function.prototype.toBind = function(obj){

    let args = [].slice.call(arguments, 1); //从第二个参数开始获取

    // const _this = this;
    const bindFn = function(){
            const bindArgs = [].slice.call(arguments);
            const mergeArgs = args.concat() //合并参数
             _this.apply(obj, mergeArgs);
    }

    bindFn.prototype = this.prototype;   //!!!! 这里的继承有个问题，都指向同一个地址，容易被修改
    return bindFn;
}

//注意啊： !!!! 这里的继承有个问题，都指向同一个地址，容易被修改
Function.prototype.toBind = function(obj){

    let args = [].slice.call(arguments, 1); //从第二个参数开始获取

    // const _this = this;
    const bindFn = function(){
            const bindArgs = [].slice.call(arguments);
            const mergeArgs = args.concat() //合并参数
             _this.apply(obj, mergeArgs);
    }
    const tmpFn = function(){};
    tmpFn.prototype = this.prototype;
    bindFn.prototype = new tmpFn();   //!!!! 这里的继承有个问题，都指向同一个地址，容易被修改
    return bindFn;
}