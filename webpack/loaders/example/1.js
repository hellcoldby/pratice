console.log(__dirname);
console.log(__filename);

const path = require('path');
const strPath = '/Users/an/Desktop/pratice/webpack/loaders/example/1.js';

//获取文件名
console.log('文件名: '+ `${path.basename(strPath)}`);
//获取后缀名
console.log('获取后缀: '+ `${path.extname(strPath)}`);
// 拼接路径
console.log(`拼接路径：${path.join(__dirname + "/abc.js")}`);

// 绝对路径
console.log(`判断路径是否为绝对路径 absolute: ${path.isAbsolute(strPath)}`); 