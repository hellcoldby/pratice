const http = require('http');
const {URL} = require('url');
const fs = require('fs');
const querystring = require('querystring');
const PORT = 4000;
//设置跨域的白名单
const whitList = [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://yuntu.cloud.tencent.com'
]

    // const options = {
    //     key: fs.readFileSync('key.pem'),
    //     cert: fs.readFileSync('cert.pem')
    // };

const server = http.createServer((req, res)=>{

    const urlObj = new URL(req.url, 'http://localhost:'+ PORT);
    const {pathname, searchParams} = urlObj;
    console.log(pathname, searchParams);
    const tab_value  = searchParams.get('tab')
    const origin = req.headers.origin;
    // cors 跨域 主要是在后端设置 允许跨域的白名单
    if(whitList.includes(origin)){
        res.setHeader('Access-Control-Allow-Private-Network', true);
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Headers','name' );
        res.setHeader('Access-Control-Allow-Credentials',true );
    }

    // console.log(req.method);

    if(req.method === 'GET'){
     
        if(pathname === '/text'){
            const text_index = tab_value - 0;
            console.log(text_index);
            if(tab_value){
                fs.readFile('./text.json', 'utf8',(err, data)=>{

                    if(err){
                        res.writeHead(404, {'Content-type':'text/html; charset=utf-8'});
                    }else{
                        const _data = JSON.parse(data);
                        const getData = _data[text_index];
                        res.writeHead(200, {'Content-type':'text/html; charset=utf-8'});
                        if(getData){
                            res.write(JSON.stringify(getData));
                        }else{
                            res.write(`{"value":"数据库未找到对应数据"}`);
                        }
                    }
                   res.end();

                });
            }
        }

        if(pathname === '/tab'){
                fs.readFile('./tab.json', 'utf8',(err, data)=>{
                    if(err){
                        res.writeHead(404, {'Content-type':'text/html; charset=utf-8'});
                    }else{
                        const _data = JSON.parse(data);
                        res.writeHead(200, {'Content-type':'text/html; charset=utf-8'});
                        res.write(JSON.stringify(_data)); 
                    }
                   res.end();
                });
        }

  
    }

    if(req.method === 'POST'){
        console.log('post----')
        let body = '';
        let i = 0;
        req.on('data', function(data) {
            console.log(`第${++i}次收到数据`);
          body += data;
        });

        req.on('end', function() {

          if( req.body && Object.getPrototypeOf(req.body) === null){
             Object.setPrototypeOf(req.body, new Object());
          }

           const postParams = querystring.parse(body);
           console.log('POST parameters:', postParams);
           const text_index = postParams.tab - 0;
           if(postParams){
                fs.readFile('./text.json', 'utf8',(err, data)=>{

                    if(err){
                        res.writeHead(404, {'Content-type':'text/html; charset=utf-8'});
                    }else{
                        const _data = JSON.parse(data);
                        const getData = _data[text_index];
                        res.writeHead(200, {'Content-type':'text/html; charset=utf-8'});
                        if(getData){
                            res.write(JSON.stringify(getData));
                        }else{
                            res.write(`{"value":"数据库未找到对应数据"}`);
                        }
                        
                    }

                   res.end();

                });
            }
        });
    }
});

server.listen(PORT, function(){
    console.log('server start at: https://localhost:' + PORT);
});


function readFile (params, req, res) {

}