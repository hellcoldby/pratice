/*
 * Description: 公共计算方法
 * Author: vicky
 * Date: 2020-08-07 20:45:47
 * LastEditTime: 2022-01-21 18:06:12
 * FilePath: \packages\raycharts\src\utils\tool.js
 */
import _ from 'lodash';
import { add, divide, multiply, subtract } from './math';

/**
 * @method pointByAngle
 * @description 根据中心点、半径和角度获取指定角度的点坐标
 * @author vicky
 * @param {*} cx
 * @param {*} cy
 * @param {*} r
 * @param {*} angle 角度 0~360
 * @returns {Object} {x,y}
 */
export function pointByAngle(cx, cy, r, angle) {
    let a = (angle * Math.PI) / 180;
    let x = cx + r * Math.cos(a);
    let y = cy + r * Math.sin(a);
    return { x, y };
}

/**
 * @method pointByRad
 * @description 根据中心点、半径和角度获取指定角度的点坐标
 * @author vicky
 * @param {*} cx
 * @param {*} cy
 * @param {*} r
 * @param {*} rad 弧度
 * @returns {Object} {x,y}
 */
export function pointByRad(cx, cy, r, rad) {
    let x = cx + r * Math.cos(rad);
    let y = cy + r * Math.sin(rad);
    return { x, y };
}

/**
 * @method lenBtwPoints
 * @description 两点之间直线长度
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @returns {number} 直线长度
 */
export function lenBtwPoints(x1, y1, x2, y2) {
    const a = x2 - x1;
    const b = y2 - y1;
    return Math.sqrt(a * a + b * b);
}

/**
 * @method fFixed
 * @description float数据获取指定位数
 * @param {*} num
 * @param {*} fix
 */
export function fFixed(num, fix) {
    return parseFloat(num.toFixed(fix));
}

/**
 * @method measureText
 * @description 计算文本宽高
 * @param {*} text
 * @param {Object} fontObj {fontStyle,fontWeight,fontSize,fontFamily}
 */
export function measureText(text, fontObj) {
    // 获取样式数据
    let fontStyle = _.get(fontObj, 'fontStyle', 'normal');
    let fontWeight = _.get(fontObj, 'fontWeight', 'normal');
    let fontSize = _.get(fontObj, 'fontSize', '14');
    let fontFamily = _.get(fontObj, 'fontFamily', 'Sans-serif');

    // font值
    let font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

    // 计算
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.font = font;
    let width = ctx.measureText(text).width;
    let height = fontSize;

    return { width, height };
}

/**
 * @method getArcAngles
 * @description 弧度根据指定数量拆分
 * @param {Obj} arcObj 被拆分弧度对象 {sAngle 开始角，eAngle 结束角，ccw 逆时针}
 * @param {*} data 数据
 * @param {*} space 弧度间隔百分比
 */
export function getArcAngles(arcObj, data, space) {
    const { sAngle, eAngle, ccw } = arcObj;
    // 被拆分弧度起始和结束角
    let sa = ccw ? eAngle : sAngle;
    let ea = ccw ? sAngle : eAngle;
    // 可调范围在0~10度范围内
    let allRad = (10 * Math.PI) / 180;
    let radSpace = space === 0 ? 0 : (space / 100) * allRad;
    // 筛选系列，每个系列第一个分类值
    let category = data?.categoryList[0];
    let c_data = data?.dataBaseCategory[category.cid] ?? [];
    let info = [];
    !_.isEmpty(data.seriesList) &&
        data.seriesList.forEach((item, index) => {
            info.push({
                ...item,
                ...category,
                value: c_data[index],
            });
        });
    // 数据总值
    let num = c_data.length;
    // 实际有效数据总值
    let validNum = c_data.filter((e) => {
        return e;
    }).length;
    validNum === 1 && (validNum = 0);
    // 获取数据所占百分比
    let sum = _.sumBy(c_data, (e) => {
        return Math.abs(e) ?? 0;
    });
    const maxValue = Math.max(...c_data);
    const minValue = Math.min(...c_data);
    // 弧度总值
    let aCount = !ccw ? ea - sa - radSpace * validNum : ea - sa + radSpace * validNum;
    let arcs = [];
    for (let i = 0; i < num; i++) {
        let itemData = c_data[i];
        let percent = sum !== 0 && itemData !== null ? Math.abs(itemData) / sum : 0;
        let radLen = aCount * percent;
        arcs.push({
            sAngle: sa,
            eAngle: sa + radLen,
            info: info[i],
            value: itemData,
            seriesSum: sum,
            isMax: itemData === maxValue,
            isMin: itemData === minValue,
        });
        let vRadSpace = itemData ? radSpace : 0;
        sa = !ccw ? sa + radLen + vRadSpace : sa + radLen - vRadSpace;
    }
    return arcs;
}

/**
 *@method getGaugeInfo 获取仪表盘相关信息
 * @param {*} config
 */
