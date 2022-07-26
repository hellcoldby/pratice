import * as zrender from 'zrender';
import { Group, Rect } from '../shape';
import { color as _color } from '../utils/color';
import { G_NAME, G_INDEX } from '../utils/common';

const renderLineType = (type) => (type !== 'solid' ? [2, 2, 2, 2] : '');
const limitValue = (per, limit) => (limit * per) / 100;

// 旋转 圆角位置
const spinRadius = (radiusArray, degree) => {
    const moveNumber = Math.abs(Math.floor(degree / 90)) % 4;
    // 90deg : [1, 2, 3, 4] => [4, 1, 2, 3]
    const targetArray = radiusArray.slice(-moveNumber).concat(radiusArray.slice(0, -moveNumber));
    return targetArray;
};

/**
 * @method renderSlot
 * @description 渲染生成槽位组
 * @param {Object} configData 配置项
 * @param {Object} config 设置参数
 * @returns {sub} 槽位组，图形定位在底部中点
 * @example
 * config: {
 *  name: 名称
 *  maxSize: Arr:[宽度最大值, 高度最大值]
 *  offsetY: 槽位顶端距零轴的距离
 *  offsetR: 旋转角度(度数)
 *  _baseZ: 图形层级, 不传使用默认层级
 * }
 */
function renderSlot(configData) {
    const {
        slot: {
            // image: slot_image,
            width: Slot_Width,
            // inset: { h: slot_insetH, v: slot_insetV,blur :slot_insetBlur},
            outset: { h: slot_outsetH, v: slot_outsetV, blur: slot_outsetBlur },
            border: {
                line_type: Slot_BorderType, //
                radius: {
                    tleft: Slot_BR_TLeft,
                    tright: Slot_BR_TRight,
                    bright: Slot_BR_BRight,
                    bleft: Slot_BR_BLeft,
                },
                // corner_type: Slot_BorderCornerType,
                line_width: Slot_BorderWidth,
            },
        },
    } = configData.general;

    // 背景槽的【颜色】
    let {
        color: Slot_BGColor, // 槽位的背景色
        border: Slot_BorderColor, // 槽位的边框色
        // inset: Slot_InsetColor, // 槽位的内阴影的颜色
        outset: Slot_OutsetColor, // 槽位外阴影的颜色
    } = configData.default_theme.slot;

    return (config) => {
        const {
            name: baseName,
            _baseZ,
            maxSize: [maxWidth, maxHeight],
            offsetY: [upperOffsetY],
            offsetR,
        } = config;

        // 方法包装 色彩旋转
        const color = (colorStr, dynamicParam = {}) =>
            _color(colorStr, {
                degree: (dynamicParam?.degree ?? 0) + offsetR - 90,
                ...dynamicParam,
            });

        // 数据计算
        const slotWidth = limitValue(Slot_Width, maxWidth);
        const slotHeight = maxHeight;
        const slotX = -slotWidth / 2;
        const slotY = -(maxHeight - upperOffsetY);

        const SlotSet = new Group({ name: `${G_NAME.slot} ${baseName}` });

        // slot style
        const slotBoxStyle = {
            z: _baseZ || G_INDEX.slot,
            silent: true,
            shape: {
                width: slotWidth,
                height: maxHeight,
                x: slotX,
                y: slotY,
                r: spinRadius(
                    [
                        limitValue(Slot_BR_TLeft, slotWidth),
                        limitValue(Slot_BR_TRight, slotWidth),
                        limitValue(Slot_BR_BRight, slotWidth),
                        limitValue(Slot_BR_BLeft, slotWidth),
                    ],
                    offsetR,
                ),
            },
        };

        // 槽位 slot
        SlotSet.add(
            new Rect(slotBoxStyle).attr({
                name: `bar slot stroke ${baseName}`,
                z2: 1,
                style: {
                    fill: 'transparent',
                    stroke: color(Slot_BorderColor),
                    lineDash: renderLineType(Slot_BorderType),
                    lineWidth: limitValue(Slot_BorderWidth, slotWidth),
                    lineCap: 'square',
                },
            }),
        );

        SlotSet.add(
            new Rect(slotBoxStyle).attr({
                name: `bar slot main ${baseName}`,
                z2: 0,
                style: {
                    fill: color(Slot_BGColor),
                    shadowOffsetX: limitValue(slot_outsetH, 100),
                    shadowOffsetY: limitValue(slot_outsetV, 100),
                    shadowBlur: limitValue(slot_outsetBlur, 200),
                    shadowColor: color(Slot_OutsetColor),
                },
            }),
        );

        return SlotSet;
    };
}

export default renderSlot;
