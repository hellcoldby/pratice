//4. 对象类型 --- 引入接口
interface person {
    readonly name: string; //只读属性
    age: number;
    sex?: string; //可选属性
    [propName: string]: any; //任意属性
}
interface person{
    add?: number
}

let tom: person = {
    name: "tom",
    age: 12,
};

let tom1: person = {
    // ❌  缺少age
    name: "Tom",
};
let tom2: person = {
    // ❌  多了gender
    name: "Tom",
    age: 25,
    gender: "male",
};

//必须包含的属性类型
interface IPerson {
    firstName: string;
    lastName: string;
    sayHi: () => string;
}
//可有可无的属性类型
type IPerson1 = Partial<IPerson>;

// Partial 等同于
interface _IPerson1 {
    firstName?: string;
    lastName?: string;
    sayHi?: () => string;
}

export {};
