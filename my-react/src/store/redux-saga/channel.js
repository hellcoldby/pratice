export function stdChannel(){
    let currentTasks = [];
    /**
     * 订阅
     * @param {*} cb 回调函数
     * @param {*} match 匹配器
     */
    function take(cb, match){
        cb['MATCH'] = match;
        cb.cancel = ()=>{
            currentTasks = currentTasks.filter(item => item !== cb);
        }
        currentTasks.push(cb);
    }
    //发布
    function put(input){
        for(let i=0; i<currentTasks.length; i++){
            let taker = currentTasks[i];
            let matcher = taker['MATCH'];
            if(matcher(input)){
                take.cancel();
                taker(input);
            }
        }
    }
 
    return {take, put}
} 

// let channel = stdChannel();
// function next(input){
//     console.log('继续执行了', input);
// }

// function matcher(input){
//     return input.type === 'add'
// }

// channel.take(next, matcher); 
// channel.put({type:'add'});
// channel.put({type:'add'});