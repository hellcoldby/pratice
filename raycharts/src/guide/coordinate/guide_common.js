import _ from 'lodash';

// 动画间隔时间
export function setAnimTime(len) {
    let T = 1.2 / (len + 6); // 间隔时间
    let t = 8.4 / (len + 6); // 每段绘制时长
    T = Math.round(T * 1000);
    t = Math.round(t * 1000);
    return { t, T };
}
/**
 * 截取 第xx个系列的数据
 * @param {Array} data 图表的原始数据
 * @param {Number} sIndex  要获取第几个系列的数据 (default 0)
 */
export function getData(pData, sIndex = 0) {
    if (!pData || JSON.stringify(pData) === '{}') {
        console.error('图表数据不能为空');
        return;
    }

    const series = pData.series ? pData.series : pData.seriesList;
    if (!series || !series.length) {
        console.error('serries系列不能为空');
        return;
    }

    const sData = series[sIndex]; // 系列
    let curData = pData.data ? pData.data : pData.DEPRECATED_data;

    if (curData.length) {
        curData = curData.filter((item) => item.from === sData.sid); // 筛选不同类型下的数据
        curData = JSON.parse(JSON.stringify(curData));

        // webPro 项目中要求只截取 数值
        // curData = intercept(curData);

        // 对数据进行校验，将数据中的y值转换为数字
        curData.forEach((item, index, ary) => {
            if (typeof item.y !== 'number') {
                let parse_val = parseFloat(item.y);

                let num =
                    typeof parse_val === 'number' && !isNaN(parse_val) ? parseFloat(item.y) : '';
                ary[index].y = num;
            }
        });
    } else {
        console.warn('当前系列数据为空');
    }
    return curData;
}
// tools - 数组中最长的字符串
export function get_maxText(data) {
    let get_maxStr = '';
    if (data && data.length) {
        get_maxStr = data[0];
        data.forEach((item) => {
            if (getFontWidth(item) > getFontWidth(get_maxStr)) {
                get_maxStr = item;
            }
        });
    }
    return {
        get_maxStr,
    };
}

// tools---获取当前数据中文字最多的一项
// dir -- true 最长的x字符串  ---- false 最长的数值y字符串
export function getMostText(data, dir, configData, pData) {
    if (!data || !data.length) return;
    const {
        _type,
        guide: {
            draw_coor: {
                scale: {
                    range: { open: scale_open, max: scale_max, min: scale_min },
                },
            },
        },
    } = configData;
    let maxStr = '';
    let maxLen = 0;
    let str_len = 0;

    let data_max = null;
    let data_min = null;
    // 堆叠图判断
    let stack_flag = false;
    if (
        _type === 'v_stacked' ||
        _type === 'h_stacked' ||
        _type === 'stack_line' ||
        _type === 'line_stacked'
    ) {
        stack_flag = true;
        const [curMin, curMax] = getStackedRanges(pData);
        data_max = curMax;
        data_min = curMin;
    }

    data.forEach((item, index) => {
        if (item.x) {
            let str = '';
            if (dir) {
                str = `${item.x}`;
            } else {
                if (!stack_flag) {
                    const { curMax } = getMax(data);
                    const { curMin } = getMin(data);
                    data_max = curMax;
                    data_min = curMin;
                }

                if (scale_open) {
                    data_min = scale_min;
                    data_max = scale_max;
                }

                let rp_max = roundUp(data_max);
                let rp_min = roundUp(data_min);
                if (rp_max > 0 && rp_max < 10) {
                    rp_max = turnString(rp_max);
                    rp_min = turnString(rp_min);
                    // console.log(rp_max);
                } else if (rp_min < 0 && rp_min > -10) {
                    rp_min = turnString(rp_min);
                    rp_min = turnString(rp_min);
                    // console.log(rp_min);
                } else {
                    rp_max = String(rp_max);
                    rp_min = String(rp_min);
                }
                str = rp_max.length >= rp_min.length ? rp_max : rp_min;
            }
            // console.log(dir, str);
            str_len = String(str).length;
            if (str_len >= maxLen) {
                maxLen = str_len;
                maxStr = str;
            }
        }
    });
    // console.log(maxStr);
    return {
        maxStr,
        maxLen,
    };
}
// tools -- number类型的数据转换成保留两位小数的字符串
function turnString(num) {
    // let re = /^(-)?[0-9]+$/;
    // if (re.test(num)) {
    // num += '.00';
    // }
    // 处理小于1的数
    const absText = Math.abs(num);
    if (absText < 1) {
        // 小数点后的位数
        let reg = /(^0+)([^0]{0,2})/; //
        let after_str = num.toString().split('.')[1];
        if (after_str && reg.test(after_str)) {
            // 小数点连续为零的个数
            let zero_str = reg.exec(after_str)[1];
            // 小数中非零的数字
            let noZero_val = reg.exec(after_str)[2];
            let trans_val = transData(noZero_val.slice(0, 2));
            // 如果非零数字向上取整，连续零要消除一位
            zero_str =
                trans_val > 10 && zero_str ? zero_str.substring(0, zero_str.length - 1) : zero_str;

            let newVal = `${num > 0 ? '' : '-'}0.${zero_str}${trans_val}`;
            newVal = Number(newVal);
            num = newVal;
        }
    }

    return num;
}

