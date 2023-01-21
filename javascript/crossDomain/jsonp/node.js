const http = require('http');
const {URL} = require('url');
const PORT = 3000;
const server = http.createServer((req, res)=>{
    const urlObj = new URL(req.url, 'http://localhost:'+ PORT);
    console.log(urlObj);
    const {pathname, searchParams} = urlObj;
    console.log(searchParams);
    
    if(pathname === '/say'){
        const cb  = searchParams.get('cb')
        console.log(cb)
        res.end(`${cb}('I love u too')`)
    }
});

server.listen(PORT, function(){
    console.log('server start at: http://localhost:' + PORT);
});