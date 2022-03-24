function fn(b) {
    if (!b) throw new Error("b没有定义");
    let a = b;
    return a;
}

test("a测试函数异常", () => {
    expect(() => {
        fn();
    }).toThrowErrorMatchingSnapshot();
});
test("b测试函数异常", () => {
    expect(() => {
        fn();
    }).toThrowErrorMatchingSnapshot();
});
