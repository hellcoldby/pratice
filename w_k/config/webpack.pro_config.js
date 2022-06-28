let path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackBar = require("webpackbar"); //进度条美化

module.exports = {
    mode: "production", // 两种模式  production or  development
    entry: ["./src/index.js"], //入口
    output: {
        filename: "bundle.js", //打包后的文件名
        path: path.resolve(__dirname, "../build"), // 必须是绝对路径
        // publicPath: "/",
    },

    plugins: [
        new CleanWebpackPlugin({}),
        new HtmlWebpackPlugin({
            title: "test dev",
            template: "./src/index.html",
        }),
        new WebpackBar({
            color: "#6aa84f", // 默认green，进度条颜色支持HEX
            basic: false, // 默认true，启用一个简单的日志报告器
            profile: false, // 默认false，启用探查器。
        }),
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
