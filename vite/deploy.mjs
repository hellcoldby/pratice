import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { Client } from 'node-scp'

import ora from 'ora';
const server = {
    host:'192.168.10.16',//服务器IP
    port:22,//服务器端口
    username:'root',//服务器ssh登录用户名
    password:'coldbao123',//服务器ssh登录密码
   
}
const loading = ora('正在部署至 ' + server.host  )
loading.start()


Client(server)
.then(client => {
    client.uploadDir(
      './storybook-static',
        '/www/https'
      // options?: TransferOptions
    ).then(res => {
        loading.stop()
        client.close(); // remember to close connection after you finish
        console.log('部署成功');
    })
    .catch(error => { console.log('部署失败'); throw error;})
}).catch(e => console.log(e))


// })
// scpClient.scp('./storybook-static/', server ,(err)=>{
// loading.stop()
//     if(err) {
//         console.log('部署失败')
//         throw err
//     }else {
//         console.log('部署成功')
//     }
// })
