// if(__dirname.endsWith('src')){
    debugger;
    require('@babel/register')({
        extensions:['js', 'ts'],
        ...require('../config/babel.config')
    })
// }