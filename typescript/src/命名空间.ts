// namespace 第一个作用是封装类似的代码
// 第二个作用是防止命名冲突
namespace a{
    //外部使用，需要用export 导出
    export class Dog{

    }
}

namespace b{
    //外部使用，需要用export 导出
    export class Dog{

    }
}

let dog = new b.Dog();