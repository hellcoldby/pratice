const urls = [1,2,3,4,5,6,7,8,9,10];

function myRequest(url){
    return ()=> {
       return new Promise((resolve, reject)=>{
            setTimeout(() => {
                console.log(`完成任务${url}, date:${new Date()}`);
                resolve({url,data:new Date()})
            }, 2000);
        })
    } 
}

const taskList = urls.map(url=>{
    return myRequest(url);
});


function promiseTask(taskList, limit){
    //计数器
    let counter = 0;
    // function run(){
    //    if(taskList.length === 0 || counter === limit) return;
        
    //    counter++;
    //    const fn = taskList.shift();
    //    fn().then(res=>{
    //      counter --;
    //      run();
    //    }).catch(err=>{
    //        counter --;
    //        run();
    //    })
    // }

    function run (){
        const newArray = [];
       
        for(let i=0; i<limit; i++){
            if(taskList[i]){
                newArray.push(taskList[i]())
            }
        }
        if(!newArray.length) return 
        Promise.all(newArray).then(res=>{
            taskList.splice(0,3);
            run();
        },rej=>{
            taskList.splice(0,3);
            run();
        })
    }

    run();
}

promiseTask(taskList, 3)


