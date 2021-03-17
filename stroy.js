/*
 * @Description: 用故事讲代码
 * @Author: ygp
 * @Date: 2021-03-17 16:53:19
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-17 17:31:46
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