const mock = jest.fn();
// console.log(mock);
test("map calls its argument with a non-null argument", () => {
    [1].map((x) => mock(x));
    expect(mock).toBeCalledWith(expect.anything());
});
