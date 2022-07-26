import _ from 'lodash';

/**
 * 图表数据预处理
 * @param {Object} chartData 图表数据
 * @param {String} _type 图表类型
 * @returns
 */
export function dataPretreat(chartData, _type) {
    const { title = '', cname = '', series: _series = [], data: _data = [] } = chartData;

    // console.time('dataPretreat');
    // check data
    const series = _.uniqBy(_series, 'sid');
    const data = _data.slice();
    // switch by type

    // rebuild data
    // 单位
    const unit = Array.from(new Set(series.map(({ unit }) => unit))).join(',');

    // 系列列表
    const seriesList = series.map(({ sid, name }) => ({ sid, seriesName: name }));
    // 类别列表
    const categoryList = _.uniqBy(data.slice(), 'id').map(({ id, x }) => ({ cid: id, categoryName: x }));

    // 基本数据（包含字符串）
    // 基于系列的数据
    const dataBaseSeries = seriesList.reduce((prev, curr) => {
        const sid = curr?.sid;
        prev[sid] = categoryList.map(({ cid }) => {
            let origin = data.find(({ from, id }) => id === cid && from === sid)?.y ?? null;
            return numCheck(origin) ? Number(origin) : origin;
        });
        return prev;
    }, {});

    // 基于类别的数据
    const dataBaseCategory = categoryList.reduce((prev, curr) => {
        const cid = curr?.cid;
        prev[cid] = seriesList.map(({ sid }) => {
            let origin = data.find(({ from, id }) => id === cid && from === sid)?.y ?? null;
            return numCheck(origin) ? Number(origin) : origin;
        });
        return prev;
    }, {});

    // 百分比：基于一个类别多个系列的百分比计算
    // 基于类别的百分比
    const perBaseCategory = categoryList.reduce((prev, curr) => {
        const cid = curr?.cid;
        const categoryArr = dataBaseCategory[cid].map((i) => (numCheck(i) ? Number(i) : null));
        const categorySum = categoryArr.reduce((prev, curr) => prev + Math.abs(curr), 0);
        prev[cid] = categoryArr.map((value) => {
            return value === null ? null : Math.round(10000 * (categorySum ? value / categorySum : 0)) / 100;
        });
        return prev;
    }, {});

    // 基于系列的百分比 (转置)
    const perBaseSeries = seriesList.reduce((prev, curr, sIndex) => {
        const sid = curr?.sid;
        prev[sid] = categoryList.map(({ cid }) => {
            return perBaseCategory[cid][sIndex];
        });
        return prev;
    }, {});

    // 基于系列的最值
    const ultraBaseSeries = seriesList.reduce((prev, curr) => {
        const sid = curr?.sid;
        const validData = dataBaseSeries[sid].filter(numCheck).map((i) => Number(i));
        return {
            ...prev,
            [sid]: {
                max: Math.max(...validData),
                min: Math.min(...validData),
            },
        };
    }, {});

    // console.timeEnd('dataPretreat');
    // res
    const analysis = {
        // 标题
        title,
        // 单位
        unit,
        // 角标题
        cname,
        // 系列列表
        seriesList,
        // 类别列表
        categoryList,
        // 基于系列的数据
        dataBaseSeries,
        // 基于类别的数据
        dataBaseCategory,
        // 基于系列的百分比
        perBaseSeries,
        // 基于类别的百分比
        perBaseCategory,
        // 基于系列的最值
        ultraBaseSeries,
        // 兼容
        DEPRECATED_series: series,
        DEPRECATED_data: data,
    };
    return analysis;
}

/**
 * 图表数据检查
 * @param {Object} chartData 图表数据
 * @returns
 */
export function dataPreCheck(chartData) {
    if (!_.has(chartData, 'series') || !_.has(chartData, 'data')) return false;
    if (!Array.isArray(chartData.series) || !Array.isArray(chartData.data)) return false;
    if (_.isEmpty(chartData.series) || _.isEmpty(chartData.data)) return false;
    return true;
}

/**
 * value 检查
 * @param {String|Number}
 * @returns {Boolean}
 */
function numCheck(val) {
    let flag = true;

    if (val === null || val === undefined || _.trim(val) === '') {
        flag = false;
    }

    const validVal = Number(val); // 快速的强制类型转换 等价于 Number(val)

    if (_.isNaN(validVal) || !_.isFinite(validVal)) {
        flag = false;
    }

    // console.log(val, flag);

    return flag;
}
