const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const app = express();
const config = require("./webpack.dev_config.js");
const compiler = webpack(config);

const open = require("open");
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    })
);
app.use(
    webpackHotMiddleware(compiler, {
        // log: console.log,
        reload: true,
        // heartbeat: 10 * 1000,
    })
);
// Serve the files on port 3000.
app.listen(3000, function () {
    console.log("Example app listening on port 3000!\n");
});

open("http://localhost:3000");
