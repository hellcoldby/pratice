/** 
 * Object.create() 
 * 在MDN 文档中，提供了polyfill (兼容插件)的实现方案
 */

//判断当前的浏览器有没有 Object.create 方法，没有的话就手动造一个
 if (typeof Object.create !== "function") {


    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }

        if (typeof propertiesObject !== 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

        function F() {}
        F.prototype = proto;

        return new F();
    };



}

//将 最后的 new F() 拆解下

Object.create = function(proto){

    function F() {};
    F.prototype = proto;


    let obj = {}
    const res = F.call(obj);
    obj.__proto__ = F.prototype;
    return  res instanceof Object? res: obj;


}