/**
 * 给定一个包括  n 个整数的数组  nums  和 一个目标值  target。
 * 
 * 找出  nums  中的三个整数，使得它们的和与  target  最接近。
 * 返回这三个数的和。
 * 假定每组输入只存在唯一答案。
 * 
 * 
 * 输入：nums = [-1,2,1,-4], target = 1
 * 输出：2
 * 解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
 */



/**
 * 思路： 
 * 1. 按照升序排列数组
 * 1. 三个整数，取最小值第一个作为基准
 * 2. 查找下一个 和 最后一个  记录三个数的和和目标值的差值作为最小差值目标。
 * 3. 如果 三个数的和大于目标 那最后一个向前移动一位。
 * 4. 如果 三个数的和小于目标 那下一个向后移动一位。
 */

function callBackSum(nums, target){
    let len = nums.length;
    if(len === 3){
        return getSum(nums);
    }


    //1. 先排序
    const _nums = nums.sort((a,b)=> a -b);

    //2. 设置最小值、 差值、 结果
    let min = Infinity;
    let diff = 0;
    let res = null;

    //3.循环
    for(let i=0; i<len-3; i++){
        let basic = nums[0];
        let next = i+1;
        let last = len - 1;

        while(next < last){
            let sum = basic + nums[next] + nums[last];
            diff = Math.abs(sum - target);
            if(diff<min){
                min = diff;
                res = min;
            }

            if(sum> target){
                last --;
            }else if(sum < target){
                next ++;
            }else{
                return;
            }
        }

        return res;
    }




    // 求和
    function getSum(nums){
        return nums.reduce((total, cur)=> total + cur, 0);
    }

}

const nums = [-1,2,1,-4];
const target = 1;

const res = callBackSum(nums, target);
console.log(res);