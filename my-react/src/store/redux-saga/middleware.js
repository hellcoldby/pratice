import { stdChannel } from "./channel";



function sagaMiddlewareFactory() {
    const channel = stdChannel();
    let boundRunSaga; // 开始执行saga


    function sagaMiddleware({getState, dispatch}) {
        boundRunSaga = runSaga.bind(null, {
            channel, dispatch, getState
        });
        return function(next){  // 调用下一个中间件，只有一个中间件 next = store.dispatch
            return function(action){
                let result = next(action); //以后调用dispatch的时候， 除了调用老的 store.dispatch
                channel.put(action);  //调用 channel.put
                return result;
            }
        }
    }


    sagaMiddleware.run = (rootSaga)=>{
        boundRunSaga(rootSaga);
    }

    return sagaMiddleware;
}

export default  sagaMiddlewareFactory;