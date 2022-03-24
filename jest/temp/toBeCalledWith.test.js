class LaCroix {
    constructor(flavor) {
        this.flavor = flavor;
    }
}

test("registration applies correctly to orange La Croix", () => {
    const beverage = new LaCroix("orange");
    register(beverage);
    const f = jest.fn();
    applyToAll(f);
    expect(f).toHaveBeenCalledWith(beverage);
});
