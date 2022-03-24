const data = { one: 1 };
data["two"] = 2;
test("对象赋值", () => {
    expect(data).toEqual({ one: 1, two: 2 });
});
