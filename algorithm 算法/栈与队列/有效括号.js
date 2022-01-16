/**
 * 题目描述：判读 括号闭合的有效性
 * 
 * 例如： "()[]{}" --- true
 * "()" --- true
 * "(]" --- true
 * "([)]" --- true
 * "{[]}" --- true
 * 
 * 
 * 思路： 用栈（先进后出）
 */

const matchBracket = {
    "(":")",
    "[":"]",
    "{":"}"
};

function isVaild(str){
    if(!str) return true;

    const stack = [];
    const len = str.length;

    for(let i=0; i<len; i++){
        const chart = str[i];
        // 识别到的左括号，把对应的有括号推入到stack中
        if(chart === '(' || chart === "{" || chart === '['){
            stack.push(matchBracket[chart]);
        }else{
            //不能识别的括号,依次和 栈的顶端符号 做对比，不一样就说明括号无法闭合。
            if(chart !== stack.pop()){
                return false;
            }
            
        }
    }
}