class FileListPlugin {
    apply(compiler){
        compiler.hook.emit.tapAsync('FileListPlugin',()=>{
    
        });
    }
}