const fs = require('fs');
const path = require('path');


/**
 * babylon 主要就是把源码 转换成ast
 * @babel/traverse
 * @babel/types
 * @babel/generator
 */

class Compiler{
    constructor(config){
        this.config = config;
        //保存入口文件的路径
        this.entryId;
        //保存所有模块的依赖
        this.modules = {}
        this.entry = config.entry; //入口路径
        this.root = process.cwd();
    }
    //获取源码
    getSource(modulePath){
        let content = fs.readFileSync(modulePath, 'utf8');
        return content
    }

    // 解析源码  --- 依靠AST 解析语法树 需要用到babel相关的插件
    parse(source, parentPath) {
        console.log(source, parentPath);
    }

    //构建模块
    buildModule(modulePath, isEntry){
        //获取源码
        let source = this.getSource(modulePath);
        // 模块id --- 绝对路径modulePath 转换为 相对路径this.root
        let moduleName = './' + path.relative(this.root, modulePath);
        console.log('------文件源码', source);
        console.log('-----模块相对路径', moduleName);

        if(isEntry){
            this.entryId = moduleName; //保存入口的名字
        }

        // 解析把源码source 进行改造，返回一个依赖列表
        let {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName)); // ./src

        // 把相对路径和模块中的内容 对应起来
        this.modules[moduleName] = sourceCode;
    } 
    //发射文件
    emitFile(){}

    run(){
        //执行 并且创建模块的依赖关系
        this.buildModule(path.resolve(this.root, this.entry), true);

        //发射 打包后的文件
        this.emitFile();
    }
}
module.exports = Compiler;