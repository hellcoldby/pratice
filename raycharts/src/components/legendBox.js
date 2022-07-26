import * as zrender from 'zrender';
import { Group, Rect, Ellipse, Text } from '../shape';
import { color } from '../utils/color';
import { G_NAME, G_INDEX } from '../utils/common';

const renderLineType = (type) => (type !== 'solid' ? [2, 2, 2, 2] : '');
const limitValue = (per, limit) => (limit * per) / 100;

function legendBox(configData) {
    // 图例
    const {
        visible,
        width,
        height,
        position: Legend_Position,
        shape: Legend_Shape, //圆形， 菱形， 矩形， 三角形
        border: {
            line_type: Border_Type,
            line_width: Border_Width,
            radius: { tleft: Border_tl, tright: Border_tr, bright: Border_br, bleft: Border_bl },
        },
        font: { font_family, font_size, font_style, text_decoration, font_weight },
    } = configData.legend;

    // 图例颜色
    const {
        label: { border: label_borderColor, text_color: label_textColor, color: label_bgColor },
        background_color: Legend_BgColor,
        border: legend_borderColor,
    } = configData.default_theme.legend;

    const {
        open: open_animation, // 动画开启或者关闭，默认开启true
    } = configData.animation;

    // 图例对应数据系列的颜色
    const { colors: ColorList } = configData.default_theme.graph;

    return (config) => {
        const { name: baseName = '', zoom, maxWidth, maxHeight, seriesList = [] } = config;

        const legendBoxGroup = new Group({ name: `${G_NAME.legend} ${baseName}` });

        // 判断渲染逻辑
        if (!visible || width === 0 || height === 0 || seriesList.length === 0)
            return legendBoxGroup;

        // 位置判断宽高
        let BoxOutWidth = limitValue(width, maxWidth);
        let BoxOutHeight = limitValue(height, maxHeight);
        if (/t/.test(Legend_Position)) {
            BoxOutHeight = limitValue(height, (maxHeight * 30) / 100);
        } else if (/m/.test(Legend_Position)) {
            BoxOutWidth = limitValue(width, (maxWidth * 30) / 100);
        } else if (/b/.test(Legend_Position)) {
            BoxOutHeight = limitValue(height, (maxHeight * 30) / 100);
        }

        // 边框
        const strokeLimit = Math.min(BoxOutWidth, BoxOutHeight);
        const strokeWidth = limitValue(Border_Width, 20);

        // 背景盒子
        const boxSize = {
            shape: {
                x: 0,
                y: 0,
                width: BoxOutWidth,
                height: BoxOutHeight,
                r: [
                    limitValue(Border_tl, strokeLimit),
                    limitValue(Border_tr, strokeLimit),
                    limitValue(Border_br, strokeLimit),
                    limitValue(Border_bl, strokeLimit),
                ],
            },
        };
        legendBoxGroup
            .add(
                // 背景盒子
                new Rect(boxSize).attr({
                    name: `legendBox ${baseName}`,
                    silent: true,
                    z: G_INDEX.base,
                    style: {
                        fill: color(Legend_BgColor),
                        // 描边
                        stroke: color(legend_borderColor),
                        lineWidth: strokeWidth,
                        lineDash: renderLineType(Border_Type),
                    },
                }),
            )
            .setClipPath(new Rect(boxSize));

        // 图例 item
        const innerWidth = BoxOutWidth - strokeWidth;
        const legendItemSet = new Group({
            position: [strokeWidth / 2, strokeWidth / 2],
            name: `legendItemSet ${baseName}`,
        });
        // 添加所有元素 并且分行
        seriesList.reduce(
            ({ prevGroup, item_x, item_y }, { sid, seriesName }, index) => {
                // 渲染元素
                const item = renderLegendItem({
                    originConfig: configData,
                    baseName: `${sid}`,
                    maxWidth: innerWidth,
                    seriesName,
                    majorColor: ColorList[index % ColorList.length],
                    zoom,
                });
                let { width: item_Width, height: item_Height } = item.getBoundingRect();
                item_Width = Math.min(innerWidth, item_Width);
                // 节点排版
                let changeLine = false;
                let hGap = 8 * zoom;
                let vGap = 8 * zoom;
                // 判断
                if (/t|b/.test(Legend_Position)) {
                    changeLine = innerWidth < item_x + item_Width;
                    vGap = 0;
                } else if (/ml|mr/.test(Legend_Position)) {
                    changeLine = !(item_x === 0 && item_y === 0);
                    hGap = 0;
                }
                // 根据条件判断当前元素的渲染位置
                let curr_x = !changeLine ? item_x : 0;
                let curr_y = !changeLine ? item_y : item_y + item_Height;
                // 换行需要打组
                let lineGroup = prevGroup;
                if (changeLine || prevGroup === null) {
                    lineGroup = new Group({
                        name: `lineGroup ${index}`,
                        position: [0, curr_y],
                    });
                    legendItemSet.add(lineGroup);
                }
                // 元素加入行
                lineGroup.add(item.attr({ position: [curr_x, 0] }));
                // 返回值
                return {
                    prevGroup: lineGroup,
                    item_x: curr_x + item_Width + hGap,
                    item_y: curr_y + vGap,
                };
            },
            { prevGroup: null, item_x: 0, item_y: 0 },
        );

        // 内部定位调整
        const _deviation = 0;
        if (/(t|b)l/.test(Legend_Position)) {
        } else if (/(t|b)c/.test(Legend_Position)) {
            legendItemSet.children().forEach((sub) => {
                const { width: sub_width } = sub.getBoundingRect();
                const [sub_x, sub_y] = sub.position;
                const offsetX =
                    sub_width < innerWidth - _deviation ? (innerWidth - sub_width) / 2 : sub_x;
                sub.attr({ position: [sub_x + offsetX, sub_y] });
            });
        } else if (/(t|b)r/.test(Legend_Position)) {
            legendItemSet.children().forEach((sub) => {
                const { width: sub_width } = sub.getBoundingRect();
                const [sub_x, sub_y] = sub.position;
                const offsetX =
                    sub_width < innerWidth - _deviation ? innerWidth - sub_width : sub_x;
                sub.attr({ position: [sub_x + offsetX, sub_y] });
            });
        }

        legendBoxGroup.add(legendItemSet);

        // Animate
        const addAnimate =
            (_keyPath = '') =>
            (child, i) => {
                const keyPath = _keyPath ? `${_keyPath}_${i}` : `${i}`;
                if (child instanceof zrender.Group) {
                    if (child.childCount() !== 0) {
                        return child.eachChild(addAnimate(keyPath));
                    }
                }
                child
                    .attr('style', {
                        opacity: 0,
                    })
                    .animate('style')
                    .delay(0)
                    .when(800, { opacity: 1 })
                    .start();
                return child;
            };
        if (open_animation === true) legendBoxGroup.eachChild(addAnimate());
        return legendBoxGroup;
    };
}

