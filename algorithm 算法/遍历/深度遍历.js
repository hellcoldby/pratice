/**
 * 深度优先遍历  DFS
 * 
 * 二叉树的遍历方式
 * 
 */
 const root = {
    val: "A",
    left: {
      val: "B",
      left: {
        val: "D"
      },
      right: {
        val: "E"
      }
    },
    right: {
      val: "C",
      right: {
        val: "F"
      }
    }
  };

// 所有遍历函数的入参都是树的根结点对象
 function preOrder(root) {
    // 递归边界，root 为空
    if(!root) {
        return 
    }
     
    // 输出当前遍历的结点值
    console.log('当前遍历的结点值是：', root.val);
    // 递归遍历左子树 
    preOrder(root.left);
    // 递归遍历右子树  
    preOrder(root.right);
}


preOrder(root);