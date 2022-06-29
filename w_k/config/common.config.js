const WebpackBar = require("webpackbar"); //进度条美化
const HtmlWebpackPlugin = require("html-webpack-plugin"); //加载html 文件
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //清空打包文件夹

const path = require("path");
const common_config = {
    entry: ["./src/index.js"], //入口
    output: {
        filename: "bundle.js", //打包后的文件名
        path: path.resolve(__dirname, "../build"), // 必须是绝对路径
        // publicPath: "/",
    },
    resolve: {
        extensions: [".js", ".jsx"],
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

module.exports = common_config;
