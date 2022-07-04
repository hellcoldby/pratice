let path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackBar = require("webpackbar"); //进度条美化
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    mode: "production", // 两种模式  production or  development
    entry: ["./src/index.js"], //入口
    output: {
        filename: "[name].js", //打包后的文件名
        path: path.resolve(__dirname, "../build"), // 必须是绝对路径
        // publicPath: "/",//发布后网络资源位置
    },
    devtool: "source-map",
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
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
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
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
            {
                test: /\.less$/i, // 在js 中引入css
                use: [
                    // "style-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                mode: "local",
                                localIdentName: "[local]_[hash:base64:5]",
                                localIdentContext: path.resolve(__dirname, "src"),
                            },
                        },
                    },
                    "less-loader",
                ],
            },
            {
                test: /\.(jpg|png|gif)/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            esModule: false,
                            outputPath: "img", //打包后磁盘位置
                            // publicPath: "./img", //发布后网络资源位置
                        },
                    },
                ],
                type: "javascript/auto",
            },
        ],
    },
    watch: true,
    watchOptions: {
        poll: 100, //每秒问我100次
        aggregateTimeout: 500, //停止输入后等待多久触发
        ignored: /node_modules/, //不需要监控的目录
    },
};
