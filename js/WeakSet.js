// WeakSet 和 set 类似， 也是不重复的集合， 但成员必须是对象

const ws = new WeakSet();
// ws.add(1); // 报错--成员必须是对象
// ws.add(Symbol()); // 报错--成员必须是对象


//WeakSet 中的对象是弱引用，即垃圾回收机制不考虑对象是否还在WeakSet中，直接回收
//WeakSet 中成员个数会随时消失，不可测，因此es6 规定 WeakSet 不可遍历


const a = [1,2];
console.log(ws.add(a));
console.log(ws.add([[1,2],[3,4]])); //正确

//WeakSet 有三个方法  没有size属性  也不能用 forEach遍历
// add  delete  has

ws.add(window);
console.log(ws.has(window)); //true
console.log(ws.has(a)); // true
console.log(ws.delete(window)); //true


const fs = new WeakSet();
class Foo {
  constructor() {
    fs.add(this)
  }
  method () {
    if (!fs.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}