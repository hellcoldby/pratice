const config = {
    "presets": [
       ["@babel/preset-env",{
        "targets":{
          "node":"current"
        }
       }]
    ],
    "plugins": [
        [
            "@babel/plugin-proposal-decorators",
            {
                "decoratorsBeforeExport": false
            }
        ]
    ]
}

module.exports = config;