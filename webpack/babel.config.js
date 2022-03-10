module.exports = (api) => {
    api.cache(true);
    return {
        plugins: [],
        presets: [
            [
                "@babel/preset-env",
                {
                    targets: {
                        node: "8.6",
                    },
                    useBuiltIns: "usage",
                },
            ],
        ],
    };
};
