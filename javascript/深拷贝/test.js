function deepClone(obj) {
    if (typeof obj !== "object") return obj;

    let isArray = obj instanceof Array;
    let new_obj = isArray ? [] : {};

    for (let key in obj) {
        new_obj[key] = deepClone(obj[key]);
    }
    return new_obj;
}

// 循环引用

const obj1 = {
    x: 1,
    y: 2,
};
obj1.z = obj1;

const obj2 = deepCopy(obj1);
console.log(obj2);

function deepCopy(obj, parent = null) {
    if (typeof obj !== "object") return obj;
    let newObj = obj instanceof Array ? [] : {};

    if (parent && parent.originParent === obj) {
        return parent.currentParent;
    }

    for (let key in obj) {
        newObj[key] = deepCopy(obj[key], {
            originParent: obj, //标记原始父级
            currentParent: newObj, //当前父级
            parent: parent,
        });
    }
    return newObj;
}
