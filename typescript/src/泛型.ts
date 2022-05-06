namespace a{
    //函数泛型
    function createArray<T>(length: number, value: T): Array<T> {
        let res:Array<T> = [];
        for(let i=0; i<length; i++){
            res[i] = value;
        }
        return res; 
    }

    // 多个泛型
    // 交换两个变量的值 
    function swap<T,U>(tuple: [T, U]): [U, T] {
        return [tuple[1], tuple[0]];
    }
    swap<string, number>(['a', 1]);

    //默认泛型 --- 默认类型为字符串
    function setArray<T = string>(length:number):T|null{
        let t: T | null = null;
        return t
    }


}

namespace b{
    //类泛型
    class MyArray<T>{
        private list: T[] = [];
        add(val: T){
            this.list.push(val);
        }
        getMax(): T{
            let result:T = this.list[0];
            for(let i=0; i<this.list.length; i++){
                if(this.list[i] > result){
                    result = this.list[i];
                }
            }
            return result;
        }
    }
}

namespace c{
    //接口泛型
    interface Calculate{
        <T>(a:T,b:T): T
    }

    let add:Calculate = function<T> (a:T, b:T):T {
        return a;
    }

    let result = add<number>(1,2);
}


namespace d{
 
}