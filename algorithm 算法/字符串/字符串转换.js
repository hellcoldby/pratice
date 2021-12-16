/**
 *  字符串与数字之间的转换问题
 * 
 * 藐视： 请你来实现一个函数，使其能将字符串转换成整数。
 * 
 * 示例：
 *  输入: "42"
    输出: 42

    输入: " -42"
    输出: -42
    解释: 第一个非空白字符为 '-', 它是一个负号。

    输入: "4193 with words"
    输出: 4193
    解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。


    输入: "words and 987"
    输出: 0
    解释: 第一个非空字符是 'w', 但它不是数字或正、负号。 因此无法执行有效的转换。


    输入: "-91283472332" 
    输出: -2147483648
    解释: 数字 "-91283472332" 超过 32 位有符号整数范围。因此返回 INT_MIN (−2^31) 。
 * 
 * 
 *  思路：
 *  你拿到字符串先去空格；
    你识别开头的“+”字符和“-”字符；
    你见到非整数字符就刹车；
    数值范围为 [−2^31, 2^31 − 1]
 * 
 */
    const myAtoi = function(str) {
        // 编写正则表达式
        const reg = /\s*([-\+]?[0-9]*).*/
        // 得到捕获组
        const groups = str.match(reg)
        // 计算最大值
        const max = Math.pow(2,31) - 1
        // 计算最小值
        const min = -max - 1
        // targetNum 用于存储转化出来的数字
        let targetNum = 0
        // 如果匹配成功
        if(groups) {
            // 尝试转化捕获到的结构
            targetNum = +groups[1]
            // 注意，即便成功，也可能出现非数字的情况，比如单一个'+'
            if(isNaN(targetNum)) {
                // 不能进行有效的转换时，请返回 0
                targetNum = 0
            }
        }
        // 卡口判断
        if(targetNum > max) {
            return max
        } else if( targetNum < min) {
            return min
        }
        // 返回转换结果
        return targetNum
    };


