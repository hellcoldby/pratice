/**
 * 两个数组的交集 
 */


/**
 * 思路：
 * 1. 
 */

const ary1 = [1,2,2,1];
const ary2 = [2,2];

function intersect(num1, num2){

   function getMap(data){
        let ary = {};
        for(let i=0; i<data.length; i++){
            let item = data[i];
            if(!ary[item]){
                ary[item] = 1;
            }else{
                ary[item] ++;
            }
        }
        return ary;
   }

   const map1 = getMap(num1);
   const map2 = getMap(num2);

//    console.log(map1, map2)


   let res = [];
   for(let key in map1){
       if(map1[key] && map2[key]){
            const lessCount = Math.min(map1[key], map2[key]);
            for(let i=0; i<lessCount; i++){
                res.push(key);
            }
       }
   }
   
   return res;
}


const res = intersect(ary1, ary2);

console.log(res);