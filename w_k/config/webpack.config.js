/**
 *  devServer 热更新配置
 */
const common_config = require("./common.config");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
module.exports = {
    ...common_config,
    mode: "development", // 两种模式  production or  development
    entry: ["./src/index.js"],
    devtool: "source-map",
    optimization: {
        splitChunks: {
            // 分割代码块
            cacheGroups: {//缓存组
                commons: {    //公共模块
                    name: "commons",
                    chunks: "initial", //入口引用
                    minChunks: 2, // 引用次数 
                },
                vendors: {
                    //拆分第三方模块到单独的文件中
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    priority:1, //先抽离第三方， 权重
                },
            },
        },
    },
    devServer: {
        hot: true,
        open: true,
        // static: [
        //     {
        //         directory: path.join(__dirname, "dll"),
        //     },
        // ],
    },
    plugins: [...common_config.plugins, new ReactRefreshWebpackPlugin()],
};
