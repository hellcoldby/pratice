/*
 * Description:图表绘制辅助内容
 * Author: vicky
 * Date: 2020-09-05 18:36:21
 * LastEditTime: 2021-10-28 17:18:10
 * FilePath: \packages\raycharts\src\charts\public\assist.js
 */
import { pointByRad, measureText } from '../../utils/tool';
import _ from 'lodash';

/**
 * @method getRound
 * @description  计算圆角
 * @param {*} radiusMax 半径最大值
 * @param {*} radius 半径百分比
 */
export function getRadius(radiusMax, radius) {
    let r = radiusMax * (radius / 100);
    r = r < 0 ? 0 : r;
    return r;
}

/**
 * @method getDrawArea
 * @description 获取绘制区域信息
 * @param {*} params
 * @param {*} lineWidthOpen 是否开启lineWidth计算
 */
export function getDrawAreaInfo(params) {
    const {
        maxWidth,
        maxHeight,
        configData: {
            general: { r },
        },
    } = params;
    const dAR = maxWidth > maxHeight ? maxHeight / 2 : maxWidth / 2;
    let c_r = dAR * (r / 100);
    return {
        cx: maxWidth / 2,
        cy: maxHeight / 2,
        r: c_r,
    };
}

/**
 * @method getOffsetDataInfo
 * @description 获取偏移之后的更新的dataInfo
 * @param {*} dataInfos 数据
 * @param {*} offsetPc 偏移量百分比
 */
export function getOffsetDataInfo(dataInfos, offsetPc) {
    let newDataInfos = [];
    !_.isEmpty(dataInfos) &&
        dataInfos.forEach((item) => {
            let newInfo = OffsetData(item, offsetPc);
            newDataInfos.push(newInfo);
        });
    return newDataInfos;
}

export function OffsetData(dataInfo, offsetPc) {
    let offset = dataInfo.r * (offsetPc / 100);
    let cx = dataInfo.cx,
        cy = dataInfo.cy,
        r = dataInfo.r + offset;
    let c_point = pointByRad(cx, cy, r, dataInfo.angle);
    return { ...dataInfo, x: c_point.x, y: c_point.y };
}

/**
 * @method getColorsByNum
 * @description 获取指定长度的颜色数组
 * @param {Object} colors 颜色块数组
 * @param {*} num 指定数量
 */
export function getColorsByNum(colors, num) {
    let newColors = [];
    if (num <= colors.length) {
        newColors = colors;
    } else {
        let aLen = colors.length;
        let count = Math.ceil(num / aLen);
        for (let i = 0; i < count; i++) {
            newColors.push(...colors);
        }
    }
    return newColors;
}

/**
 * @method getTextInfo 获取字符串信息（样式和size）
 * @param {*} str 字符串
 * @param {*} font 字体样式
 */
export function getTextSize(str, font) {
    //获取基本样式属性
    let fontFamily = _.get(font, 'font_family', '微软雅黑');
    let fontSize = _.get(font, 'font_size', '14');
    let fontWeight = _.get(font, 'font_weight', 'normal');
    let fontStyle = _.get(font, 'font_style', 'normal');
    return measureText(str, {
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
    });
}

/**
 * @method getOneCategory 获取数据中第一个分类值
 * @param {*} data
 */
export function getOneCategory(data) {
    let categories = [];
    let category = _.get(data, 'categoryList[0]', {});
    let c_id = _.get(category, 'cid');
    let c_data = _.get(data, `dataBaseCategory[${c_id}]`, []);
    !_.isEmpty(data.seriesList) &&
        data.seriesList.forEach((item, index) => {
            categories.push({
                ...item,
                ...category,
                value: c_data?.[index],
            });
        });
    return categories;
}
