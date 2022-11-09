#### webpack 是一个 js 静态文件打包器。
- 默认会把相互引用的模块化js文件，合并为一个静态文件并输出。

#### webpack 配置文件为一个对象。
1. 默认命名为 webpack.config.js
2. 以node模块化的方式导出（common js) 
3. 通常会写两个配置，一个用于develop开发环境，一个用于production生产环境。

#### webpack四个核心概念
- entry : 文件入口
- output : 文件出口
- loader : loader工具转义更多的文件类型，成为js模块化文件
- plugin : 对loader转义后的文件优化和压缩等操作，loader做不到的事由插件plugin 完成。

-- 示例：webpack.config.js
```js
    module.exports = {
        entry:'',
        output:'',
        module:{
            rules:[],
            noParse://,
        },
        plugins:[]
    }
```


#### 配置文件书写格式
     
```js
    //webpack.config.js

    module.exports = {
        entry: './path/to/my/entry/file.js', //入口
         /** 入口也支持多文件
            entry: {
                app: './src/app.js',
                vendors: './src/vendors.js'
            },
        */
        output: {  //出口
            path: path.resolve(__dirname, 'dist'),
            filename: 'my-first-webpack.bundle.js'
        },
        module: {  
            //loader 转义各种文件为模块化 
            //--- 注意module是对象
            //--- 注意rules 为数组
            rules: [
                { test: /\.txt$/, use: 'raw-loader' }
            ],
            //--- 注意noParse, 不需要转义的文件
            noParse: /jquery|lodash/
        },
        plugins: [
            // plugin插件 实现loader 无法完成的事
            // --- 注意plugins 是数组
            // --- 插件以 new 实例化
            new HtmlWebpackPlugin({template: './src/index.html'})
        ]
    }
```
