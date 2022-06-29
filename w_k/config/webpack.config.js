/**
 *  devServer 热更新配置
 */
const common_config = require("./common.config");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
module.exports = {
    ...common_config,
    mode: "development", // 两种模式  production or  development
    entry: ["./src/index.js"],
    devServer: {
        hot: true,
        open: true,
    },
    plugins: [new ReactRefreshWebpackPlugin(), ...common_config.plugins, new webpack.HotModuleReplacementPlugin()],
};
