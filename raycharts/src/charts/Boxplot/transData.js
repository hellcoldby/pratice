/**
 * 转换数据格式
 *
 * 系列： 1-语文  2-数学
 *
 * 数据格式化为：
 * 语文 1：{
 *   data: {
 *          一班:[],
 *          二班:[],
 *          三班:[]
 *    },
 *    iqr: {
 *       一班：{max, min, upper,lower, q1,q2,q3},
 *       二班：{max, min, upper,lower, q1,q2,q3},
 *       三班：{max, min, upper,lower, q1,q2,q3}
 *    }
 * }
 *
 */
import _ from 'lodash';
export default function transData(chartData, valueType) {
    if (!chartData) return null;
    const series = chartData?.DEPRECATED_series;
    const data = chartData.DEPRECATED_data;
    if (!series || !data) return null;

    let tmpObj = [];
    for (let i = 0; i < series.length; i++) {
        const sid = series[i]?.sid;
        if (!sid) return;
        let tmp = {}; // 正常值
        let tmpAbs = {}; // 绝对值
        for (let j = 0; j < data.length; j++) {
            const name = data[j].x || ' ';
            let value = data[j].y || 0;
            if (typeof value !== 'number') {
                let parse_val = parseFloat(value);
                value = typeof parse_val === 'number' && !isNaN(parse_val) ? parseFloat(parse_val) : '';
            }

            if (!tmp[name]) {
                tmp[name] = [];
                tmpAbs[name] = [];
            }
            for (let key in tmp) {
                if (key === name && sid === data[j].from) {
                    tmpAbs[name].push(valueType === 2 ? Math.abs(value) : value);
                    tmp[name].push(data[j]?.y || 0);
                }
            }
        }

        // console.log(tmpAbs);
        // console.log(getIQ(tmpAbs, valueType));

        tmpObj.push({
            sid: sid,
            name: series[i]?.name,
            data: tmp,
            iqr: getIQ(tmpAbs, valueType),
        });
    }

    return tmpObj;

    // 取得四分位的值
    function getIQ(obj, valueType) {
        if (typeof obj !== 'object') return null;
        let _obj = _.cloneDeep(obj);

        for (let key in _obj) {
            if (!_obj[key] || !_obj[key].length) {
                _obj[key] = {};
                continue;
            }
            const col = {
                q1: 0,
                q2: 0,
                q3: 0,
                upper: 0,
                lower: 0,
                iqr: 0,
            };
            const len = _obj[key].length;
            const sortFn = (a, b) => a - b;
            const newArray = _obj[key].sort(sortFn);
            const min = Math.min.apply(null, newArray);
            const max = Math.max.apply(null, newArray);

            const q1_index = (len - 1) / 4;
            const q2_index = (len - 1) / 2;
            const q3_index = ((len - 1) * 3) / 4;

            col.q1 = getQ_value(q1_index, newArray);
            col.q2 = getQ_value(q2_index, newArray);
            col.q3 = getQ_value(q3_index, newArray);

            col.iqr = col.q3 - col.q1;
            col.upper = col.q3 + 1.5 * col.iqr;
            col.lower = col.q1 - 1.5 * col.iqr;
            col.upper = col.upper >= max ? max : col.upper;
            col.lower = col.lower <= min ? min : col.lower;

            col.max = max;
            col.min = min;
            if (valueType === 2) {
                col.max = min;
                col.min = max;
                for (let key in col) {
                    col[key] = -col[key];
                }
            }
            _obj[key] = col;
        }

        return _obj;
    }
}

/**
 * 获取数据四分位的数据
 * @param {number} index 四分位百分比
 * @param {*} newArray 数据集合
 * @returns
 */
function getQ_value(index, newArray) {
    if (parseInt(index) === index) {
        return newArray[index];
    } else {
        const prev_index = Math.floor(index);
        const next_index = Math.ceil(index);
        const float_value = index - prev_index;
        const realValue = newArray[prev_index] + (newArray[next_index] - newArray[prev_index]) * float_value;
        return realValue;
    }
}
