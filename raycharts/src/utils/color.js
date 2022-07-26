/*
 * Description: 颜色相关的方法
 * Author: vicky
 * Date: 2020-08-04 15:05:29
 * LastEditTime: 2022-01-11 17:09:24
 * FilePath: \packages\raycharts\src\utils\color.js
 */
import _ from 'lodash';
import { LinearGradient, RadialGradient } from './gradient';
import { pointByAngle, lenBtwPoints, fFixed } from './tool';

/**
 * @method toRgba
 * @description 将颜色值转为rgba,可以更改透明度(支持#FFF，#FFFFFF,#FFFFFFFF,也可以给rgb/rgba更改透明度)
 * @author vicky
 * @param {String} color  颜色值
 * @param {number} alpha  透明度
 * @returns {String} rgba(x,x,x,x)返回一个颜色值
 * @example
 * //指定透明度
 * toRgba('#FFF',0.5)
 *
 * //不指定透明度
 * toRgba('#FFF')
 */
export function toRgba(color, alpha) {
    if (!_.isString(color)) {
        console.log('%c toRgba：color参数输入错误！', 'color:red;');
        return null;
    }
    const colorReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;
    let tColor = color.toLowerCase();
    if (colorReg.test(tColor)) {
        let a = 1;
        if (tColor.length === 4) {
            let newTColor = '#';
            for (let i = 1; i < 4; i++) {
                newTColor += tColor.slice(i, i + 1).concat(tColor.slice(i, i + 1));
            }
            tColor = newTColor;
        }
        if (tColor.length === 9) {
            const aCode = tColor.substr(7, 2);
            a = parseFloat(parseInt(`0x${aCode}`, 16) / 255).toFixed(2);
            tColor = tColor.substr(0, 7);
        }
        a = _.isNumber(alpha) ? mixAlpha(a, alpha) : a;
        let tColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            tColorChange.push(parseInt(`0x${tColor.slice(i, i + 2)}`, 16));
        }
        return `rgba(${tColorChange.join(',')},${a})`;
    }
    if (tColor.indexOf('rgb') > -1) {
        const regex = /\((.+)\)/;
        const tArr = tColor.match(regex)[1].split(',');
        let a = tArr[3] ? tArr[3] : 1;
        a = _.isNumber(alpha) ? mixAlpha(a, alpha) : a;
        return `rgba(${tArr[0]},${tArr[1]},${tArr[2]},${a})`;
    }
    return color;
}

/**
 * @method mixAlpha
 * @description 混合透明度
 * @private
 * @param {*} oldA
 * @param {*} newA
 */
function mixAlpha(oldAlpha, newAlpha) {
    let oldA = parseFloat(oldAlpha);
    let newA = parseFloat(newAlpha);
    let a = 1;
    if (oldA < 1) {
        a = oldA * newA;
    }
    if (oldA === 1) {
        a = newA;
    }
    return a;
}

/**
 * @method gradient
 * @private
 * @description 获取渐变对象
 * @param {String} gStr
 * @returns {Object}
 */
function gradient(gStr, alpha) {
    let gObj = { angle: 0, colorStops: [] };
    const conRegex = /\((.+)\)/;
    const rgbRegex = /rgb+\(\d+,\d+,\d+\)/g;
    const rgbaRegex = /rgba+\(\d+,\d+,\d+,(\d+.\d+|\d+)\)/g;
    const offsetRegex = /(-|)+\d+\%/g;
    const angleRegex = /\d+deg/g;
    const hexRegex = /#(\w|\d)+/g;
    // 获取括号内数据
    let conStr = gStr.match(conRegex)[1];
    // 判断是否存在非rgba的值
    let hexArr = conStr.match(hexRegex);
    if (hexArr) {
        hexArr.forEach((item) => {
            conStr = conStr.replace(item, toRgba(item));
        });
    }
    // 将rgb颜色值转为rgba
    const rgbArr = conStr.match(rgbRegex);
    if (rgbArr) {
        rgbArr.forEach((item) => {
            conStr = conStr.replace(item, toRgba(item));
        });
    }
    // 去掉字符串空格
    conStr = conStr.replace(/\s+/g, '');
    // 获取angle
    if (conStr.match(angleRegex)) {
        gObj.angle = conStr.match(angleRegex)[0].match(/\d+/)[0];
        conStr = conStr.replace(/\d+deg,/g, '');
    }
    // 获取offset数组
    let colorArr = conStr.replace(/\d+deg,/g, '').split(',r');
    let customOff = 0;
    // 获取rgba数组
    for (let i = 0; i < colorArr.length; i++) {
        let item = colorArr[i];
        let cStr = item.indexOf('rgba') < 0 ? item.replace('gba', 'rgba') : item;
        if (!cStr.match(rgbaRegex)) {
            console.log('%c gradient：传入的渐变数据异常，无法解析！', 'color:red;');
            return null;
        }
        let color = cStr.match(rgbaRegex)[0];
        color = _.isNumber(alpha) ? toRgba(color, alpha) : color;
        let offset = item.match(offsetRegex) ? item.match(offsetRegex)[0] : '';
        let offNum = offset.match(/(-|)+\d+/g) ? offset.match(/(-|)+\d+/g) : 0;
        //处理数据小于0的值等于0，大于100的值等于100
        offNum = offNum < 0 ? 0 : offNum > 100 ? 100 : offNum;
        offset = `${offNum}%`;
        let offset_num = offNum === 0 ? 0 : offNum / 100;
        if (offset_num !== 0) {
            customOff++;
        }
        gObj.colorStops.push({ color, offset, offset_num });
    }
    gObj.customOff = customOff;
    // 处理offset位置
    gObj = {
        ...gObj,
    };
    return gObj;
}

