import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
    value: number;
  }
  

export const counterSlice = createSlice({
    name: 'counter',
    initialState:{
        value:0
    } as CounterState,
    reducers: {
        add: state =>{
            state.value += 1;
        },
        sub: state =>{
            state.value -= 1;
        },
        addByAmount: (state, action)=>{
            state.value += action.payload
        }
    }
});

export const {add, sub, addByAmount} = counterSlice.actions;
export default counterSlice.reducer