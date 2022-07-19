class SyncWaterfallHook{
    constructor(args){ //args = ['name']
        this.tasks = [];
    }
    tap(name, task){
        this.tasks.push(task);
    }
    call(...args){
       let [first, ...others] = this.tasks;
       let ret = first(...args);
       others.reduce((prev, cur)=>{
            return cur(prev);
       },ret)
    }
}

let hook = new SyncWaterfallHook(['name']);
hook.tap('react', function(name){
    console.log('react', name);
    return 'react ok '
})
hook.tap('node', function(name){
    console.log('node', name);
    return 'node ok'
});

hook.call('test')