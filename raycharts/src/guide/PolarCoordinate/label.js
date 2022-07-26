/*
 * Description:绘制轴标签
 * Author: vicky
 * Date: 2020-11-10 17:12:55
 * LastEditTime: 2020-11-23 14:17:48
 * FilePath: \packages\raycharts\src\guide\PolarCoordinate\label.js
 */
import { getColumns, getTextPosition } from '../../charts/public/polygon';
import { measureText } from '../../utils/tool';
import { color } from '../../utils/color';
import { Group, Rect, Text } from '../../shape';
import { G_NAME, G_INDEX } from '../../utils/common';
import _ from 'lodash';
/**
 * @method drawCoorLabel
 * @description 绘制轴标签
 * @private
 * @param {*} params
 */
export function drawCoorLabel(params) {
    const {
        configData: {
            guide: { pcoor, paxis },
            default_theme: { guide },
        },
    } = params;

    let tx = guide.pcoor;
    let ty = guide.paxis;
    // 获取网格数据
    const colData = getColumns(params);
    const { textPoints, numPoints } = colData;
    // 网格分栏文本
    let textFont = { ...pcoor.font, colors: { ...tx.label } };

    // 网格分栏数据
    let numFont = { ...paxis.font, colors: { ...ty.label } };

    // 绘制最大值
    const mp = _.last(numPoints);
    let textSize = measureText(mp.colValue, {
        fontFamily: numFont.font_family,
        fontSize: numFont.font_size,
        fontWeight: numFont.font_weight,
        fontStyle: numFont.font_style,
    });
    const cons = [
        {
            x: mp.x - textSize.width / 2,
            y: mp.y + 12,
            angle: mp.angle,
            text: mp.colValue,
        },
    ];
    let groupArr = [];
    // 绘制极轴
    if (paxis.text_visible) {
        groupArr.push(
            drawTexts({
                name: G_NAME.pALabel,
                zIndex: G_INDEX.base,
                contents: cons,
                style: numFont,
                path: 'text',
                cx: mp.centerX,
                cy: mp.centerY,
                r: mp.radius,
            }),
        );
    }
    // 绘制极坐标
    if (pcoor.text_visible) {
        groupArr.push(
            drawTexts({
                name: G_NAME.pCoorLabel,
                zIndex: G_INDEX.base,
                contents: textPoints.info,
                style: textFont,
                path: 'cate.categoryName',
                cx: textPoints.centerX,
                cy: textPoints.centerY,
                r: textPoints.radius,
            }),
        );
    }
    return groupArr;
}

/**
 * @method drawTexts
 * @description 绘制文本数组
 * @param {Array} contents 绘制的内容
 * @param {Object} Style
 * @param {String} path 内容识别路径,不填写默认读取当前对象的text字段
 */
function drawTexts(param) {
    const { name, zIndex, contents, style, path, cx, cy, r } = param;
    let textpath = path ? path : 'text';
    let textGroup = new Group({ name });
    contents.forEach((item) => {
        // 获取文本
        let textStr = _.get(item, textpath, '');
        // 获取基本样式属性
        let defaultColor = 'rgba(255,255,255,1)';
        let textColor = color(_.get(style.colors, 'text_color', defaultColor));
        let borderColor = color(_.get(style.colors, 'border', null));
        let bgColor = color(_.get(style.colors, 'color', null));
        let fontFamily = _.get(style, 'font_family', '微软雅黑');
        let fontSize = _.get(style, 'font_size', '14');
        let fontWeight = _.get(style, 'font_weight', 'normal');
        let fontStyle = _.get(style, 'font_style', 'normal');

        // 获取文本宽高
        let textSize = measureText(textStr, {
            fontFamily,
            fontSize,
            fontWeight,
            fontStyle,
        });
        // 获取文本实际x，y
        const tq = getTextPosition(
            { cx, cy, r },
            {
                x: item.x,
                y: item.y,
                width: textSize.width,
                height: textSize.height,
            },
        );

        const text = new Text({
            style: {
                text: textStr,
                fill: textColor,
                fontStyle,
                fontWeight,
                fontSize,
                fontFamily,
                align: 'center',
                verticalAlign: 'middle',
            },
        });

        const rect = new Rect({
            name: 'label',
            z: zIndex,
            origin: [tq.x, tq.y],
            cursor: 'default',
            shape: {
                x: tq.x,
                y: tq.y,
                width: textSize.width,
                height: textSize.height,
            },
            style: {
                opacity: 1,
                fill: bgColor,
                stroke: borderColor,
            },
            textConfig: {
                position: 'inside',
            },
            textContent: text,
        });
        textGroup.add(rect);
    });
    return textGroup;
}
