const http = require('http')
const WebSocket = require('ws')
const express = require('express')
const crypto = require('crypto')
const BAR_DATA_MAX = 120

function randomNumber(max) {
  return parseInt(Math.random() * max, 10)
}

function isSignatureOK(body) {
  const secretKey = 'xrck1Mgi0IxVjS08B3xxxxxxxxxxxxxx'
  const receivedSignature = body.TcvSignature
  // TcvSignature 不参与签名
  delete body.TcvSignature
  const params = Object.entries(body)
  // 升序排列字段
  params.sort(([key1], [key2]) => {
    if (key1 > key2) {
      return 1
    }
    if (key1 < key2) {
      return -1
    }
    return 0
  })
  // 生成签名字符串
  const signStr = params.map(kv => kv.join('=')).join('&')
  console.log(signStr)
  // 计算签名
  const signature = crypto.createHmac('sha256', secretKey).update(signStr).digest().toString('base64')
  console.log(`signature=${signature}, receivedSignature=${receivedSignature}`)
  // 比较签名结果是否相同
  return signature === receivedSignature
}

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({
  server
})
wss.on('connection', (ws) => {
  console.log('client connected')
  let heartbeatTimer
  const heartbeat = () => {
    clearTimeout(heartbeatTimer)
    heartbeatTimer = setTimeout(() => {
      ws.terminate()
    }, (31 + 10) * 1000)
  }
  // 连接一建立则设置心跳检测
  heartbeat()
  // 10秒内没有收到 Connect 消息，强制关闭连接
  const connectTimer = setTimeout(() => {
    if (!ws.receivedConnectMsg) {
      ws.terminate()
    }
  }, 10 * 1000)
  ws.on('message', (msg) => {
    
    // 收到消息，则更新心跳计时器，因为如果没有消息，将会在设定时间内收到心跳包
    heartbeat()
    const data = JSON.parse(msg)
    console.log('received msg', data)
    
    // 在没有收到 Connect 消息之前，丢弃任何消息
    if (!ws.receivedConnectMsg & data.action !== 'Connect') {
      return
    }
    // 处理来自客户端的消息
    switch (data.action) {
      case 'Connect': {
        ws.receivedConnectMsg = true
        clearTimeout(connectTimer)
        // 签名校验失败，断开连接
        // if (!isSignatureOK(data.body)) {
        //   ws.terminate()
        // }
        break
      }
      // 来自客户端的心跳包 Ping 消息，回应 Pong 消息
      case 'Ping': {
        ws.send(JSON.stringify({
          version: 1,
          action: 'Pong'
        }))
        break
      }
      default:
        break
    }
  })
})
// 更新大屏联动变量
app.get('/change-tab', (req, res, next) => {
  wss.clients.forEach(ws => {
    ws.send(JSON.stringify({
      version: 1,
      action: 'UpdateGlobalField',
      body: {
        tabValue: '2'
      }
    }))
  })
  res.json({
    code: 0,
    msg: 'ok'
  })
})
// 更新大屏图表
app.get('/refresh-chart', (req, res, next) => {
  console.log('get path ----',req.path)
  wss.clients.forEach(ws => {
    ws.send(JSON.stringify({
      version: 1,
      action: 'UpdateComponentData',
      body: [
        {
          "id": "component/TextBasic_1_0_16_3_1679646684559348",
          "data": [
            {
              "value": "socket 服务已经接入"
            }
          ]
        },
        {
          "id": "component/TextBasic_1_0_16_4_1679885815420216",
          "data": [
            {
              "value": "socket 服务已经接入!!!!"
            }
          ]
        }
      ]
    }))
  })
  res.json({
    code: 0,
    msg: 'ok'
  })
})
server.listen(3000, function(){
    console.log('start 3000')
})