// tools -- 当前数据中的最大值
// 获取当前系列的最大值和最小值
export function getMaxMin(data) {
    if (!data || !data.length) {
        return {
            max: 0,
            min: 0,
        };
    }
    let max = Number(data[0].y) || 0;
    let min = Number(data[0].y) || 0;
    data.forEach((item) => {
        if (Number(item.y) > max) {
            max = item.y - 0;
        }
        if (Number(item.y) < min) {
            min = item.y - 0;
        }
    });

    return {
        max,
        min,
    };
}

// tools -- 数据中的最大值
export function getMax(curData) {
    let curMax = 0;
    let maxIndex = 0;
    curData.forEach((item, index) => {
        let val = item.y - 0;
        if (val > curMax) {
            curMax = val;
            maxIndex = index;
        }
    });
    return { curMax, maxIndex };
}

// tools -当前数据中的最小值
export function getMin(curData) {
    if (!curData || !curData[0]) return 0;
    let curMin = curData[0].y || 0;
    let minIndex = 0;
    curData.forEach((item, index) => {
        let val = item.y - 0;
        if (val < curMin) {
            curMin = val;
            minIndex = index;
        }
    });
    return { curMin, minIndex };
}

// tools
export function transData(abs_val) {
    const integer = String(Math.floor(abs_val));
    const integer_len = integer.length;
    let newVal = null;
    // 判断倍数关系
    let multiples = 1;
    switch (integer_len) {
        case 1:
            multiples = Math.ceil(abs_val / 1);
            newVal = Number(multiples);
            break;
        case 2:
            multiples = Math.ceil(abs_val / 10);

            newVal = multiples * 10;
            break;
        case 3:
            multiples = Math.ceil(abs_val / 50);
            newVal = multiples * 50;
            break;
        case 4:
            multiples = Math.ceil(abs_val / 500);
            newVal = multiples * 500;
            break;
        default:
            const tmp = 5 * Math.pow(10, integer_len - 2);
            multiples = Math.ceil(abs_val / tmp);
            newVal = multiples * tmp;
            break;
    }

    return newVal;
}

// y轴刻度值向上取整
export function roundUp(val) {
    let abs_val = Math.abs(val);
    let newVal = abs_val;

    // 如果数据大于0小于1
    if (abs_val > 0 && abs_val < 1) {
        // 取值依据 https://www.figma.com/file/6QY3TtiPsyY3XeGWQjJu4K/%E5%8F%96%E5%80%BC%E8%8C%83%E5%9B%B4%E9%99%90%E5%AE%9A%E8%A7%84%E8%8C%83?node-id=0%3A1
        // 小数点后的位数
        let after_str = abs_val.toString().split('.')[1];
        if (after_str) {
            // console.log(after_str);
            // 小数中非零的数字
            let reg = /(0*)([^0]{0,2})/;
            // 小数点后数字之前的零位数
            let zero_str = reg.exec(after_str)[1];
            let noZero_val = reg.exec(after_str)[2];

            newVal = transData(noZero_val);
            newVal = val > 0 ? newVal : 0 - newVal;
            newVal *= Math.pow(10, -(zero_str.length + noZero_val.length));
        } else {
            newVal = 0;
        }
    } else {
        newVal = transData(abs_val);
        newVal = val > 0 ? newVal : 0 - newVal;
    }

    return newVal;
}

