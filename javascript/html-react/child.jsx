
function Item(props) {
    return <div style={{ width: '100%', height: '50px', backgroundColor: '#77C386', boxSizing: 'border-box', marginBottom: '2px' }}>{props.id} </div>
}
function Child(props) {
    const { sTop, boxH } = props;
    console.log(sTop)
    //列表高度
    const itemH = 50;
    //列表数量
    const itemCount = 50;


    let tmp = [];

    // 顶部列表 序列位置
    let top_i = Math.floor(sTop / itemH);
    // 底部
    let bottom_i = Math.floor(sTop + boxH) / itemH;

    //视野范围内有限高度内，
    // 多渲染两个放前面
    top_i = Math.max(top_i - 2, 0);
    // 多渲染两个放后面
    bottom_i = Math.min(bottom_i + 2, itemCount - 1);




    for (let i = top_i; i < bottom_i; i++) {
        tmp.push(<Item key={i} id={i} />)
    }
    const top = itemH * top_i;
    const conH = itemH * itemCount;



    return <div style={{ width: '100%', height: `${conH}px` }}>
        <div style={{ height: top }}></div>
        {
            tmp
        }
    </div>
}

export default Child;