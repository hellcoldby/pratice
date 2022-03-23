export default function proc(env, iterator){

    function next(args){
        let result;
        result = iterator.next();
        if(!result.done){
            runEffect(result.value, next);
        }
    }

    function runEffect(effect, next){
        next();
    }

    next();
}