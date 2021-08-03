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
 


// 我们已经实现了前3个标准， 热庵后加入异步的定时器，发现then 回调没有任何反应

  /**
   * 4. 加入异步，then 方法执行的时候, promise的状态还是pending, 所以没反应。
   *    我们需要把then 方法的回调保存起来，等 resolve() 执行的时候，再调用
   */

 
  // promise 的优势在于链式调用 promise().then().then()
  /**
   *  5. promise 可以 then 多次， 需要每次都返回一个新的 promise
   *  
   *  a. 首先如果then 的两个参数都不是函数，忽略，后边的then依旧能获取 promise() 执行成功的值
   * 
   *  b. 如果then 的返回值 x 是一个普通值，就把这个结果作为参数，传入到下一个then 成功的回调中
   *  c. 如果then 抛出异常，就把这个异常作为参数，传递给下一个then的失败回调中
   * 
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

        const reject = reason =>{
          this.state = 'rejected';
          this.reason = reason;
        }

        try{
          fn(resolve, reject);
        }catch(err){
            reject(err)
        }
      }

      then(onFulfilled, onRejected) {

        //1. then 返回的必须是个新的promise 才能链式调用
        //1.2 在新的promise内部，处理 onFulfilled 返回值x

        //2. 需要一个函数来处理 返回值x 的逻辑


        const promise2 = new MyPromise((resolve, reject)=>{

          if(this.state === 'pending'){

            this.onFulfilled_ary.push(()=>{
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject)
            });

            this.onRejected_ary.push(()=>{
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject)
            })
          }
  
          if(this.state === 'fulfilled'){
             let x = onFulfilled(this.value)
             resolvePromise(promise2, x, resolve, reject)
          }
  
          if(this.state === 'rejected'){
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject)
          }
        });
        return promise2;
      }

      //2. 处理返回值x的逻辑
      resolvePromise(promise2, x, resolve, reject){
        //2.1 判断 返回值x 存不存在， 是不是promise
        //    - 是： 
        //    - 不是： 作为新promise 执行成功 或失败的结果
        if(x != null && (typeof x === 'object') || typeof x === 'function'){

        }else{
          resolve (x);
        }
        
      }

    }


    const rp = new Promise(resolve=>{
      resolve('abc')
    });
    rp.then(res=>{
      // return function (){console.log(234);}
      return {a:1}
    }).then(res=>{
      console.log(res);
    })