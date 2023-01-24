const FuncCmp = (props) => {
    // console.log(props);
    const showMessage = () => {
      alert('用户是' + props.user);
    };
    const handleClick = () => {
      console.log(props);
      setTimeout(showMessage, 3000);  // 用 setTimeout 来模拟网络请求
    };
    return (
      <button onClick={handleClick}>FunCmp查询</button>
    );
  }
  export default FuncCmp;