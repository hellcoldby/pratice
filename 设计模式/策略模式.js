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
  