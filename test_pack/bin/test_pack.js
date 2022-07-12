#! /usr/bin/env node



// 1) 找到配置文件 webpack.config.js
let path = require('path');
let config = require(path.resolve('webpack.config.js'));

let Compiler = require('../lib/Compiler');
let compiler = new Compiler(config);

// 标识运行编译
compiler.run();