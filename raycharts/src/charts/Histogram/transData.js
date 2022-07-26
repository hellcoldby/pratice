/**
 * 直方图数据
 *
 * 只支持 第一个系列的数据
 *
 * y轴取值
 * 1. 从小到大排序
 * 2. 统计各个数据出现的次数 ，作为y 轴的值
 *
 * x轴取值
 *
 * 1. 均分数量 = 数据长度的开方，并向上取整。
 * 2. 间隔数值 = 最大值 - 最小值， 并向上取整
 */
import { getData } from '../../guide/coordinate/guide_common';

function transData(data, configData) {
    // console.log(data);
    const transData = {
        DEPRECATED_data: [], //原始数据
        categoryList: [], //x轴标签
        seriesList: data.seriesList,
        DEPRECATED_series: data.DEPRECATED_series,
        dataBaseSeries: [], //y值 数组
        perBaseSeries: [], // 百分比 数组
        x_axios_divide_per: 0, //开启自定义刻度 和 自定义分度后 x轴不能均分时的百分比
    };

    const {
        draw_coor: {
            scale: {
                range: {
                    open: coor_open, // 开关默认关
                    max: coor_max, // 量程最大值
                    min: coor_min, // 量程最小值
                },
            },
            division: {
                a_div: {
                    visible: a_div_disable, // 大分度显隐
                    num: a_div_num, // 分度值
                    value: a_div_value, // 分度值
                },
            },
        },
    } = configData.guide;

    //1.获取第一个系列的数据
    const get_data = getData(data);

    const first_data = get_data.sort((a, b) => a.y - b.y);

    //2.统计数据出现的次数
    const value_array = []; //原始y值的集合
    //    let trim_value_array = []; //去重

    first_data &&
        first_data.forEach((item) => {
            value_array.push(item.y);
        });

    if (!value_array.length) return transData;

    //3.均分 = 数据量的开方，并向上取整
    let divide = Math.ceil(Math.sqrt(value_array.length));

    //4.均分数值  =（最大值 - 最小值）/ 均分数量 并向上取整
    let min = 0;
    let max = 0;

    if (coor_open) {
        min = coor_min;
        max = coor_max;
    } else {
        min = Math.min.apply(null, value_array);
        max = Math.max.apply(null, value_array);
    }

    //如果数值都一样,规则是最大值加一，最小值减一
    if (max === min && max !== 0) {
        min -= 1;
        max += 1;
    }
    const diff = max - min;
    let divide_data = Math.ceil(diff / divide);

    if (coor_open && a_div_disable && a_div_value) {
        //用户自定义
        divide_data = a_div_value;
        divide = Math.ceil(diff / divide_data);
    }

    //5. 计算均分范围区间
    const divide_range = [];
    for (let i = 0; i <= divide; i++) {
        let cur_value = min + divide_data * i;
        if (coor_open && cur_value >= max) {
            transData.x_axios_divide_per = (divide_data - (cur_value - max)) / divide_data;
            cur_value = max;
        }
        divide_range.push(cur_value);
    }
    // 最后一项等于最大值要多增加一个展示范围
    if (divide_range[divide_range.length - 1] === max && !coor_open) {
        divide_range.push(max + divide_data);
    }

    //    console.log('区间范围：------', divide_range);
    //    console.log('真实值  ---------', value_array);

    //6.区间内，数值出现的次数
    const tmp_obj = {}; // 区间数值对应的次数
    const copy_value_array = [...value_array];
    divide_range.forEach((item, index) => {
        const rang_min = min + divide_data * index; //区间范围较小值
        const rang_max = rang_min + divide_data; //区间范围较大值
        const act_values = []; //真实值对应的区间
        for (let i = 0; i < copy_value_array.length; i++) {
            const t = copy_value_array[i];
            if (t >= rang_min && t < rang_max) {
                act_values.push(t);
                if (!tmp_obj[item]) {
                    tmp_obj[item] = 1;
                } else {
                    tmp_obj[item]++;
                }
                copy_value_array.splice(i, 1);
                i--;
            }
        }

        if (index < divide_range.length - 1) {
            transData.dataBaseSeries.push(act_values.length); // 区间匹配的数值，出现的次数
        }
        transData.categoryList.push({ cid: index + 1, categoryName: divide_range[index] }); //x轴标签
        transData.DEPRECATED_data.push({
            from: 1,
            id: index,
            ac_val: `[${act_values}]`,
            x: divide_range[index],
            y: tmp_obj?.[item] || 0,
        });
    });

    if (transData.dataBaseSeries.length) {
        const sum = transData.dataBaseSeries.reduce((sum, cur) => {
            return sum + cur;
        });
        transData.perBaseSeries = transData.dataBaseSeries.map((item) => {
            return (item / sum * 100).toFixed(2)-0 ;
        });
    }

    console.log(transData);

    return transData;
}

export default transData;
