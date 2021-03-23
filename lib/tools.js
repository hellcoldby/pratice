//判断数据类型
function isType(type) {
    return (obj)=> Object.prototype.toString.call(obj) === '[object]'+type+']';
}

//深拷贝
function deepClone(parent){
    if(!parent) return parent;
    // 如果是数组
    let child = null;
    if(Object.prototype.toString.call(parent) === '[object Array]' ){
        if(parent.length){
            child = [];
            for(let i=0; i<parent.length; i++){
                child[i] = deepClone(parent[i]) ;
            }
        }else{
            child = parent;
        }
        return child;
    }
    // 如果是对象
    if(Object.prototype.toString.call(parent) === '[object Object]'){
        if(JSON.stringify(parent) === '{}'){
            child = {}
            for(let key in parent){
                child[key] = deepClone(parent[key]);
            }
        }else{
            child = parent;
        }
        return child;
    }
    
    child = parent;
    return child;
}