export function getGaugeInfo(config) {
    const { maxWidth, maxHeight, chartData, configData } = config;
    const {
        general: { r: gR, hole_r: gR0, s_angle, e_angle, ccw },
        guide: { draw_coor: coor },
    } = configData;
    const { seriesList, dataBaseCategory, categoryList } = chartData;
    const {
        scale: { range },
        division: {
            a_div: { num: aDivNum },
            b_div: { num: bDivNum },
        },
    } = coor;
    let aNum = Math.ceil(aDivNum);
    let bNum = Math.ceil(bDivNum);
    let s_info = seriesList[0];
    let text = s_info?.seriesName ?? '';
    let sId = s_info?.sid;
    let cId = categoryList[0]?.cid;
    let all_data = dataBaseCategory[cId] ?? [];
    // 数据不能超过最大值
    let c_data = Math.min(!_.isEmpty(all_data) ? all_data[0] : 0, range.max);
    // 数据不能小于最小值
    c_data = Math.max(c_data, range.min);
    // 是否显示图形
    let showGraph = !_.isEmpty(all_data) ? all_data[0] > range.min : false;
    // 圆心,预留属性
    // 水平偏移
    const OFFSET_H = 0;
    // 垂直偏移
    const OFFSET_V = 0;
    // 计算数据在刻度百分比(|(数据-min)/(max-min)|)
    let dataPct = Math.abs(divide(c_data - range.min, range.max - range.min));
    // 数据百分比字符串
    let dataPctString = `${multiply(dataPct, 100)}%`;
    // 仪表盘基本属性
    let cx = maxWidth / 2 + OFFSET_H;
    let cy = maxHeight / 2 - OFFSET_V;
    let maxDiam = Math.min(maxWidth, maxHeight) * 2;
    let r = (maxDiam / 2) * (gR / 100);
    let r0 = r * (gR0 / 100);
    r0 = r - r0 <= 1 ? r - 1 : r0;
    let centerR = r0 + (r - r0) / 2;
    // 计算刻度位置
    // 数据差值
    let sValue = !ccw ? range.min : range.max;
    let eValue = !ccw ? range.max : range.min;
    const dDataValue = Math.abs(eValue - sValue);
    const cANum = !aNum ? 1 : aNum;
    // 卡槽整体起始角度
    // rad
    let s_rad_n = s_angle / 180;
    let e_rad_n = e_angle / 180;
    let sAngle = (2 - s_rad_n) * Math.PI;
    let eAngle = s_rad_n === e_rad_n ? (4 - s_rad_n) * Math.PI : (2 - e_rad_n) * Math.PI;
    // 角度差值
    const dAngleValue =
        eAngle >= sAngle
            ? eAngle - sAngle
            : (sAngle - eAngle) / Math.PI >= 2
            ? sAngle - eAngle
            : 2 * Math.PI - (sAngle - eAngle);
    const aSpaceAngle = dAngleValue / cANum;
    // 数据角度
    let dataAngle = dAngleValue * dataPct;
    // 刻度间距值
    // 大分度是弧度区间
    const aSpaceValue = dDataValue / cANum;
    // 刻度信息
    const aDivInfo = createDivisionInfo({
        sAngle,
        eAngle,
        cx,
        cy,
        r: centerR,
        num: cANum + 1,
        spaceAngle: aSpaceAngle,
        sValue,
        eValue,
        spaceValue: aSpaceValue,
        ccw,
    });
    // 小分度是大分度区间
    const cBNum = !bNum ? 1 : bNum * cANum;
    const bSpaceValue = dDataValue / cBNum;
    const bSpaceAngle = dAngleValue / cBNum;
    const bDivInfo = createDivisionInfo({
        sAngle,
        eAngle,
        cx,
        cy,
        r: centerR,
        num: cBNum + 1,
        spaceAngle: bSpaceAngle,
        sValue,
        eValue,
        spaceValue: bSpaceValue,
    });
    // 获取端点坐标
    // 数据起始角度
    let data_sAngle = !ccw ? sAngle : eAngle; // 数据起始角度
    // 数据结束角度
    let data_eAngle = !ccw ? sAngle + dataAngle : eAngle - dataAngle;
    // 数据端点
    let point = pointByRad(cx, cy, centerR, data_eAngle);
    return {
        cx,
        cy,
        r,
        r0,
        centerR,
        width: r - r0,
        dataPct,
        dataPctString,
        aDivInfo,
        bDivInfo,
        sAngle,
        eAngle,
        dataAngle,
        data_sAngle,
        data_eAngle,
        point,
        value: !_.isEmpty(all_data) ? all_data[0] : null,
        text,
        sId,
        cId,
        showGraph,
    };
}

function createDivisionInfo(params) {
    const { sAngle, cx, cy, r, spaceAngle, num, sValue, eValue, spaceValue } = params;
    let angle = sAngle;
    let value = sValue;
    let pmV = eValue > sValue ? 1 : -1;
    let info = [];
    for (let i = 0; i < num; i++) {
        let point = pointByRad(cx, cy, r, angle);
        info.push({ ...point, angle, cx, cy, r, value: i === num - 1 ? eValue : value });
        angle = add(angle, spaceAngle);
        value = add(value, spaceValue * pmV);
    }
    return info;
}

// 虚线配置信息,array,[虚线长度，虚线间隔,虚线长度，虚线间隔,...]，循环按照这个规律读取
export const dashArray = [5, 5];
