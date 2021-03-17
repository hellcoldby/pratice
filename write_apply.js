/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-01-16 19:06:06
 * @LastEditors: ygp
 * @LastEditTime: 2021-03-17 17:32:24
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