module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            [
                "@babel/preset-env",
                {   
                    loose:true,
                    targets: {
                        chrome: "67",
                    },
                    useBuiltIns: "usage",
                    corejs: 3,
                },
            ],
            "@babel/preset-react",
        ],
        plugins: [
             //react热更新保存状态插件
            process.env.NODE_ENV === "production" ? {} : "react-refresh/babel",
            ["@babel/plugin-proposal-decorators",{
                "legacy": true,
                // decoratorsBeforeExport:false,
            }],
            ["@babel/plugin-proposal-class-properties", { "loose": true}]
        ],
    };
};
