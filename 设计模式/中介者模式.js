/**
 * Mediator Pattern
 * 中介者模式
 * 
 * 使用者 调用封装好的方法
 */

// 聊天室封装好了方法给用户调用
class ChartRoom{
    constructor(){
        this.userList = {};
    }
    //用户注册
    register(user){
        this.userList[user.name] = user;
    }
    //用户离开
    leave(user){
        this.userList[user.name] = null;
        delete this.userList[user.name];
    }
    //广播消息
    broadcast(msg, from , to){
        if(to){
            to._receive(msg, from); //指定用户接收
        }else{
               console.log(`${from.name} to All : ${msg}`);
        }
    }
}


class User{
    constructor(name){
        this.name = name;
        this.chartRoom = null;
    }
    //进入聊天室 --- 调用聊天室注册register
    enterChartRoom(room) {
        this.chartRoom = room;
        this.chartRoom && this.chartRoom.register && this.chartRoom.register(this, room);
    }
    //离开聊天室 --- 调用聊天室离开leave
    leaveChartRoom() {
        this.chartRoom && this.chartRoom.leave && this.chartRoom.leave;
    }
    //发送消息 --- 调用聊天室广播broadcast
    send(msg, to){
        this.chartRoom.broadcast(msg, this, to);
    }
    //接收消息 
    _receive(msg, from){
        console.log(`${from.name} to ${this.name} : ${msg}`)
    }
}


/**
 *  4个用户注册了聊天室
 *  每个用户都能发消息 也能给指定的用户发消息
 */

//注册用户
const Yoko = new User('Yoko');
const John = new User('John');
const Paul = new User('Paul');
const Ringo = new User('Ringo');

//进入聊天室
const chartRoom = new ChartRoom();
Yoko.enterChartRoom(chartRoom);
John.enterChartRoom(chartRoom);
Paul.enterChartRoom(chartRoom);
Ringo.enterChartRoom(chartRoom);


//发送消息
Yoko.send('I love you John.');
John.send('Hey, no need to broadcast', Yoko);
Paul.send('Ha, I heard that!');
Ringo.send('Paul, what do you think?', Paul);
