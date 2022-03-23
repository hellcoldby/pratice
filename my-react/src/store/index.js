import { createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import createSagaMiddleware  from 'redux-saga';
import {rootSaga} from './redux-saga/saga'; // saga 实际上是一个generator

let sagaMiddleware = createSagaMiddleware();
let store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga)
export default store;