export default legendBox;

/**
 * 图例元素渲染
 */
function renderLegendItem({ originConfig, baseName, maxWidth, seriesName, majorColor, zoom }) {
    const {
        shape: Legend_Shape, //圆形， 菱形， 矩形， 三角形
        font: { font_family, font_size, font_style, text_decoration, font_weight },
        shapeSize: { width: icon_width, height: icon_height },
    } = originConfig.legend;
    const {
        border: label_borderColor,
        text_color: label_textColor,
        color: label_bgColor,
    } = originConfig.default_theme.legend.label;

    const itemGroup = new Group({ name: `legendItem ${baseName ?? ''}`, silent: true });

    const [item_width, item_height] = [icon_width, Math.max(icon_height, font_size)];
    const itemPadding = font_size / 12;
    const itemGap = zoom * 2;

    const renderShape = (shape) => {
        const baseConfig = {
            z: G_INDEX.base,
            x: itemPadding + item_width / 2,
            y: itemPadding + item_height / 2,
            style: {
                fill: color(majorColor),
            },
        };
        switch (shape) {
            case 'circle':
                return new Ellipse({
                    ...baseConfig,
                    shape: {
                        x: -icon_width / 2,
                        y: -icon_height / 2,
                        rx: -icon_width / 2,
                        ry: -icon_height / 2,
                    },
                });
            case 'rectangle':
            default:
                return new Rect({
                    ...baseConfig,
                    shape: {
                        x: -icon_width / 2,
                        y: -icon_height / 2,
                        width: icon_width,
                        height: icon_height,
                    },
                });
        }
    };

    let shape = renderShape(Legend_Shape);

    let label = new Text({
        z: G_INDEX.base,
        style: {
            text: `${seriesName}`,
            fill: color(label_bgColor),
            fontSize: font_size || 1,
            // 样式
            textLineHeight: item_height || 1,
            fontFamily: font_family,
            fontStyle: font_style,
            fontWeight: font_weight,
            // 颜色
            fill: color(label_textColor),
            // 最大宽度
            truncate: {
                outerWidth: maxWidth ?? 'unset',
                ellipsis: '...',
            },
            // 文字描边
            textStroke: color(label_borderColor),
            // textStrokeWidth: 1,
            // 布局
            verticalAlign: 'middle',
        },
    });

    const { width: labelWidth, height: labelHeight } = label.getBoundingRect();

    label.attr({
        x: itemPadding + item_width + itemGap,
        y: itemPadding + item_height / 2,
    });

    itemGroup.add(shape).add(label);

    return itemGroup;
}
