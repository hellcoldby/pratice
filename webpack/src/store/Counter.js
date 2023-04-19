import { makeObservable, observable, action } from 'mobx';
//https://juejin.cn/post/7046710251382374413#heading-12
class Counter {
  @observable count = 0;

  constructor() {
    //定义数据存储模型后，于构造函数里调用 makeObservable(this)。在 MobX 6 前不需要，但现在为了装饰器的兼容性必须调用。
    makeObservable(this);
  }

  @action
  increase() {
    this.count += 1;
  }

  @action
  decrease() {
    this.count -= 1;
  }
}

export default Counter;