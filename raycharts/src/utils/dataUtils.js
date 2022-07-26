/*
 * Description: 数据处理相关
 * Author: vicky
 * Date: 2020-08-22 16:18:57
 * LastEditTime: 2021-12-21 14:39:50
 * FilePath: \packages\raycharts\src\utils\dataUtils.js
 */
import _ from 'lodash';

/***************************** DEPRECATED *****************************/
// 数据前置处理直接使用 直接使用解构好的数据保证数据展示的一致性
/**
 * @method getDataBySid
 * @description 获取指定系列的所有数据
 * @param {Array} data 图表的原始数据
 * @param {Number} sid 系列id
 */
export function getDataBySid(data, sid) {
    if (!_.isEmpty(data)) {
        return data.filter((e) => e.from === sid);
    }
    return [];
}

/**
 * @method getDataById
 * @description 获取指定类别的所有数据
 * @param {Array} data 图表的原始数据
 * @param {Number} sid 系列id
 */
export function getDataById(pData, id) {
    if (id === null || id === void 0) return [];
    if (!_.isEmpty(pData.series) && !_.isEmpty(pData.data)) {
        return pData.series.reduce((prev, { sid }) => {
            const matchItem = pData.data.find((i) => i.id === id && i.from === sid);
            if (!matchItem) return prev;
            return prev.concat(matchItem);
        }, []);
    }
    return [];
}

/**
 * @method getDataByOneCate
 * @description 获取所有系列的第一个分类值
 * @param {*} data
 */
export function getDataByOneCate(data) {
    let sArr = _.get(data, 'series', []);
    let oneCate = [];
    let xId;
    for (let i = 0; i < sArr.length; i++) {
        let item = sArr[i];
        let cData = getDataBySid(data.data, item.sid);
        if (i === 0) {
            xId = cData[0].id;
            oneCate.push(cData[0]);
        } else {
            let itemCate = _.filter(cData, (e) => {
                return e.id === xId;
            })[0];
            itemCate && oneCate.push(itemCate);
        }
    }
    return oneCate;
}

/**
 * @method getAllSeries
 * @description 获取数据中所有系列
 * @param {*} pData
 */
export function getAllSeries(pData) {
    return _.uniqBy(pData?.series ?? [], 'sid');
}

/**
 * @method getAllCate
 * @description 获取数据中所有分类
 * @param {*} data
 */
export function getAllCate(data) {
    let cates = [];
    if (!_.isEmpty(data)) {
        cates = _.uniqBy(data, 'id');
    }
    return cates;
}

/**
 * @method getAllUltra 获取全部极值
 * @param {*} params
 */
export function getAllUltra(data) {
    let series = data?.seriesList ?? [];
    let ultra = data?.ultraBaseSeries ?? {};
    let max = 0,
        min = 0;
    series.forEach((e) => {
        max = Math.max(max, ultra[e.sid].max);
        min = Math.min(min, ultra[e.sid].min);
    });
    return { max, min };
}

/**
 * @method stringDataToNum 格式化数据，将y值数据转为Number类型
 * @param {*} data
 */
export function stringDataToNum(data) {
    let resData = data;
    let categoryList = resData.categoryList;
    let seriesList = resData.seriesList;
    categoryList.forEach((item) => {
        let DBCData = resData?.dataBaseCategory[item.cid];
        if (_.isArray(DBCData)) {
            for (let i = 0; i < DBCData.length; i++) {
                let ele = DBCData[i];
                if (!ele && ele !== 0) {
                    DBCData[i] = null;
                }
                if (ele && _.isString(ele)) {
                    DBCData[i] = parseFloat(ele);
                }
            }
            resData.dataBaseCategory[item.cid] = DBCData;
        }
    });
    seriesList.forEach((item) => {
        let DBSData = resData?.dataBaseSeries[item.sid];
        if (_.isArray(DBSData)) {
            for (let i = 0; i < DBSData.length; i++) {
                let ele = DBSData[i];
                if (!ele && ele !== 0) {
                    DBSData[i] = null;
                }
                if (ele && _.isString(ele)) {
                    DBSData[i] = parseFloat(ele);
                }
            }
            resData.dataBaseSeries[item.sid] = DBSData;
        }
    });
    return resData;
}

/***************************** DEPRECATED *****************************/

/**
 * @method getExpNumByTail
 * @description 将传入数据根据末位期望值进行计算，返回比原值大于或者等于并且末位为期望值的数据
 * @param {*} oNum 原数据
 * @param {*} tailExp 末位期望
 */
export function getExpNumByTail(oNum, tailExp) {
    if (tailExp && oNum >= 0) {
        return Math.ceil(oNum / tailExp) * tailExp;
    }
    if (tailExp && oNum < 0) {
        return Math.floor(oNum / tailExp) * tailExp;
    }
    return oNum;
}
