const WebpackBar = require("webpackbar"); //进度条美化
const HtmlWebpackPlugin = require("html-webpack-plugin"); //加载html 文件
// const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //清空打包文件夹
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const common_config = {
    entry: {
        app: { import: "./src/index.js", dependOn: "react-vendors" },
        "react-vendors": ["react", "react-dom"],
    }, //入口
    output: {
        filename: "js/[name].js", //打包后的文件名
        path: path.resolve(__dirname, "../build"), // 必须是绝对路径
        publicPath: "/",
    },
    resolve: {
        // 解析第三方包

        extensions: [".js", ".jsx"],
        // mainFields: ["style", "main"], //先查找包里的style 文件，再查找main 文件
        // mainFiles:[], //指定入口文件
    },
    plugins: [
        // new CleanWebpackPlugin({}), //清空打包目录
        new HtmlWebpackPlugin({
            //html 模板入口
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
                test: /\.html$/,
                use: "html-withimg-loader", //html文件 中的图片解析
            },
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
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[local]_[hash:base64:5]",
                            },
                        },
                    },
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
                                localIdentName: "[local]_[hash:base64:5]",
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
                            outputPath: "img", //打包后磁盘位置
                            // publicPath: "./img", //发布后网络资源位置
                            esModule: false,
                        },
                    },
                ],
                type: "javascript/auto",
            },
        ],
    },
};

module.exports = common_config;
