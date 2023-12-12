import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './reducers/a'
export default configureStore({
  reducer: {
    counter: counterReducer
  }
})