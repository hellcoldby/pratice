

// 1. 节流 --- 多次点击，每隔一段时间执行一次
function throttle(fn, await){
    let prev = 0;
    return function (...args){
        let now = new Date();
        if(now - prev > await){
            prev = now;
            fn.apply(this, args);
        }
    }
}

//2. 防抖 --- 多次触发，只执行最后一次。
function debounce(fn, await){
    let timer; // 这个变量常驻内存，每次点击都会清空， 一直点击，就一直清空，不点击的时候，才往下执行
    return function(){
        clearTimeout(timer);
        timer = setTimeout(()=>{
        fn.apply(this, arguments);
        
        }, await)
    }
}