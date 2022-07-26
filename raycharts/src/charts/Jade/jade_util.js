/*
 * @Description:
 * @Author: ygp
 * @Date: 2021-08-19 15:32:36
 * @LastEditors: ygp
 * @LastEditTime: 2021-08-19 15:55:33
 */
import { getData } from '../../guide/coordinate/guide_common';
// tool -- 顺逆时针计算实际角度
export function dir_to_angle(s, e, dir) {
    let res_angle = 0;
    const diff = Math.abs(e - s);
    if (s <= e) {
        // res_angle = dir ? 360 - diff : diff;
        res_angle = 360 - diff;
    } else {
        // res_angle = dir ? diff : 360 - diff;
        res_angle = diff;
    }
    return res_angle;
}

/**
 *  -- 将数据转换为角度
 * @param {object} options 外部传递来的全部属性
 * @param {array} newAry 数据集合
 * @param {number} max  数据集合中的最大值
 * @param {number} min  数据集合中的最小值
 * @returns 角度集合、 自定义角度范围、 百分比角度集合
 */
export function toAngle(options, newAry, max, min) {
    const { jade_s_angle, jade_e_angle, ccw, scale_max, scale_min, scale_open } = options;

    if (scale_open) {
        max = isNumber(scale_max) ? scale_max : max;
        min = isNumber(scale_min) ? scale_min : min;
    }
    // console.log(max);
    // 获取自定义角度范围
    const actual_angle = dir_to_angle(jade_s_angle, jade_e_angle, ccw);

    let angle_list_per = [];

    const angle_list = newAry.map((item, index, ary) => {
        if (typeof item.y !== 'number' && !item.y) return item;
        let per = 0;
        if (item.y >= min) {
            if (scale_open && item.y >= max) {
                ary[index].y = max;
            }
            if (max >= 0 && min >= 0) {
                // 全正值
                per = scale_open ? (item.y - min) / (max - min) : item.y / max;
            } else if (max <= 0 && min <= 0) {
                // 全负值
                per = scale_open ? (item.y - min) / (max - min) : item.y / min;
            } else {
                // 既有正值又有负值
                per = Math.abs(item.y - min) / Math.abs(max - min);
            }
        }
        angle_list_per.push(item.y >= 0 ? per : 0 - per);
        return per === 1 && actual_angle === 360 ? 360 : (per * actual_angle) % 360;
    });
    // console.log(angle_list);
    return { angle_list, actual_angle, angle_list_per };
}

// tool -- 修正环形的起始角度
export function fixAngle(angle, start_angle = 0, ccw) {
    let res = -start_angle + angle * (ccw ? 1 : -1);
    return res;
}
/**
 * tool -- 将角度转为弧度
 * @param {*} angle  实际角度
 * @param {*} start_angle  起始角度
 */
export function toArc(angle, start_angle = 0, ccw) {
    const res = fixAngle(...arguments);
    const deg = (Math.PI / 180) * res;
    return deg;
}

// tool -- 检测数字
export function isNumber(val) {
    return typeof val === 'number' && !isNaN(val);
}

// tool -- 气泡圆角
export function act_br(min, r) {
    return (min * r) / 100;
}

/**
 *  tool -- 获取每个系列下的第一个值
 * @param {object} data 图形数据
 * @param {boolean} del_null 是否删除空值
 */
export function getFirstData(data, del_null) {
    const series = data.series ? data.series : data.seriesList;
    let newAry = [];
    series.forEach((item, index) => {
        let tmp = getData(data, index);
        tmp[0][`seriesName`] = item.seriesName;
        tmp[0][`_order`] = index;
        if (del_null && (tmp[0].y === null || tmp[0].y === undefined || tmp[0].y === '')) {
            // nothing  删除空值
        } else {
            tmp.length && newAry.push(tmp[0]);
        }
    });

    return newAry;
}

// tool -- 获取最大值
export function getMax(ary) {
    let max_val =  ary[0].y; // 最大值
    let max_per = ary[0].percent; // 最大百分比
    for (let i = 0; i < ary.length; i++) {
        if (ary[i].y > max_val) {
            max_val = ary[i].y;
        }
        if (ary[i].percent > max_per) {
            max_per = ary[i].percent;
        }
    }
    return {
        max_val,
        max_per,
    };
}

// tool -- 获取最小值
export function getMin(ary) {
    // console.log(ary);
    if (ary.length === 0) {
        return {
            min_val: 0,
            min_per: 0,
        };
    }
    let min_val = ary[0].y; // 最大值
    let min_per = ary[0].percent; // 最大百分比
    for (let i = 0; i < ary.length; i++) {
        if (ary[i].y < min_val) {
            min_val = ary[i].y;
        }
        if (ary[i].percent < min_per) {
            min_per = ary[i].percent;
        }
    }
    return {
        min_val,
        min_per,
    };
}

// tool -- 循环颜色
export function getLoopCoor(i, colorAry) {
    return color(colorAry[i % colorAry.length]);
}

// tool -- 改变颜色透明度
export function changeRgbaOpacity(cur_color, opacity) {
    return cur_color.replace(/rgba\((\d+,\d+,\d+,)(\d+(\.\d)?)\)/g, `rgba($1${opacity})`);
}
// 根据象限位置计算 数值气泡需要选择的角度
export function InQuadrant(angle) {
    let num = 1;
    let rotate = 0;
    if (angle > 0) {
        if (0 <= angle && angle < 90) {
            num = 1;
            rotate = 90 - angle;
        } else if (90 <= angle && angle < 180) {
            num = 2;
            rotate = angle - 90;
        } else if (180 <= angle && angle < 270) {
            num = 3;
            rotate = 270 - angle;
        } else {
            num = 4;
            rotate = angle - 270;
        }
    } else {
        if (angle <= -270 && angle > -360) {
            num = 1;
            rotate = -(270 + angle);
        } else if (angle <= -180 && angle > -270) {
            num = 2;
            rotate = 270 + angle;
        } else if (angle <= -90 && angle > -180) {
            num = 3;
            rotate = -(90 + angle);
        } else {
            num = 4;
            rotate = 90 + angle;
        }
    }

    if (num === 1 || num === 3) {
        rotate *= -1;
    }

    return { num, rotate };
}
