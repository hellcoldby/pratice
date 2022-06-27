let path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    mode: "development", // 两种模式  production or  development
    entry: "./src/index.js", //入口
    output: {
        filename: "bundle.js", //打包后的文件名
        path: path.resolve(__dirname, "build"), // 必须是绝对路径
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "test dev",
        }),
    ],
};
