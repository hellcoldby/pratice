class ClassCmp extends React.Component {
    showMessage = () => {
      alert('用户是' + this.props.user);
    };
    handleClick = () => {
      setTimeout(this.showMessage, 3000);
    };
    render() {
      return <button onClick={this.handleClick}>ClassCmp查询</button>;
    }
  }
  export default ClassCmp;