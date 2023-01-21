import Child from './child.jsx';
class LikeButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = { count: 0, setScrollTop:0 };
      this.addCount = this.addCount.bind(this)
      this.handleScroll = this.handleScroll.bind(this);
    }

  
    addCount(){
      const sum = this.state.count += 1;
      this.setState({ count: sum})
    }

  
    handleScroll(e){
        const sTop = e.target.scrollTop;
        return ReactDOM.flushSync(() => {
            this.setState({
                setScrollTop : sTop
            })
        });
    }

  
    render() {
      return <div>
        <button onClick={this.addCount}>linkButton</button>
        <span>{this.state.count}</span>
        <div 
            style={{width:'500px', height:'500px', border:'1px solid red', overflow:'auto'}}
            onScroll = {this.handleScroll}
        >
            <Child sTop = {this.state.setScrollTop} boxH = {500}/>
        </div>
      </div>
    }
  }
  
  const domContainer = document.querySelector('#like');
  const root = ReactDOM.createRoot( domContainer);
  root.render(React.createElement(LikeButton));

  
 