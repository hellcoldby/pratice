const http = require('http');
const {URL} = require('url');
const PORT = 4000;
//设置跨域的白名单
const whitList = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://yuntu.cloud.tencent.com'
]

const server = http.createServer((req, res)=>{
    const urlObj = new URL(req.url, 'http://localhost:'+ PORT);
  
    const {pathname, searchParams} = urlObj;
      

    console.log(pathname, searchParams);
    const value  = searchParams.get('tab')
    const origin = req.headers.origin;
   

    // cors 跨域 主要是在后端设置 允许跨域的白名单
    if(whitList.includes(origin)){
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Headers','name' );
        res.setHeader('Access-Control-Allow-Credentials',true );
    }

    res.end(`[
        {
          "value": "hello world!!!${value}"
        }
      ]`)
    // if(pathname === '/getData'){
    //     const cb  = searchParams.get('cb')
    //     // res.writeHead(404, {'Content-type':'text/html; charset=utf-8'});
    //     // console.log(cb)
    //     res.end('I love u too')
    // }
});

server.listen(PORT, function(){
    console.log('server start at: http://localhost:' + PORT);
});