/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-01-16 19:06:06
 * @LastEditors: ygp
 * @LastEditTime: 2021-02-21 23:21:04
 */
function toApply(fn, arr){
    fn = fn? Object(fn) : window;
    fn.con = this;
    let args = [];
   
    let res = null;
    if(!arr){
        res = fn.con();
    }else{
        for(let i=1; i<arr.length; i++){
            args.push(arr[i]+'');
        }
        res =  eval('fn.con('+ args +')');
    }
    delete fn.con;
    return res;
}