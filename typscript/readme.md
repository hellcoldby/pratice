## 编译TS
- typescript 要求用 ``` .ts ```作为文件的结尾
- ``` .ts ```文件无法直接在浏览器执行，需要先转换为 js

## 如何转换
- 先安装转译器  ``` npm install -g typescript ```
- terminal (终端)输入：``` tsc xx.ts  ``` 回车 会生成 ``` xx.js```

## 转换react 文件
- ```xx.tsx ``` 作为react文件的结尾
- ``` tsc xx.tsc ``` 会转换失败
原因： typescript 默认不支持 react 类型文件，也不认识 react 相关的关键字和类型


### 第一步，增加描述文件
- typescript 支持以 ```xx.d.ts``` 结尾的描述文件
- 那么，增加react 描述文件 ---> react.d.ts  和 react-dom.d.ts （由react 社区提供）
```typescript
    yarn add @types/react
    yarn add @types/react-dom
```

### 第二步，增加配置文件
- tsc 命令会默认读取 tsconfig.json 配置文件。
- 配置文件里可以设置 支持的转译格式 类型，以及指定要转译哪些文件
- 生成配置文件
    ```参考： https://segmentfault.com/a/1190000022809326```
    1. 项目根目录执行：```tsc --init```
    2. 生成配置文件， tsc 命令会自动读取
        ``` json
            {
                "compilerOptions": {
                    "target": "ES5",             // 目标语言的版本
                    "module": "commonjs",        // 指定生成代码的模板标准
                    "noImplicitAny": true,       // 不允许隐式的 any 类型
                    "removeComments": true,      // 删除注释 
                    "preserveConstEnums": true,  // 保留 const 和 enum 声明
                    "sourceMap": true            // 生成目标文件的sourceMap文件
                },
                "files": [   // 指定待编译文件
                    "./src/index.ts"  
                ]
            }
         ```
    

### TS --- 描述类型

1. 基本类型 number、boolean、string、null、 undefined
    ```javascript
    let a:number = 1;
    let b:any; //任意类型
    let c = 'hello'; //类型推导为 string
    ```
2. 对象类型 
    ``` javascript
        interface infoType {
            name:string;
            age: number;
        }

        let tom: infoType = {
            name: 'tom',
            age: 17
        }
    ```
3. 数组类型

``` javascript
    let array: number[] = [1,2,3];
    let array: string[] = ['a','b', 'c'];
    let array: any[] = [1, 2, 3, 'a', 'b', 'c', {age:'tom'}];
```
- 元组类型
``` javascript
    let tom: [string, number] = ['Tom', 25]; 
```


4. 函数类型
``` javascript
    interface infoType {
        name:string;
        age: number;
    }


    function setUser(info:infoType, like:string = 'code', ...items:any[]):any {
     
    }
    setUser({name:'tom', age:17});

    function test(){
         let args: IArguments = arguments;  //ts固定用法 IArguments --- 描述参数
    }
    
```



5. 联合类型
- type --- 声明基本类型、对象类型、联合类型、元组类型
  

    ```javascript
        type isString = string; 
        type union = sting | number;
        let age:union = 12；
    ```

    ```javascript
        type eventName = 'click'|'scroll'|'mouseove';
        function handleEvent(event:eventName){

        }
    ```
    ```javascript
        interface A {
            name: string;
        }

        interface B {
            sex: number;
        }

        function test(a: A | B) {};

        type check = A | B;
        function test(a: check){};


    ```
- 扩展：type 和 interface 的区别 https://blog.csdn.net/glorydx/article/details/112625953

    ```javascript
        type person = {
            name: string;
            age: number;
        }

        interface person {
            name: string;
            age: 12;
        }
    ```
