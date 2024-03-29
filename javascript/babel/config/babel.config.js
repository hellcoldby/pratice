
module.exports = {
    "presets": [
       [ "@babel/preset-env",
       {
           "targets":{
               "chrome":58,
               "ie":11
           },
           "useBuiltIns":"usage",
           "corejs":3
       }]
    ],
    "plugins":[
       [ "@babel/plugin-transform-runtime",
       {
           corejs:{
               version:3,
               proposals:true
           }
       }]
    ]
}