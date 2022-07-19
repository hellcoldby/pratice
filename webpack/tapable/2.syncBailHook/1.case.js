class SyncBailHook{
    constructor(args){ //args = ['name']
        this.tasks = [];
    }
    tap(name, task){
        this.tasks.push(task);
    }
    call(...args){
        let index = 0;
        let ret;
        do{
            this.task[index++](...args);
        }while(ret===undefined && index < this.tasks.length)
    }
}

let hook = new SyncBailHook(['name']);
hook.tap('react', function(name){
    console.log('react', name);
    return '中断执行'  //---------- 注意这里的中断执行
})
hook.tap('node', function(name){
    console.log('node', name);
});

hook.call('test')