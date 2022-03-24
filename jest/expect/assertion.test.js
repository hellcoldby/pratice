function asyncFn() {
    return new Promise((resolve, reject) => {
        resolve("hello world");
    });
}

test("异步断言", () => {
    expect.assertions(1);
    asyncFn().then((data) => {
        expect(data).toBe("hello world");
    });
    asyncFn().then((res) => {
        expect(res).toBe("hello world");
    });
});
