function getArr() {
    return [1, 2, 3, 4];
}
function getStr() {
    return "1234";
}
test("测试长度", () => {
    expect(getArr()).toHaveLength(4);
    expect(getStr()).toHaveLength(4);
});
