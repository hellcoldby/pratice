/**
 *  devServer 热更新配置
 */
const webpack = require('webpack');
const common_config = require("./common.config");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const FileListPlugin = require('../plguins/FileListPlugin');
module.exports = {
    ...common_config,
    mode: "development", // 两种模式  production or  development
    entry: ["./src/index.js"],
    devtool: "source-map",
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2,
                },
                vendors: {
                    //拆分第三方模块到单独的文件中
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    priority:1,
                    filename: 'js/[name]/bundle.js',
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
    plugins: [
        ...common_config.plugins,
        new ReactRefreshWebpackPlugin(),
        // new BundleAnalyzerPlugin()
        new FileListPlugin({
            filename:'list.md'
        })
    ],
};
