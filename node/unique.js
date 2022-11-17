/**
 * 数组去重的几种方式
 */
//1. new Set 去重
const arr1 = [1,1,8,8,12,12,15,15,16,16];
function unique1(arr){
    return Array.from(new Set(arr));
}

console.log('unique1: ', unique1(arr1));

//2. 双循环去重
const arr2 = [1,1,8,8,12,12,15,15,16,16];
function unique2(arr){
    for(let i=0; i<arr.length; i++){
        for(let j=i+1; j<arr.length; j++){
            if(arr[i] === arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}
console.log('unique2: ', unique2(arr2));

// 3. indexOf 
const arr3 = [1,1,8,8,12,12,15,15,16,16];
function unique3(arr){
    let tmp = []
    for(let i=0; i<arr.length; i++){
       if( tmp.indexOf(arr[i]) === -1){
         tmp.push(arr[i])
       }
    }
    return tmp;
}
console.log('unique3: ', unique3(arr3));

//4. includes
const arr4 = [1,1,8,8,12,12,15,15,16,16];
function unique4 (arr){
    let tmp = []
    for(let i=0; i<arr.length; i++){
       if(!tmp.includes(arr[i])){
         tmp.push(arr[i])
       }
    }
    return tmp;
}
console.log('unique4: ', unique4(arr3));

//5. filter
const arr5 = [1,1,8,8,12,12,15,15,16,16];
function unique5(arr){
    return arr.filter((item, index)=>{
        return arr.indexOf(item) === index;
    });
}
console.log('unique5: ', unique5(arr3));