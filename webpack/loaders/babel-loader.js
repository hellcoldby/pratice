const babel = require('@babel/core');
const loaderUtils = require('loader-utils')
function loaders(content, map, mate){
    // console.log(Object.keys(this));
    let cb = this.async();
    
    const options = loaderUtils.getOptions(this);
 
    babel.transform(content,{
        ...options,
        sourceMap:true,

    },(err, res)=>{
       res && cb(err, res.code, res.map)
    })
    // return content;
}
module.exports = loaders;