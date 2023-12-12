var a;
(function (a) {
    var c1 = { list: ['hello'] };
    var c2 = [1, 2, 3];
})(a || (a = {}));
var b;
(function (b) {
    var p = { name: '张三', age: 18 };
    var p2 = {
        name: 'hello',
        age: 20
    };
})(b || (b = {}));
var c;
(function (c) {
    var myName = '张三';
    var myLevel = 1;
})(c || (c = {}));
var d;
(function (d) {
    function getValue_key(val, key) {
        return val[key]; // 参数key被限制 ✅
    }
})(d || (d = {}));
var e;
(function (e) {
    var p = {};
})(e || (e = {}));
var g;
(function (g) {
    //等价于
    // interface pickPerson{
    //     name: string;
    // }
    var x = {
        name: 'hello'
    };
})(g || (g = {}));
