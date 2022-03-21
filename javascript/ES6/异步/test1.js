
// 数组默认带[Symbol.iterator]方法
let arr = ["a", "b", "c"];
let iter = arr[Symbol.iterator]();
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());




function to_iterator(obj){
    obj[Symbol.iterator] = function(){
        const obj_list = Object.keys(obj);
        const len = obj_list.length;
        let index = 0;
        function next(){
            if(index < len){
                return {
                    value: obj_list[index++],
                    done: false
                }
            }else{
                return {
                    value: null,
                    done: true
                }
            }
        }
        return {next: next}
        
    }
 
}

let obj= {
    a:1,
    b:2,
    c:3
}

to_iterator(obj);
const obj_iter = obj[Symbol.iterator]();
console.log(obj_iter.next());
console.log(obj_iter.next());
console.log(obj_iter.next());


function* foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
  }
  
var b = foo(5);

console.log(b.next()); // next 执行yield()--- 6, 并没有赋值操作
console.log(b.next(15)); // y赋值为 2 * 15 = 30, yield 结果为30/3 = 10, 
console.log(b.next(13));//  z赋值为13，  5+30+13 = 48