/**
 * @method color
 * @description 通过传入的颜色colorStr和代码类型codeType将其转成可直接赋值使用的颜色值
 * @author vicky
 * @param {String} colorStr  颜色字符串，支持纯色、线性渐变和径向渐变
 * @param {String/Object} dynamicParam 动态参数，codeType
 * codeType编码分类，包括canvas、css，为相应的编码生成颜色数据
 * 参数对象{
 * opacity(支持变更颜色不透明度),
 * position:{x,y,width,height}根据指定区域大小渲染,
 * codeType:编码分类,
 * degree:线性渐变旋转角度,
 * linearByAngle:{sAngle,eAngle,ccw}起始角度,顺逆时针
 * },
 * 当变更为参数对象时，如需配置codeType可以写在参数对象里
 * @returns {String/Object}  转换出颜色数据或者渐变对象
 * @example
 * //纯色canvas,支持正常css和canvas颜色赋值数据
 * color('rgba(33,44,56,0.3)');
 * //纯色css
 * color('rgba(33,44,56,0.3)','css');
 *
 * //线性渐变
 * color('linearGradient(45deg,rgba(34,45,33,0.4),rgba(34,45,33,0.4)) 100%');
 * color('linearGradient(45deg,rgba(34,45,33,0.4),rgba(34,45,33,0.4)) 100%','css');
 *
 * //径向渐变
 * color('radialGradient(rgba(34,45,33,0.8) 40%,rgba(34,45,33,0.8))');
 * color('radialGradient(rgba(34,45,33,0.8) 40%,rgba(34,45,33,0.8))','css');
 *
 * //改变不透明度
 * color('rgba(33,44,56,0.3)',{opacity:0.4});
 * //css改变不透明度
 * color('rgba(33,44,56,0.3)',{opacity:0.4，codeType:'css'});
 */
