//判断数据类型
function isType(type) {
    return (obj)=> Object.prototype.toString.call(obj) === '[object]'+type+']';
}

