
import {put, take} from 'redux-saga/effects';

export function * rootSaga(){
    for(let i=0; i<3; i++){
        console.log('等待effects动作');
        const action = yield take('async_add');
        console.log('tak执行', action);
        yield put({type: 'INCREMENT'}) 
    }
}

/**
 * 在saga里边我们有三种generator = saga
 * 1. 根saga 它是入口
 * 2. watcher saga 监听
 * 3. worker saga 工作
 * 
 * 
 * effects 指令对象, 告诉saga 我想要做什么
 * take 接收
 * put 真正向仓库派发动作{type: action}
 */