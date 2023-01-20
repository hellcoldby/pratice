
function jsonP({url, params, cb}){
    return new Promise((resolve,reject)=>{

       const script = document.createElement('script');
       window[cb] = function(data){
            resolve(data);
            document.body.removeChild(script);
       }
       params = {...params, cb};
       let arr = [];
       for(let key in params){
            arr.push(`${key}=${params[key]}`);
       }
      

     
       script.src = `${url}&${ arr.join('&')}`;
       document.body.appendChild(script);
      
    })
}

jsonP({
    url:'https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web',
    params:{wd:'b'},
    cb:'show'
}).then(data=>{
    console.log(data);
})

