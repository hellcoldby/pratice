/**
 * 这是js语法的 react, 不支持代码中直接使用<MyButton></MyButton>  <button></button> 
 * 所有的标签都需要用 React.createElement 来创建
 * 类似于  document.createElement("div");
 */

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.addCount = this.addCount.bind(this)
  }

  addCount(){
    // const sum1 = this.state.count + 1;
    // const sum2 = this.state.count + 1;
    // const sum3 = this.state.count + 1;

    const sum1 = this.state.count += 1;
    const sum2 = this.state.count += 1;
    const sum3 = this.state.count += 1;

    console.log(sum1, sum2, sum3); // 打印结果 三个都一致才会合并


    this.setState({ count: sum1})
    this.setState({ count: sum2})
    this.setState({ count: sum3})

   
  }

  render() {
    const btn = React.createElement('button', {onClick: this.addCount }, 'linkButton');
    const sp = React.createElement('span', {},`${this.state.count}`)

    return React.createElement('div',{}, btn,sp )
    
    
  }
}

const domContainer = document.querySelector('#like');
ReactDOM.render(React.createElement(LikeButton), domContainer);

