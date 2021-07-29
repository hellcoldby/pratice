// set 是一种叫做!!集合!!的数据结构
// map 是一种叫做!!字典!!的数据结构

// 1.Set 构造函数 生成一个类似于数组，成员是唯一的（没有重复的值）， 无序的数据结构。


// 任何数据结构只要部署 Iterator 接口，就可以完成遍历操作

//Iterator:
//Iterator 的作用有三个： 1，提供一个统一的简单的访问接口 
//2. 数据结构成员按某种次序排列
//3. 可用新的遍历命令 for...of 循环

//set 可用map 和 filter


//new Set() 参数只要带有 iterator 接口都可以

const ary = [1,2,3,4,2,1];
const set = new Set(ary); 
console.log('生成的是实例---',set);//生成的是实例
console.log('去除重复数组---',[...set]); //解析成数组 [ 1, 2, 3, 4 ] 
// Array.from(set) 也可以

//去除重复  [...new Set(array)] --- 去除重复的字符串
const str =[...new Set('ababcc')].join('');
console.log('去除重复字符串---', str);



//获取 set_map.html 中的元素  --- set.size 获取成员个数
const set1 = new Set(document.querySelectorAll('div'));  //获取dom集合
console.log('获取dom集合---',set1.size); //5

//获取 set_map.html 中的元素 等价写法 --- set.add() 添加成员
const set2 = new Set();
document.querySelectorAll('div').forEach(div=> set2.add(div));
console.log('获取dom集合---',set2.size); //5


const set3 = new Set();
set3.add(NaN);
set3.add(NaN);
set3.add(5);
set3.add('5');
const obj = {};
set3.add(obj);
set3.add({});
set3.add({})
console.log('set不处理数据类型---对象总是不相等的---',set3);

//set 实例的属性和方法
//add size  has  delete clear
console.log(set3.size);  //成员总数
console.log(set3.has(5)); //是否存在 true/false
console.log(set3.delete(obj)); //删除是否成功 true/false
// console.log(set3.clear()); //清空成员



//set 有四个遍历方法
// keys  values  entries  forEach
//由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值）
//所以keys方法和values方法的行为完全一致。
let set4 = new Set(['red', 'green', 'blue']);
for(let item of set4.keys()){
    console.log('keys 键名遍历---', item);
}

for(let item of set4.values()){
    console.log('values 键值遍历---', item);
}


for(let item of set4.entries()){
    console.log('entries 键值对遍历---', item);
}


//Set 结构的实例默认可遍历, 就是它的values方法, 这意味着可以直接遍历set
Set.prototype[Symbol.iterator] === Set.prototype.values
// true

for(let item of set4){
    console.log('values 键值遍历---', item);
}
set4.forEach((value, key) => console.log(key+':'+value))


//并集(Union) 交集(Intersect) 差集(Difference) 
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}




//改变原来的set结构
// 方法一
let set5 = new Set([1, 2, 3]);
set5 = new Set([...set5].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set6 = new Set([1, 2, 3]);
set6 = new Set(Array.from(set6, val => val * 2));
// set的值是2, 4, 6
