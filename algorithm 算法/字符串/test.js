function test(str){
    let i = 0, j = str.length - 1; 

    //1. 左右相等向中间靠拢
    while(i<j && str[i] === str[j]){
        i++;
        j--;
    }

    //2. 左右不等，左侧增加一位，然后向中间靠拢
    if(loop(i+1, j, str)){
        return true
    }

    if(loop(i, j-1, str)){
        return true;
    }

    return false;



    function loop(l, r, str){   
        while(l < r){
            if(str[l] !== str[r]){
                return false;
            }
            l++;
            r--;
        }       
        return true;                 
    }


}

let str = 'abcdeda';
test(str);