// tools -- 计算中英文的字体宽度
export function getFontWidth(str, fontsize, fontFamily) {
    let _fontsize = fontsize || 14;
    let _fontFamily = fontFamily || 'sans-serif';
    const _str = String(str);
    if (!_str) return 0;
    let font = `${_fontsize}px ${_fontFamily}`;

    let canvas = null;
    if (getFontWidth.canvas) {
        canvas = getFontWidth.canvas;
    } else {
        canvas = document.createElement('canvas');
    }
    let ctx = canvas.getContext('2d');
    ctx.font = font;
    let metrics = ctx.measureText(_str);
    return metrics.width;
}

/**
 * y轴刻度的最大值(柱形竖图)
 * @param {object} pData
 * @param {number} limit 取值范围
 */
export function getY_max(pData, limit) {
    const series = pData.series ? pData.series : pData.seriesList;
    let maxVal = 0;
    series.forEach((item, index) => {
        let curData = getData(pData, index);
        if (limit && typeof limit === 'number') {
            curData = curData && curData.length && curData.slice(0, limit);
        }

        let { curMax } = getMax(curData);
        if (curMax > maxVal) {
            maxVal = curMax;
        }
    });
    return maxVal;
}

// tools -- y轴刻度的最小值(柱形竖图)
export function getY_min(pData) {
    const series = pData.series ? pData.series : pData.seriesList;
    const firstVal = getData(pData);
    let minVal = firstVal && firstVal[0] ? firstVal[0].y : 0;
    series.forEach((item, index) => {
        let curData = getData(pData, index);
        let { curMin } = getMin(curData);
        if (curMin < minVal) {
            minVal = curMin;
        }
    });
    return minVal;
}

// tools-- 获取轴线上字体旋转的角度(
export function get_Rad(angle) {
    const rad = (angle * Math.PI) / 180;
    return rad;
}

// tools-获取每个系列下，数据量最多的数组
export function getData_maxLen(pData) {
    const series = pData.series ? pData.series : pData.seriesList;
    let maxData_len = 0;
    let maxData = null;
    series.forEach((item, index) => {
        let curData = getData(pData, index);
        if (maxData_len < curData.length) {
            maxData_len = curData.length;
            maxData = curData;
        }
    });
    return {
        maxData, // 数据量最多的数组
        maxData_len, // 数据量最多数组的长度
    };
}

// tools -- 根据坐标系的长度，确定平分线的数量
export function getAverageLine(dis) {
    if (!dis) return 1;
    // console.log(dis);

    let av_lines = 2; // 默认2等分
    if (dis < 300) {
        av_lines = 2;
    } else if (dis >= 300 && dis <= 600) {
        av_lines = 5;
    } else {
        av_lines = 10;
    }

    return av_lines;
}

// 计算条形的圆角（圆角的最大宽度， 圆角的大小）
export function getRound(barWidth, round) {
    let bar_round = (barWidth / 100) * round;
    bar_round = bar_round < 0 ? 0 : bar_round;
    return bar_round;
}

// tools -- 获取堆叠图 值范围
/**
 *
 * @param {object} pData
 * @param {number} limit 取值范围
 */