export function color(colorStr, dynamicParam) {
    // 检查颜色值是否正确
    if (!colorStr) {
        console.log('%c color：传入的colorStr为空！', 'color:red;');
        return colorStr;
    }
    if (!_.isString(colorStr)) {
        console.log('%c color：传入的colorStr类型错误！', 'color:red;');
        return colorStr;
    }

    // 处理dynamicParam
    // dynamicParam为String，编码类型
    let dp = dynamicParam;
    //整体透明度
    let opacity;
    let degree = 0;
    //线性环形实际旋转角度
    let lba = 0;
    const codeTypes = ['canvas', 'css'];
    let ct = 'canvas';
    if (_.isString(dp) && !(_.indexOf(codeTypes, dp) < 0)) {
        ct = dp;
    }
    //dynamicParam 为参数对象
    if (_.isPlainObject(dp)) {
        opacity = _.get(dp, 'opacity', null);
        degree = _.get(dp, 'degree', 0);
        //处理线性环形渐变
        let lbaInfo = _.get(dp, 'linearByAngle', { sAngle: 0, eAngle: 0, ccw: false });
        let sa = lbaInfo.sAngle;
        let ea = lbaInfo.eAngle;
        let ccw = lbaInfo.ccw;
        lba = !ccw ? ea + 90 - (ea - sa) / 2 : sa - 90 + (ea - sa) / 2;
        let codeType = _.get(dp, 'codeType', null);
        if (codeType && !(_.indexOf(codeTypes, codeType) < 0)) {
            ct = codeType;
        }
    }

    let color=colorStr;
    // 检查colorStr数据
    let lg = colorStr.indexOf('linear-gradient') >= 0;
    let rg = colorStr.indexOf('radial-gradient') >= 0;
    let pur = !lg && !rg;
    // 纯色,直接返回rgba的数据
    if (pur) {
        return _.isNumber(opacity) ? toRgba(colorStr, opacity) : toRgba(colorStr);
    }
    // 渐变，需区分css和canvas
    let gd;
    if (lg | rg) {
        // 获取渐变对象
        gd = _.isNumber(opacity) ? gradient(colorStr, opacity) : gradient(colorStr);
        if (!gd) {
            return null;
        }
    }
    if (lg && ct === 'canvas') {
        let angle = parseFloat(gd.angle) + parseFloat(degree) + parseFloat(lba);
        const lgXY = lgXYByAngle(angle);
        let colorStops = getColorStops(gd);
        if (dynamicParam && dynamicParam.position) {
            let p = dynamicParam.position;
            let ax = p.x + p.width;
            let ay = p.y + p.height;
            let newLg = lgXYByAngle(angle - 90);
            color = new LinearGradient(newLg.x1 * ax, newLg.y1 * ay, newLg.x2 * ax, newLg.y2 * ay, colorStops, true);
        } else {
            color = new LinearGradient(lgXY.x1, lgXY.y1, lgXY.x2, lgXY.y2, colorStops);
        }
    }
    if (rg && ct === 'canvas') {
        color = new RadialGradient(0.5, 0.5, 0.5);
        addColorStops(color, gd);
    }

    return color;
}

/**
 * @private
 * @param {*} gradient
 * @param {*} gradientData
 */
function addColorStops(gradient, gradientData) {
    let colorStops = gradientData.colorStops;
    let len = colorStops.length;
    let averageOff = 1 / len;
    let count = 0;
    for (let i = 0; i < len; i++) {
        const item = colorStops[i];
        let off = count;
        if (i === 0) {
            off = item.offset_num;
            count += off;
        }
        if (i > 0 && i !== len - 1) {
            count += averageOff;
            off = item.offset_num > 0 ? item.offset_num : count;
        }
        if (i === len - 1) {
            off = item.offset_num === 0 ? 1 : item.offset_num;
        }
        gradient.addColorStop(off, item.color);
    }
}

/**
 * @method getColorStops
 * @description 获取colorStops
 * @param {*} gradientData 渐变数据
 */
function getColorStops(gradientData) {
    let resColorStops = [];
    let colorStops = gradientData.colorStops;
    let len = colorStops.length;
    let averageOff = 1 / len;
    let count = 0;
    for (let i = 0; i < len; i++) {
        const item = colorStops[i];
        let off = count;
        if (i === 0) {
            off = item.offset_num;
            count += off;
        }
        if (i > 0 && i !== len - 1) {
            count += averageOff;
            off = item.offset_num > 0 ? item.offset_num : count;
        }
        if (i === len - 1) {
            off = item.offset_num === 0 ? 1 : item.offset_num;
        }
        // gradient.addColorStop(off, item.color);
        resColorStops.push({ offset: off, color: item.color });
    }
    return resColorStops;
}

/**
 * @method lgXYByAngle
 * @description 根据角度计算渐变rect
 * @private
 * @param {*} angle
 */
function lgXYByAngle(angle) {
    //单位区域对角线
    let r = fFixed(lenBtwPoints(0, 0, 1, 1), 2);
    //center
    const cx = r,
        cy = r;
    let x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0;

    //当前角度
    let c_a = parseFloat(angle);

    //校正角度
    let a = c_a + 90;
    //计算指定角度点位置
    let p1 = checkUnit(pointByAngle(cx, cy, r, a), r);
    let p2 = checkUnit(pointByAngle(cx, cy, r, a - 180), r);
    (x1 = p1.x), (y1 = p1.y), (x2 = p2.x), (y2 = p2.y);
    return { x1, y1, x2, y2 };
}

function checkUnit(point, r) {
    let x = fFixed(point.x / (2 * r), 2),
        y = fFixed(point.y / (2 * r), 2);
    return { x, y };
}
