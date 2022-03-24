function fn(b) {
    if (!b) throw new Error("b没有定义");
    let a = b;
    return a;
}

test("测试函数异常0", () => {
    expect(() => {
        fn();
    }).toThrow(/a/);
});

test("测试函数异常1", () => {
    expect(() => {
        fn();
    }).toThrow("b没有定义"); //true
});

test("测试函数异常2", () => {
    expect(() => {
        fn();
    }).toThrow(/b/); //true
});
