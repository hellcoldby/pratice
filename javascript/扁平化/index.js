
//非递归
function flat(arr){
    const stack = [...arr];
    const res = [];
    while(stack.length){
        const last = stack.pop();
        if(Array.isArray(last)){
            stack.push(last);
        }else{
            res.push(last);
        }
    }
    return res.reverse();
}
//递归
function flat1(arr){
    const res = [];
    (function _flat(arr){
        arr.forEach(item => {
            if(Array.isArray(item)){
                _flat(item);
            }else{
                res.push(item)
            }
        });
    })(arr);

    return res;
}