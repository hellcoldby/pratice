module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            [
                "@babel/preset-env",
                {
                    targets: {
                        chrome: "67",
                    },
                    useBuiltIns: "usage",
                    corejs: 3,
                },
            ],
            "@babel/preset-react",
        ],
        plugins: [process.env.NODE_ENV === "production" ? {} : "react-refresh/babel"], //react热更新保存状态插件
    };
};
