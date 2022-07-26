import * as zrender from 'zrender';
import { Group, Rect, Circle } from '../shape';
import { color as _color } from '../utils/color';
import { G_NAME, G_INDEX } from '../utils/common';

const renderLineType = (type, dashArray) =>
    type === 'solid' ? '' : type === 'dashed' ? dashArray : '';
const limitValue = (per, limit) => (limit * per) / 100;

// 旋转 圆角位置
const spinRadius = (radiusArray, degree) => {
    const moveNumber = Math.abs(Math.floor(degree / 90)) % 4;
    // 90deg : [1, 2, 3, 4] => [4, 1, 2, 3]
    const targetArray = radiusArray.slice(-moveNumber).concat(radiusArray.slice(0, -moveNumber));
    return targetArray;
};

/**
 * @method renderBar
 * @description 渲染生成柱子组
 * @param {Object} configData 配置项
 * @param {Object} config 设置参数
 * @returns {sub} 柱子组，图形定位在底部中点
 * @example
 * config: {
 *  name: 名称
 *  size: Arr:[宽度, 高度]
 *  offsetR: 旋转角度(度数)
 *  majorColor: 填充主要颜色
 *  _baseZ: 图形层级, 不传使用默认层级
 * }
 */
function renderBar(configData) {
    const {
        // graph_width: Bar_Width, // 柱子的宽度
        // space: Bar_GapHeight, // 柱子的缝隙
        light: {
            opacity: BarLight_Opacity, // 柱子的透明度
            extent: BarLight_Extent, // 柱子发光范围
        },
        // inset: {
        //     h: insetH, // 内阴影宽
        //     v: insetV, // 内阴影高
        //     blur: insetBlur, // 内阴影模糊
        // },
        outset: {
            h: BarOutset_H, // 外阴影宽
            v: BarOutset_V, // 外阴影高
            blur: BarOutset_Blur, // 外阴影模糊
        },
        // texture: bar_texture, // 柱子的背景纹理
        // area: {
        //     visible: area_visible, // 面积显示
        //     opacity: area_opacity, // 面积透明度
        // },
        border: {
            line_type: BarBorder_Type, // 柱子边框样式
            dash_array: BarBorder_dashArray,
            radius: {
                // 柱子的圆角
                tleft: Bar_BR_TLeft,
                tright: Bar_BR_TRight,
                bright: Bar_BR_BRight,
                bleft: Bar_BR_BLeft,
            },
            // corner_type: Bar_BorderCornerType, // 柱子的圆角的样式（直角， 圆弧）
            line_width: BarBorder_Width, // 柱子边框的宽度
        },
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

    // 柱子的【颜色】
    const {
        // colors: ColorList, // 柱子的颜色列表
        // max: Bar_MaxColor, // 最大值柱子颜色
        // min: Bar_MinColor, // 最小值柱子颜色
        border: BarBorder_Color, // 柱子边框颜色
        // inset: BarInset_Color, // 柱子内阴影颜色
        outset: BarOutset_Color, // 柱子外阴影颜色
    } = configData.default_theme.graph;

    // 背景槽的【颜色】
    // let {
    //     color: Slot_BGColor, // 槽位的背景色
    //     border: Slot_BorderColor, // 槽位的边框色
    //     // inset: Slot_InsetColor, // 槽位的内阴影的颜色
    //     outset: Slot_OutsetColor, // 槽位外阴影的颜色
    // } = configData.default_theme.slot;

    return (config) => {
        const {
            name: baseName,
            _baseZ,
            size: [width, height],
            offsetR,
            majorColor,
        } = config;

        // 方法包装 色彩旋转
        const color = (colorStr, dynamicParam = {}) =>
            _color(colorStr, {
                degree: (dynamicParam?.degree ?? 0) + offsetR - 90,
                ...dynamicParam,
            });

        // 外层容器组
        const BarGroup = new Group({ name: `${G_NAME.shape} ${baseName}` });

        // 判空
        if (height === 0) return BarGroup;

        // 柱子及其特效组 基础配置
        const BasicEffectConfig = {
            z: _baseZ || G_INDEX.shape,
            z2: 1,
            shape: {
                width: width,
                height: Math.abs(height),
                x: -width / 2,
                r: spinRadius(
                    [
                        limitValue(Bar_BR_TLeft, width),
                        limitValue(Bar_BR_TRight, width),
                        limitValue(Bar_BR_BRight, width),
                        limitValue(Bar_BR_BLeft, width),
                    ],
                    offsetR,
                ),
            },
            style: {
                fill: color(majorColor),
            },
        };

        // 柱子及其特效组
        BarGroup.add(
            // 柱子 主体
            new Rect(BasicEffectConfig).attr({
                name: `bar main ${baseName}`,
                z2: 5,
                cursor: 'default',
            }),
            // .on('click', (e) => console.log(e.target?.name ?? e.target)),
        )
            .add(
                // 描边 border
                BarBorder_Width === 0
                    ? null
                    : new Rect(BasicEffectConfig).attr({
                          name: `bar border ${baseName}`,
                          z2: 7,
                          silent: true,
                          style: {
                              fill: 'transparent',
                              stroke: color(BarBorder_Color),
                              lineWidth: limitValue(BarBorder_Width, width),
                              lineDash: renderLineType(BarBorder_Type, BarBorder_dashArray),
                              lineCap: 'square',
                          },
                      }),
            )
            .add(
                // 发光 light
                BarLight_Opacity === 0 || BarLight_Extent === 0
                    ? null
                    : new Rect(BasicEffectConfig).attr({
                          name: `bar light ${baseName}`,
                          z2: 6,
                          silent: true,
                          style: {
                              shadowOffsetX: 0,
                              shadowOffsetY: 0,
                              shadowBlur: limitValue(BarLight_Extent, 200),
                              shadowColor: color(majorColor, { opacity: BarLight_Opacity / 100 }),
                          },
                      }),
            )
            .add(
                // 投影 outset
                BarOutset_H === 0 && BarOutset_V === 0 && BarOutset_Blur === 0
                    ? null
                    : new Rect(BasicEffectConfig).attr({
                          name: `bar outset ${baseName}`,
                          z2: 3,
                          silent: true,
                          style: {
                              shadowOffsetX: limitValue(BarOutset_H, 100),
                              shadowOffsetY: limitValue(BarOutset_V, 100),
                              shadowBlur: limitValue(BarOutset_Blur, 200),
                              shadowColor: color(BarOutset_Color),
                          },
                      }),
            );

        return BarGroup;
    };
}

export default renderBar;
