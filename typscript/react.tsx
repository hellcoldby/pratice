
/**
 * 如何让typescript 识别到 react库 里边的 语法关键词？？？
 * 
 * 用 .d.ts 结尾的描述文件    
 * 自己写吗？？？
 * no no no
 * react 社区大家贡献出来的描述文件 https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react     npm---> @types/react
 * 
 */

//设置props 属性
interface buttonPropsType {
  content?:string;
}
//设置 state 属性
interface buttonStateType{
  liked?:boolean;
}
class MyLikeButton extends React.Component<buttonPropsType, buttonStateType> {
     constructor(props:any) {
      super(props);
      this.state = { liked: false };
    }

    handleClick: React.MouseEventHandler<HTMLButtonElement>=(e)=>{
      this.setState({ liked: !this.state.liked })
    }
  
    render() {
       return <div style={{width: '300px', margin:'100px auto'}}>
          <button style={{padding:'10px', background:'yellow', borderRadius:'5px'}} onClick={this.handleClick}>点我 </button>
          <h1>{
              this.state.liked? 'hi, 你是不是傻': 'come on click!'
            }</h1>
        </div>
      
    }
  }
  
  const domContainer = document.querySelector('#myLike');
  ReactDOM.render(<MyLikeButton/>, domContainer);

  // .tsx ----> .jsx ----> .js
  
  // typescript + @types/react + @types/react-dom ----> react+react-dom + babel ----> .js


  /**
   *  
    type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];
    type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
    type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
    type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
    type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
    type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
    type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
    type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;

    type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;

    
    type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
    type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
    type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
    type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
    type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
    type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;
   */