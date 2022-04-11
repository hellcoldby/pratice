//防抖
function debounce(fn, delay){
    let _this = this;
    let timer = null;
    return function(){
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(_this, arguments);
        }, delay);
    }
}

//节流
function throttle(fn, delay){
    let _this = this;
    let timer = null;
    return function(){
        if(!timer){
            timer = setTimeout(() => {
                fn.apply(_this, arguments);
                clearTimeout(timer);
                timer = null;
            }, delay);
        }
    }
}