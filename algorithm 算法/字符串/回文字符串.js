/**
 * 回文字符串 --->  'yessey'  --- 正反读都一致的字符串
 * 
 * 描述：
 * 给定一个非空字符串 s，最多删除一个字符。判断是否能成为回文字符串。
 * 
 * 举例：
 * let str = 'abca';  //删除b 或 c 成为回文字符串
 * 
 * 思路：
 * 我们初始化两个指针： 一个指向头部， 一个指向尾部
 */

function validPalindrome (str) {
    const len = str.length;
    //指针
    let i=0, j= len - 1;

    //前后字符一致 指针就一起往中间移动
    while(i<j && str[i] === str[j]){
        i++;
        j--;
    }
    //前后字符不一致，左指针移到下一位 和 右指针做对比。
    if(isPalindrome(i+1, j, str)){
        return true
    }

    //前后字符不一致，右指针往前移一位 和 做指针做对比
    if(isPalindrome(i, j-1, str)){
        return true
    }

    return false;
}

function isPalindrome(l_index, r_index, str){
    while(l_index < r_index){
        if(str[l_index] !== str[r_index]){
            return false;
        }
        l_index ++;
        r_index --;
    }
    return true;
}