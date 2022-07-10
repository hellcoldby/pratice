/**
 *  webpack-hot-middleware 热更新配置
 */
let path = require("path");
let webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackBar = require("webpackbar"); //进度条美化

module.exports = {
    mode: "development", // 两种模式  production or  development
    // entry: ["webpack-hot-middleware/client?reload=true", "./src/index.js"], //入口
    entry: "./src/index.js",
    output: {
        filename: "bundle.js", //打包后的文件名
        path: path.resolve(__dirname, "build"), // 必须是绝对路径
        publicPath: "/",
    },
    devtool: "source-map",
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "test dev",
            template: "./src/index.html",
        }),
        new WebpackBar({
            color: "#6aa84f", // 默认green，进度条颜色支持HEX
            basic: false, // 默认true，启用一个简单的日志报告器
            profile: false, // 默认false，启用探查器。
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/i, // 在js 中引入css
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};
