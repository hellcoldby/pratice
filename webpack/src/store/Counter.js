import { makeObservable, observable, action, computed, reaction } from 'mobx';

class Counter {
  @observable count = 0;
  @observable warning = ''
  @observable getRes = 0;

  constructor() {
    //定义数据存储模型后，于构造函数里调用 makeObservable(this)。
    //在 MobX 6 前不需要，但现在为了装饰器的兼容性必须调用。
    makeObservable(this);
   
    // 调用 reaction 方法
    this.printMessageWhen()
  }

  @computed get result(){
    this.getRes = this.count*2
    return  'count * 2 结果：'+ this.getRes;
  }

  @action
  increase() {
    this.count += 1;
  }

  @action
  decrease() {
    this.count -= 1;
  }

  //定义 reaction 方法,
  printMessageWhen(){
    reaction(
      //第一个函数用来追踪数据变化,返回一个结果
      ()=> this.getRes,
      //第二个函数用来追踪返回的结果，继续处理后续逻辑
      (getRes)=>{
        if(getRes>210){
          this.warning='数值增幅已经超过了210'
        }
      }
    )
  }
}

export default Counter;