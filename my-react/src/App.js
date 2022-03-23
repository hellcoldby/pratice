import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';


function App(props) {


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>

        <button onClick={props.add}> ++ </button>
        <p>{props.getState}</p>
        <button onClick={props.dec}> -- </button>
        </div>
      </header>
      
    </div>
  );
}

const mapStateToProps =   ((state)=>({
  getState: state
}));

const mapDispatchToProps = dispatch =>({
  add: () => dispatch({ type: 'async_add' }),
  dec: () => dispatch({ type: 'DECREMENT' })
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
