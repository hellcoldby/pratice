let obj = {
    id: '123',
    name: '张三',
    age: 18,
    gender: '男',
    hobbie: '睡觉'
}

obj[Symbol.iterator] = function () {
    let keyArr = Object.keys(obj)
    let index = 0
    return {
        next() {
            return index < keyArr.length ? {
                value: {
                    key: keyArr[index],
                    val: obj[keyArr[index++]]
                }
            } : {
                done: true
            }
        }
    }
}


// obj[Symbol.iterator] = function(){
//     let keys = Object.keys(this);
//     let index = 0;
//     return {
//         next: function(){
//             if(index < keys.length){
//                 return { value: {key:keys[index++], value:obj[keys[index++]]}, done: false}
//             }else{
//                 return {done:true}
//             }
//         }
//     }
// }


for(let key of obj){
    console.log(key)
}

for(let key of obj.values()){
    console.log(key);
}