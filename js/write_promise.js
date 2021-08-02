/**
  * 1. promise 是个构造函数 
  * 有3个状态来记录执行的情况： pending（待执行） fulfilled（满足） rejected（拒绝）
  * 用一个变量 记录执行结果的最终值
  * 用一个变量 记录
  */

/**
 * 2. promise接收一个函数作为参数
 *    有两个回调参数： 一个代表成功fulFilled , 一个代表失败rejected,
 *    状态变化：pending ---> fulfilled --- 必须有一个回调的最终值
 *    状态变化：pending ---> rejected  --- 必须有一个被拒绝的原因
 */

/**
 * 3. promise 必须提供一个then 方法
 *    then(onFulfilled, onRejected) 有两个回调，一个在成功时候回调，一个在失败时候回调
 *    then 可以被多次调用
 */
 
  // const rP = new Promise(resolve=>{
  //   resolve('real');
  // });
  // rP.then(res=>{console.log(res);});
  // rP.then(res=> {console.log(res);})


  class MyPromise{
    constructor(fn){
      this.state = 'pending'; //状态
      this.value = undefined; //最终值

      const resolve = value =>{
        this.state = 'fulfilled';
        this.value = value;
      };

      const rejected = reason =>{
        this.state = 'rejected';
        this.value = reason;
      };

      try{
        fn(resolve, rejected);
      }catch(err){
        rejected(err)
      }
    }

    then(onFulfilled, onRejected){
       if(this.state === 'fulfilled'){
         onFulfilled(this.value);
       }

       if(this.state === 'rejected'){
         onRejected(this.value)
       }
    }
  }

  const p = new MyPromise(resolve=>{
    setTimeout(()=>{
      resolve('hahaha');
    },1000)
    
  })
  
  p.then(res=>{
    console.log(res);
  });
// 我们已经实现了前3个标准， 热庵后加入异步的定时器，发现then 回调没有任何反应

  /**
   * 4. 加入异步，then 方法执行的时候, promise的状态还是pending, 所以没反应。
   *    我们需要把then 方法的回调保存起来，等 resolve() 执行的时候，再调用
   */

   class MyPromise1{
    constructor(fn){
      this.state = 'pending'; //状态
      this.value = undefined; //最终值
      this.onFulfilled_ary = []; //成功时的队列
      this.onRejected_ary = []; //失败时的队列

      const resolve = value =>{
        this.state = 'fulfilled';
        this.value = value;
        //依次执行队列
        this.onFulfilled_ary.forEach(fn=> fn());
      };

      const rejected = reason =>{
        this.state = 'rejected';
        this.value = reason;
        //依次执行队列
        this.onRejected_ary.forEach(fn=>fn());
      };

      try{
        fn(resolve, rejected);
      }catch(err){
        rejected(err)
      }
    }

    then(onFulfilled, onRejected){
       if(this.state === 'fulfilled'){
         onFulfilled(this.value);
       }

       if(this.state === 'rejected'){
         onRejected(this.value)
       }

       if(this.state === 'pending'){
          this.onFulfilled_ary.push(()=>{
            onFulfilled(this.value);
          });
          this.onRejected_ary.push(()=>{
            onRejected(this.value);
          })
       }
    }
  }
  //测试 异步 成功
  const p1 = new MyPromise1(resolve=>{
    setTimeout(()=>{
      resolve('hahaha');
    },1000)
  })
  
  p1.then(res=>{
    console.log('p1',res);
  });
 
  // promise 的优势在于链式调用 promise().then().then()
  /**
   *  5. promise 可以 then 多次， 每次都返回一个新的 promise
   *  
   *  a. 如果then 的两个参数不是函数，后边的then依旧能获取 promise() 执行成功的值
   * 
   *  b. 如果then 的返回值 x 是一个普通值，就把这个结果作为参数，传入到下一个then 成功的回调中
   *  c. 如果then 抛出异常，就把这个异常作为参数，传递给下一个then的失败回调中
   *  d. 如果then 返回值 x 是一个promise, 那会等 promise 执行完 --- 执行成功走下一个then的成功
   *  执行失败走下一个then的失败函数
   *  
   *  e. 如果then 的返回值和 promise 是同一个引用对象，造成循环引用，则抛出异常，异常走下一个then的
   *  失败调用
   *  
   *  d. 如果then 的返回值 x 是一个 promise, 且 x 同时调用 resolve 函数 和 reject 函数，则第一次调用优先
   *  其他所有调用被忽略
   *  
   */

    class Promise3{
      constructor(fn){
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilled_ary = [];
        this.onRejected_ary = [];

        const resolve = value => {
          this.state = 'fulfilled';
          this.value = value;
        }

        const rejected = reason =>{
          this.state = 'rejected';
          this.reason = reason;
        }

        try{
          fn(resolve, rejected);
        }catch(err){
            rejected(err)
        }
      }

      then(onFulfilled, onRejected) {
        if(this.state === 'pending'){
          this.onFulfilled_ary.push(()=>{
            onFulfilled(this.value);
          });
          this.onRejected_ary.push(()=>{
            onRejected(this.reason);
          })
        }

        if(this.state === 'fulfilled'){
          onFulfilled(this.value)
        }

        if(this.state === 'rejected'){
          onRejected(this.reason)
        }
      }
    }