import React, { Component } from 'react'

type IProps = {
   num?: number
}

interface IState{
  num:number
}

export default class index extends Component<IProps, IState> {
  constructor(props:IProps){
    super(props);
    this.state = {
      num:0
    }
    this.handle = this.handle.bind(this)
  }

  // UNSAFE_componentWillReceiveProps(props:Readonly<IProps>){
  //   console.log(props)
  // }

  static getDerivedStateFromProps(props:Readonly<IProps>, state:Readonly<{}>){
    console.log('props',props, 'state',state)
    return null
  }

  handle(){
    console.log(this.state.num)
    this.setState({
      num:this.state.num+1
    })
  }

  render() {
    return (
      <button onClick={this.handle}>{this.state.num}</button>
    )
  }
}
