/*
 * @Description:
 * @Author: ygp
 * @Date: 2021-08-19 14:44:01
 * @LastEditors: ygp
 * @LastEditTime: 2021-08-19 15:09:18
 */
import { Group } from '../../shape';
// 获取最大值
export function getMax(ary) {
    let max_val = 0; // 最大值
    let max_per = 0; // 最大百分比
    for (let i = 0; i < ary.length; i++) {
        if (ary[i].y && ary[i].y > max_val) {
            max_val = ary[i].y;
        }
        if (ary[i].percent && ary[i].percent > max_per) {
            max_per = ary[i].percent;
        }
    }
    return {
        max_val,
        max_per,
    };
}

// 获取最小值
export function getMin(ary) {
    // console.log(ary);
    let min_val = ary[0]?.y || 0; // 最大值
    let min_per = ary[0]?.percent || 0; // 最大百分比
    for (let i = 0; i < ary.length; i++) {
        if (ary[i].y && ary[i].y < min_val) {
            min_val = ary[i].y;
        }
        if (ary[i].percent && ary[i].percent < min_per) {
            min_per = ary[i].percent;
        }
    }
    return {
        min_val,
        min_per,
    };
}
