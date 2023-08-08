interface TinitToPage{
  onLoad:(e:any)=>void;
  switch:(e:any)=>void;
  addToFront:(e:any)=>void;
  subtractToFront:(e:any)=>void;
  addNumberToFront:(e:any)=>void;
}
interface TinitToData{
  [key:string]:any
}

Page<TinitToData, TinitToPage>({
  data:{
    time: '',
    msg: 'Hello world',
    a:1,
    b:2,
    c:3,
    len:4,
    array: [
      {
        message:'foo',
      },{
        message:'bar'
      }
    ],
    objectArray: [
      {id: 5, unique: 'unique_5'},
      {id: 4, unique: 'unique_4'},
      {id: 3, unique: 'unique_3'},
      {id: 2, unique: 'unique_2'},
      {id: 1, unique: 'unique_1'},
      {id: 0, unique: 'unique_0'},
    ],
    numberArray: [1, 2, 3, 4]
  },
  onLoad: function () {
    setInterval(() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      const second = String(now.getSeconds()).padStart(2, '0');

      const dateTime:string = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      this.setData({
        time: dateTime
      });
    }, 1000);
  },

  switch: function(e) {
    const length = this.data.objectArray.length
    for (let i = 0; i < length; ++i) {
      const x = Math.floor(Math.random() * length)
      const y = Math.floor(Math.random() * length)
      const temp = this.data.objectArray[x]
      this.data.objectArray[x] = this.data.objectArray[y]
      this.data.objectArray[y] = temp
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addToFront: function(e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{id: length, unique: 'unique_' + length}].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  subtractToFront: function(){
    const length = this.data.objectArray.length
    if(length>1){
      this.data.objectArray.shift();
      this.setData({
        objectArray:  this.data.objectArray
      })
    }
  },
  addNumberToFront: function(e){
    this.data.numberArray = [ this.data.numberArray.length + 1 ].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  }
})
