let path = require("path");
const webpack = require("webpack");
module.exports = {
    mode: "development",
    entry: {
        react: ["react", "react-dom"],
    },
    output: {
        filename: "_dll_[name].js",
        path: path.resolve(__dirname, "../build/dll"),
        library: "_dll_[name]",
    },
    plugins: [
        new webpack.DllPlugin({
            name: "_dll_[name]",
            path: path.resolve(__dirname, "../build/dll", "manifest.json"),
        }),
    ],
};
