/**
 * 用户需要满足以下条件才能看到文章
 * 1. 掘金用户
 * 2. 等级在1级以上
 * 3. 前端开发
 */

//常规的写法
function checkAuth(data) {
    if (data.role !== "juejin") {
        console.log("不是掘金用户");
        return false;
    }
    if (data.grade < 1) {
        console.log("掘金等级小于 1 级");
        return false;
    }
    if (data.job !== "FE") {
        console.log("不是前端开发");
        return false;
    }
}

//策略模式的写法  指定规则  和 校验规则 分开

//先制定规则

const checkRole = (value) => value === "juejin";
const checkGrade = (value) => value >= 1;
const checkJob = (value) => jobList.indexOf(value) > 1;

//自定义的验证规则
class Validator {
    constructor() {
        this.checkList = [];
    }

    //添加信息
    add(value, fn) {
        this.checkList.push(() => {
            return fn(value);
        });
    }
    //添加验证
    check() {
        for (let fn of this.checkList) {
            const res = fn();
            if (!res) return false;
        }
        return true;
    }
}

//用户验证
const userInfo = {
    role: "juejin",
    grade: 3,
};

const vr = new Validator();
vr.add(userInfo.role, checkRole);
vr.add(userInfo.grade, checkGrade);
const res = vr.check();
console.log(res);
