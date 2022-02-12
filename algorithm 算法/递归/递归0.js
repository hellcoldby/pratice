/**
 *  描述：给定一个没有重复数字的序列，返回其所有可能的全排列
    输入: [1,2,3]
    输出: [
        [1,2,3],
        [1,3,2],
        [2,1,3],
        [2,3,1],
        [3,1,2],
        [3,2,1]
    ]

    思路： DFS 深度遍历 递归 穷举法  （变化的序列中，不变 ——  坑位的数量）
    1. 第一个坑位， 有三种可能， 用掉一位
    2. 第二个坑位， 有两种个能， 又用掉一位
    3. 第三个坑位， 只有一种可能

    借鉴遍历二叉树的经验 ，通过判断数组的可选数字是否为空，来决定当前是不是走到了递归边界。
   可以做得更简单：坑位的个数是已知的，我们可以通过记录当前坑位的索引来判断是否已经走到了边界：
   比如说示例中有 n 个坑，假如我们把第 1 个坑的索引记为 0 ，那么索引为 n-1 的坑就是递归式的执行终点，索引为 n 的坑（压根不存在）就是递归边界。

   填坑时，每用到一个数字，我们都要给这个数字打上“已用过”的标——避免它被使用第二次；数字让出坑位时，对应的排列和 visited 状态也需要被及时地更新掉。
 */

const array = [1,2,3];

function premute(ary){
    const len = ary.length;
    const visited = {};
    const tmp =[];
    const res = [];

    function dfs(nth){  //参数nth是坑位
        if(nth === len){
            res.push(tmp.slice());
            return;
        }

        for(let i=0; i<len; i++){
            if(!visited[ary[i]]){
                visited[ary[i]] = 1;
                tmp.push(ary[i]);
                dfs(nth+1); //坑位增加，递归填坑
                tmp.pop();
                visited[ary[i]] = 0;
            }
        }
    }

    dfs(0)

    return res;
}

const res = premute(array);
console.log(res);