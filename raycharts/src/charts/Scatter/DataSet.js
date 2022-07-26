import _ from 'lodash';
import { add, subtract, multiply, divide } from '../../utils/math';

class DataSet {
    constructor(originData) {
        const tableData = this.transformData(originData);
        this.tableData = tableData;
        this.seriesSize = tableData.length - 1;
        this.categorySize = tableData[0].length - 1;
    }
    // 数据处理转二维数组
    transformData(originData) {
        const { cname, categoryList, seriesList, dataBaseSeries } = originData;
        const res = [
            [cname, ...categoryList.map((i) => i?.categoryName ?? '')],
            ...seriesList.map((item, index) => [item?.seriesName ?? '', ...dataBaseSeries?.[index + 1]]),
        ];
        return res;
    }
    categoryList = () => {
        const data = this._getData(0).slice(1);
        return data;
    };
    seriesNameAt = (i) => {
        const data = this._getData(i);
        return data[0];
    };
    seriesAt = (i) => {
        const data = this._getData(i).slice(1);
        const valid = data.map(this._dataValid);
        return valid;
    };
    // 获取列数据
    _getData = (i) => {
        const tableData = this.tableData;
        if (i >= tableData.length) {
            return Array(tableData[0].length).fill(null);
        } else if (i <= 0) {
            const res = tableData[0];
            return res;
        } else {
            const res = tableData[i];
            return res;
        }
    };
    _dataValid = (v) => {
        if (v === '' || v === false || v === null || isNaN(v)) return null;
        let res = Number(v);
        return res;
    };
    // todo 尝试建立一种迭代方法以及数据结构，用于绘图。
    // 可以迭代到当前维度下的所有数据，结合坐标轴数据的数据转换，可以直接转换为绘制所需数据，迭代控制由DataSet控制
    // 下面提供的迭代方法，是伪代码，逻辑尚不完善
    seriesMapData = (fn) => {
        // 维度遍历
        series.forEach((s, sIndex) => {
            // 分类遍历
            category.forEach((c, cIndex) => {
                // 当前分类下的数据
                // 非单一数据，可能多组数据
                // 类似散点图的多组数据表示一个点
                const info = { sName, cName, data: [] };
                const index = [cIndex, sIndex];
                fn(info, index, this);
            });
        });
    };
    categoryMapData = (fn) => {
        // 分类遍历
        category.forEach((c, cIndex) => {
            // 当前分类下的数据
            // 非单一数据，可能多组数据
            // 类似散点图的多组数据表示一个点
            const info = { sName, cName, data: [] };
            const index = [cIndex, sIndex];
            fn(info, index, this);
        });
    };
    // 迭代器方法
    *[Symbol.iterator]() {
        for (let arg of this.args) {
            yield arg;
        }
    }
}

export { DataSet };
