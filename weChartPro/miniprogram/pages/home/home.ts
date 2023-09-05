Page({
    data:{
        clickEnter:false,
        proNum:99,
    },
    clickIn: function() {
        console.log('点击加载进度条')
        this.setData({clickEnter:true});
        const timer = setInterval(()=>{
            let num =   ++ this.data.proNum;
            if(this.data.proNum >= 100){
                num = 100;
                wx.navigateTo({
                    url:'../3d/3d',
                    events: {

                    },
                    success: function(res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
                      }
                })
                
                clearInterval(timer);
            }
            console.log(this.data.proNum);
            this.setData({proNum: num })
        },100)
    }
})