/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-07-30 07:36:36
 * @LastEditors: ygp
 * @LastEditTime: 2021-07-30 09:06:20
 */
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"
m.has(o) // true
m.delete(o) // true
m.has(o) // false


//接受数组作为参数
const map = new Map([
    ['name', '张三'],
    ['title', 'Author']
]);
  
map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"


//相当于
const items = [
    ['name', '张三'],
    ['title', 'Author']
  ];
  
const map = new Map();
items.forEach(
([key, value]) => map.set(key, value)
);

//任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构
//（详见《Iterator》一章）都可以当作Map构造函数的参数。
const set = new Set([
    ['foo', 1],
    ['bar', 2]
  ]);
  const m1 = new Map(set);
  m1.get('foo') // 1
  
  const m2 = new Map([['baz', 3]]);
  const m3 = new Map(m2);
  m3.get('baz') // 3


  //多次赋值 后边的覆盖前边的
const map = new Map();

map
.set(1, 'aaa')
.set(1, 'bbb');
map.get(1) // "bbb"

//读取未知的键
new Map().get('asfddfsasadf')
// undefined


const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined



const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222