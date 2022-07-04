/**
 *  devServer 热更新配置
 */
const common_config = require("./common.config");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
    ...common_config,
    mode: "development", // 两种模式  production or  development
    entry: ["./src/index.js"],
    devtool: "source-map",
    devServer: {
        hot: true,
        open: true,
        static: "../build",
    },
    plugins: [new ReactRefreshWebpackPlugin(), ...common_config.plugins],
};