export function getStackedRanges(pData, _limit) {
    let limit = _limit && typeof _limit === 'number' ? _limit : Infinity;
    return getAllCate(pData.data)
        .slice(0, limit)
        .reduce(([SumMin = 0, SumMax = 0], { id }) => {
            const [IdSumMin, IdSumMax] = getDataById(pData, id).reduce(
                ([min = 0, max = 0], { y: _y }) => {
                    const y = Number(_y);
                    if (isNaN(y)) return [min, max];
                    return [y > 0 ? min : min + y, y > 0 ? max + y : max];
                },
                [],
            );
            return [Math.min(SumMin, IdSumMin), Math.max(SumMax, IdSumMax)];
        }, []);
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
 * y轴刻度的最大值(堆叠竖图)
 * @param {object} pData
 * @param {number} limit 取值范围
 */
export function getStackY_max(pData, _limit) {
    let limit = Infinity;
    if (_limit && typeof _limit === 'number') {
        limit = _limit;
    }
    return getAllCate(pData.data)
        .slice(0, limit)
        .reduce((prev, curr) => {
            const { id } = curr;
            const sumById = getDataById(pData, id).reduce((prev, { y = 0 }) => prev + y, 0);
            return Math.max(prev, sumById);
        }, 0);
}

/**
 * 弧度起始信息列表 与 百分比
 * @param {*} curData  当前图表的数据集合
 * @param {*} s_angle 自定义
 * @param {*} e_angle
 * @returns
 */
export function getAngleAry(curData, s_angle = 0, e_angle = 360, sum) {
    let angleAry = [];
    let percentAry = []; // 百分比列表
    let maxStrLen = 0; // 最多文字最大宽度
    let maxStr = '';
    let total = 0;

    // 获取自定义角度范围
    let angle_range = dir_to_angle(s_angle, e_angle);
    angle_range = angle_range === 360 ? 360 : angle_range % 360;

    curData.forEach((item, index, data) => {
        const abs_y = Math.abs(parseFloat(item.y));

        // 获取当前文字最大宽度
        const curStrLen = getFontWidth(`${item.x}`);
        if (maxStrLen < curStrLen) {
            maxStrLen = curStrLen;
            maxStr = item.x;
        }

        const pre = abs_y === 0 ? 0 : abs_y >= sum ? 1 : abs_y / sum;

        const obj = {
            ...item,
            x: `${item.x}`,
            y: item.y,
            total: total,
            start: 0,
            end: pre > 0 && (pre * angle_range) % 360 === 0 ? 360 : (pre * angle_range) % 360,
            angle: pre > 0 && (pre * angle_range) % 360 === 0 ? 360 : (pre * angle_range) % 360,
            percent: item.y >= 0 ? pre : 0 - pre,
        };

        percentAry.push(pre);
        angleAry.push(obj);
    });

    // console.log(angleAry);
    return {
        angleAry,
        percentAry,
        maxStrLen,
        maxStr,
    };
}

// 顺逆时针计算实际角度
function dir_to_angle(s, e) {
    let res_angle = 0;
    const diff = Math.abs((e % 360) - (s % 360));
    if (s <= e) {
        res_angle = 360 - diff;
    } else {
        res_angle = diff;
    }
    return res_angle;
}

// 数据总和
export function getSum(curData) {
    let sum = curData.reduce((add, cur) => add - 0 + Math.abs(cur.y - 0), 0);
    return sum;
}

/**
 *获取系列最大值 和 最小值
 * @param  {object} 系列的对象数组
 */
export function getSeries_max_min(data) {
    console.log(data);
    if (!data) return;
    let max = 0;
    let min = 0;
    let ary = [];

    if (data instanceof Object) {
        if (JSON.stringify(data) === '{}') return;
        for (let key in data) {
            if (data[key] instanceof Array) {
                ary.push(Math.max.apply(Math, data[key]));
            }
        }
    }
    max = Math.max.apply(Math, ary);
    min = Math.min.apply(Math, ary);
    return {
        max,
        min,
    };
}

/**
 * 获取类别最大值 和 最小值
 * @param  {object} 系列的对象数组
 */
export function getCategory_max_min(data) {
    // console.log(data);
    if (!data) return;
    let max = 0;
    let min = 0;

    let max_ary = [];
    let min_ary = [];

    if (data instanceof Object) {
        if (JSON.stringify(data) === '{}') return;
        for (let key in data) {
            if (data[key] instanceof Array) {
                max_ary.push(
                    data[key].reduce((a, b) => {
                        return b > 0 ? a + b : a;
                    }, 0),
                );
                min_ary.push(
                    data[key].reduce((a, b) => {
                        return b < 0 ? a + b : a;
                    }, 0),
                );
            }
        }
    }
    // console.log(max_ary, min_ary);
    max = Math.max.apply(Math, max_ary);
    min = Math.min.apply(Math, min_ary);
    return {
        max: max || 0,
        min: min || 0,
    };
}

// tools -- 小数精度检测，误差小返回true, 误差大返回false
function fixFloat(left, right) {
    return Math.abs(left - right) < Number.EPSILON;
}
/**
 * 尾数太长的数字，截取并向上取整
 * @param {number} num  当前数值
 * @param {number} len  循环的话，数组长度
 * @param {number} i    循环的话，当前序列
 * @returns
 */
export function handleDec(num, len, i) {
    let res = num;

    // const absText = Math.abs(num);
    // if (absText >= 1) return res;

    const splitNum = num.toString().split('.');
    // 小数点前的字符
    let before_str = String(Math.abs(splitNum[0]));
    // 小数点后的字符
    let after_str = splitNum[1];
    let reg = /(^0*)?([^0]*\d*)/;

    // 小数点连续为零的个数
    let zero_str = reg.exec(after_str)[1];
    // 小数中非零的数字
    let noZero_val = reg.exec(after_str)[2];

    if (after_str && noZero_val.length > 2) {
        let trans_val = noZero_val.slice(0, 2);
        // 非零数值取整
        let round_val = trans_val / Math.pow(10, trans_val.length - 1);
        round_val = String(Math.round(round_val) * Math.pow(10, trans_val.length - 1));

        // 如果向上取整数值是10的倍数，长度会增加一位，连续零位就删去一个0
        let _zero_str = '';
        if (zero_str) {
            _zero_str = zero_str;
            if (round_val.length > trans_val.length) {
                _zero_str = zero_str.substring(0, zero_str.length - 1);
            }
        }

        const cmp_num = (num > 0 ? '' : '-') + before_str + '.' + _zero_str + round_val;
        let newVal = parseFloat(cmp_num);
        // 进行精度对比,误差小返回true, 误差大返回false
        if (fixFloat(num, newVal)) {
            res = newVal;
        } else {
            const cmp_num = (num > 0 ? '' : '-') + before_str + '.' + _zero_str + trans_val;
            res = parseFloat(cmp_num);
        }

        if (len && typeof i === 'number') {
            res = i === len - 1 ? before_str : newVal;
        }
    }
    return res;
}

/**
 * 超出宽度显示省略号
 * @param {string} str
 * @param {number} limitW
 * @param {number} font_size
 * @param {string} font_family
 * @returns
 */
export function ellipsisW(str, limitW, font_size, font_family) {
    let subStr = str;
    let subIndex = 0;
    for (let i = 1; i < str.length; i++) {
        let _subStr = str.slice(0, i);
        const fontW = getFontWidth(_subStr, font_size, font_family);
        if (fontW > limitW) {
            subIndex = i;
            break;
        }
    }
    if (subIndex) {
        subStr = str.slice(0, subIndex - 1) + '...';
        if (getFontWidth(subStr, font_size, font_family) > limitW) {
            subStr = str.slice(0, subIndex - 2) + '...';
        }
    }

    return subStr;
}

export function ellipsisH(str, limitH, lineH) {
    let subStr = str;
    let str_ary = str.split('');
    let totalH = 0;
    let subIndex = 0;
    for (let i = 1; i < str_ary.length; i++) {
        totalH = lineH * i;
        if (totalH > limitH) {
            subIndex = i;
            break;
        }
    }
    if (subIndex) {
        let _str_ary = str_ary.slice(0, subIndex - 3);
        _str_ary.push('...');
        subStr = _str_ary.join('');
        if (lineH * subStr.length > limitH) {
            _str_ary = str_ary.slice(0, subIndex - 4);
            _str_ary.push('...');
            subStr = _str_ary.join('');
        }
    }
    return subStr;
}
