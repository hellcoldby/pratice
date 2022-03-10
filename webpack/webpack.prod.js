const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/index.js",
        print: "./src/print.js",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true, // 每次输出先清空dist目录
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/i, // 在js 中引入css
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i, //js中引入图片
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i, // 引入自定义字体
                type: "asset/resource",
            },
            {
                test: /\.(csv|tsv)$/i, //引入数据库
                use: ["csv-loader"],
            },
            {
                test: /\.xml$/i,
                use: ["xml-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "管理输出",
        }),
    ],
};
