/**
 * 用户需要满足以下条件才能看到文章
 * 1. 掘金用户
 * 2. 等级在1级以上
 * 3. 前端开发
 * 4. 不是游客
 */

//常规的写法
function checkAuth(data) {
    if (data.role !== 'juejin') {
      console.log('不是掘金用户');
      return false;
    }
    if (data.grade < 1) {
      console.log('掘金等级小于 1 级');
      return false;
    }
    if (data.job !== 'FE') {
      console.log('不是前端开发');
      return false;
    }
    if (data.type !== 'eat melons') {
      console.log('不是吃瓜群众');
      return false;
    }
  }
  
  //改写为策略模式  
  //判断整合
  const strategies = {
    checkRole: value => value === 'juejin',
    checkGrade: value => value >= 1,
    checkJob: value => value === 'FE',
    checkType: value=> value === 'eat melons',
  } 

  //校验
  class Validator{
    constructor(){
      this.checkList = [];
    }

    add(value, method){
      this.checkList.push(()=>{
        strategies[method](value);
      });
    }

    check(){
      for(let i=0; i<this.checkList.length; i++){
        const item = this.checkList[i];
        const res = item();
        if(!res){
          return false;
        }
      }
      return true;
    }

  }