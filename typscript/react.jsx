/**
 * 这是js语法的 react, 不支持代码中直接使用<MyButton></MyButton>  <button></button> 
 * 所有的标签都需要用 React.createElement 来创建
 * 类似于  document.createElement("div");
 */

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return React.createElement('button', {onClick: () => this.setState({ liked: true }) }, 'linkButton')
  }
}

const domContainer = document.querySelector('#like');
ReactDOM.render(React.createElement(LikeButton), domContainer);

