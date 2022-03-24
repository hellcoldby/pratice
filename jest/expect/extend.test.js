expect.extend({
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `要求 ${received} 的取值不在 ${floor} - ${ceiling}范围`,
                pass: true,
            };
        } else {
            return {
                message: () => `要求 ${received} 的取值范围是 ${floor} - ${ceiling}`,
                pass: false,
            };
        }
    },
});

test("测试取值范围", () => {
    expect(100).toBeWithinRange(90, 110);
    expect(190).not.toBeWithinRange(0, 100);
    expect({ apples: 6, bananas: 3 }).toEqual({
        apples: expect.toBeWithinRange(1, 10),
        bananas: expect.not.toBeWithinRange(11, 20),
    });
});

// 2秒后返回 100
function getExternalValueFromRemoteSource() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(100);
        }, 2000);
    });
}

expect.extend({
    // 自定义一个异步函数： toBeDivisibleByExternalValue --- 测试能否被整除
    async toBeDivisibleByExternalValue(received) {
        const externalValue = await getExternalValueFromRemoteSource();
        const pass = received % externalValue == 0;
        if (pass) {
            return {
                message: () => `预期 ${received} 不能被 ${externalValue}整除`,
                pass: true,
            };
        } else {
            return {
                message: () => `预期 ${received} 能被 ${externalValue}整除`,
                pass: false,
            };
        }
    },
});

test("是否能被整除", async () => {
    await expect(100).toBeDivisibleByExternalValue();
    await expect(101).not.toBeDivisibleByExternalValue();
});
