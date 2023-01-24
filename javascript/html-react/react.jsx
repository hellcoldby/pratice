import Child from './child.jsx';
import FuncCmp from './FuncCmp.jsx';
import ClassCmp from './ClassCmp.jsx';
class LikeButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = { count: 0, setScrollTop:0 ,user:'小明'};
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
        <div>
        <label>
          <b> 选项: </b>
          <select
            value={this.state.user}
            onChange={e => this.setState({ user: e.target.value })}
          >
            <option value="小明">mm</option>
            <option value="小白">bb</option>
            <option value="小黄">hh</option>
          </select>
        </label>
        <h1>{this.state.user}</h1>
        <FuncCmp user={this.state.user}/>
        <ClassCmp user={this.state.user}/>
        </div>
      </div>
    }
  }
  
  const domContainer = document.querySelector('#like');
  const root = ReactDOM.createRoot( domContainer);
  root.render(React.createElement(LikeButton));

  
 