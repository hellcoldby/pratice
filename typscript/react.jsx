import userInfo from './userInfo';

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.addCount = this.addCount.bind(this)
  }

  addCount(){
    const sum = this.state.count += 1;
    this.setState({ count: sum})
  }

  render() {
    return <div>
      <button onClick={this.addCount}>linkButton</button>
      <span>{this.state.count}</span>
      <div>引入的模块化内容为： userInfo</div>
    </div>
  }
}

const domContainer = document.querySelector('#like');
ReactDOM.render(React.createElement(LikeButton), domContainer);