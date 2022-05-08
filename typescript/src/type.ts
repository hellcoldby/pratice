namespace a{
    //定义一个接口 cart 可能是对象 也 可能是数组
    type cart<T> = {
        list: T[]
    } | T[];

    let c1:cart<string> = {list:['hello']};
    let c2:cart<number> = [1,2,3];
}

namespace b{
   
    let p = {name:'张三', age:18};
    //注意：这里typeof的使用。
    type person = typeof p; //type 定义了一个person 类型

    let p2:person = {
        name:'hello',
        age:20
    }
}

namespace c{
    interface Person2{
        name:string;
        age:number;
        job: {
            name:string;
        }
        interests: {name:string; level:number}[]
    }
    let myName: Person2['job']['name'] = '张三';
    let myLevel: Person2['interests'][0]['level'] = 1;
}

namespace d{
    interface Person3{
        name:string;
        age:number;
        gender: 'male'|'female'
    }

    type Person3Keys = keyof Person3; //✅
    function getValue_key(val:Person3, key:Person3Keys):any{
        return val[key]; // 参数key被限制 ✅
    }
}

namespace e{
    interface Person3{
        name:string;
        age:number;
        gender: 'male'|'female'
    }

    //通过这样一个 in 遍历，可以将左右的属性变成可选
    type PartialPerson = {
        [key in keyof Person3]?: Person3[key]
    }

    let p:PartialPerson = {}
}

namespace f{
    //必填属性
    interface Person{
        name?:string;
        age:number;
        gender: 'male'|'female'
    }
    //接口属性，可选转为必填
    type RequirePerson = Required<Person>
}

namespace g{
    interface Person{
        name?:string;
        age:number;
        gender: 'male'|'female'
    }
    type PickPerson = Pick<Person, 'name'>;
    //等价于
    // interface pickPerson{
    //     name: string;
    // }
 
    let x: PickPerson = {
        name: 'hello'
    }

}