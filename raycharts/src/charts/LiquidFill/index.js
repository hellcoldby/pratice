/*
 * Description:
 * Author: vicky
 * Date: 2021-10-28 14:31:28
 * LastEditTime: 2022-01-06 14:55:20
 * FilePath: \packages\raycharts\src\charts\LiquidFill\index.js
 */
import { Group, Droplet, Isogon, Circle, LiquidFill as liquidFillShape, Rect } from '../../shape';
import { getColorsByNum, getOneCategory } from '../public/assist';
import { G_NAME, G_INDEX, color } from '../../utils';
// import { addAnimate } from './animator';
import canMoveLabel from '../../components/canMoveLabel';
import { entryAnimator, loopAnimator } from '../../animation';
import { newWaveLoop, newGrow, fadeIn } from './animator';
import { addAnimate, setAnimType } from '../../animation/common';
import _ from 'lodash';

const supportPath = ['circle', 'diamond', 'rect', 'triangle', 'pentagon', 'droplet'];

function LiquidFill(config) {
    const { maxWidth: rootW, maxHeight: rootH, configData, chartData: pData, addHoverAction } = config;
    const {
        general: {
            column = 1,
            r,
            wavelength = 0,
            inverse,
            area,
            light,
            outset,
            amplitude = 100,
            shape = 'circle',
            slot,
            line,
        },
        data,
        guide: {
            padding,
            draw_coor: { scale },
        },
        animation: { open: aniOpen, entry: entryAnimatorList, loop: loopAnimatorList, speed = 50, direction = 'right' },
        default_theme: { graph, slot: slotTheme, data: dataTheme },
    } = configData;

    const shape_list = setAnimType(entryAnimatorList);
    const shape_anim_list = shape_list.getAnim('shape');
    //删除默认动画
    const isGrow = shape_list.delAnim(shape_anim_list,'grow');
    const isFadeIn = shape_list.delAnim(shape_anim_list,'fadeIn');
    const isScale = shape_list.delAnim(shape_anim_list, 'unfold');

    const graphics = new Group({ name: `Graphics` });
    let cData = getOneCategory(pData);
    if (!_.isEmpty(cData) && supportPath.includes(shape)) {
        let chartNum = cData.length;
        let colors = getColorsByNum(graph.colors, chartNum);
        //当前列数
        let curColumn = Math.min(column, chartNum);
        //当前有效绘图区域
        let left = getNumByPer(padding?.left, rootW);
        let top = getNumByPer(padding?.top, rootH);
        let right = getNumByPer(padding?.right, rootW);
        let bottom = getNumByPer(padding?.bottom, rootH);
        let curW = rootW - left - right;
        let curH = rootH - top - bottom;
        //图形区域宽高
        let aWidth = curW / curColumn;
        let row = Math.ceil(chartNum / curColumn);
        let aHeight = curH / row;
        //偏移量
        let offsetX = left;
        let offsetY = top;
        //columnCount 计数
        let columnCount = 0;
        const dataInfo = getDataInfo(cData, scale.range);
        //发光的透明度是在area透明度的基础上减弱的
        let areaO = area.opacity / 100;
        let lightO = light.opacity / 100;
        lightO = areaO !== 1 ? areaO * lightO : lightO;
        let shapeZ = G_INDEX.slot;
        dataInfo.forEach((item, index) => {
            columnCount++;
            //图形数组
            let waveItem = new Group({ name: `waveItem` });
            let slotGroup = new Group({ name: G_NAME.shape });
            let waveGroup = new Group({ name: G_NAME.shape });
            //槽位
            const { border } = slot;
            //圆心位置
            let cx = aWidth >= aHeight ? (aWidth - aHeight) / 2 + aHeight / 2 : aWidth / 2,
                cy = aHeight > aWidth ? (aHeight - aWidth) / 2 + aWidth / 2 : aHeight / 2;
            //线宽
            let lineWidth = (line.line_width / 100) * 20;
            let slotLineWidth = (border.line_width / 100) * 20;
            let borderDashArray = [5, 5];
            //半径、槽位半径
            let max_radius = Math.min(aWidth, aHeight) / 2;
            let radius = max_radius * (r / 100);
            let slotR = radius + (slot.width / 100) * radius * 0.1;
            //边框半径
            let cSlotR = slotR + slotLineWidth / 2;
            let diam = radius * 2;
            //波长
            let totalWaveLength = diam * 4;
            let waveLength = totalWaveLength * (wavelength / 100);
            //背景配置
            let bgShapeOptions = {
                cx: offsetX + cx,
                cy: offsetY + cy,
                x: offsetX + cx - radius,
                y: offsetY + cy - radius,
                r: radius,
                width: diam,
                height: diam,
            };
            //边框配置
            let borderOptions = {
                cx: offsetX + cx,
                cy: offsetY + cy,
                x: offsetX + cx - cSlotR,
                y: offsetY + cy - cSlotR,
                r: cSlotR,
                width: cSlotR * 2,
                height: cSlotR * 2,
            };
            //渐变绘制区域
            let colorPosition = {
                x: offsetX,
                y: offsetY,
                width: diam,
                height: diam,
            };
            //绘制波配置
            let wShapeOptions = {
                waveLength: waveLength,
                radius: radius + lineWidth / 2,
                cx: offsetX + cx,
                cy: offsetY + cy,
                waterLevel: item.percent,
                amplitude: radius * (amplitude / 100),
                radiusY: radius * 3,
                inverse: inverse,
            };
            let bgZIndex = shapeZ;
            if (item.value && item.value > 0) {
                //绘制水波投影
                const waveShadow = new liquidFillShape({
                    name: 'liquidFill',
                    z: ++shapeZ,
                    shape: wShapeOptions,
                    style: {
                        fill: area.visible
                            ? color(colors[index], {
                                  opacity: areaO,
                                  position: colorPosition,
                              })
                            : 'transparent',
                        stroke: color(colors[index], {
                            position: colorPosition,
                        }),
                        lineWidth: lineWidth,
                        lineDash: line.line_type === 'solid' ? null : line.dash_array,
                        opacity: 1,
                        shadowOffsetX: (outset.h / 100) * diam,
                        shadowOffsetY: (outset.v / 100) * diam,
                        shadowBlur: (outset.blur / 100) * 200,
                        shadowColor: color(graph.outset),
                    },
                });
                //绘制水波
                const wave = new liquidFillShape({
                    name: 'liquidFill',
                    z: ++shapeZ,
                    shape: wShapeOptions,
                    style: {
                        fill: area.visible
                            ? color(colors[index], {
                                  opacity: areaO,
                                  position: colorPosition,
                              })
                            : 'transparent',
                        stroke: color(colors[index], {
                            position: colorPosition,
                        }),
                        lineWidth: lineWidth,
                        lineDash: line.line_type === 'solid' ? null : line.dash_array,
                        opacity: 1,
                    },
                });
                //绘制波发光
                const waveLight = new liquidFillShape({
                    name: 'liquidFill',
                    z: ++shapeZ,
                    shape: wShapeOptions,
                    style: {
                        fill: area.visible
                            ? color(colors[index], {
                                  opacity: lightO,
                                  position: colorPosition,
                              })
                            : 'transparent',
                        stroke: color(colors[index], {
                            opacity: lightO,
                            position: colorPosition,
                        }),
                        lineWidth: lineWidth,
                        lineDash: line.line_type === 'solid' ? null : line.dash_array,
                        opacity: 1,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: (light.extent / 100) * 200,
                        shadowColor: color(colors[index], { opacity: lightO }),
                    },
                });
                waveGroup.add(waveShadow);
                waveGroup.add(wave);
                waveGroup.add(waveLight);
            }
            //槽位边框
            const shapeGraph = getGraph(shape, {
                name: shape,
                z: ++shapeZ,
                shape: borderOptions,
                style: {
                    fill: 'transparent',
                    stroke: color(slotTheme.border),
                    lineWidth: slotLineWidth,
                    opacity: 1,
                    lineDash: border.line_type === 'solid' ? null : borderDashArray,
                },
            });
            slotGroup.add(shapeGraph);
            //槽位背景
            const bgShape = getGraph(shape, {
                name: 'bgShape',
                z: bgZIndex,
                shape: bgShapeOptions,
                style: {
                    fill: color(slotTheme.color),
                    stroke: 'transparent',
                    lineWidth: 0,
                    opacity: 1,
                    shadowOffsetX: (slot.outset.h / 100) * diam,
                    shadowOffsetY: (slot.outset.v / 100) * diam,
                    shadowBlur: (slot.outset.blur / 100) * 200,
                    shadowColor: color(slotTheme.outset),
                },
                borderR: shapeGraph.shape.r - slotLineWidth / 2,
                lineWidth: slotLineWidth,
            });
            slotGroup.add(bgShape);
            waveGroup.setClipPath(
                getGraph(shape, {
                    shape: bgShapeOptions,
                    borderR: shapeGraph.shape.r - slotLineWidth / 2,
                    lineWidth: slotLineWidth,
                }),
            );
            //绘制数据
            if (data.visible) {
                let dataGroup = canMoveLabel({
                    g_name: G_NAME.data,
                    z: G_INDEX.data,
                    content:
                        data.type === 'normal'
                            ? item.value
                            : _.isNumber(item.value)
                            ? `${(item.percent * 100).toFixed(2)}%`
                            : null,
                    origin: { x: offsetX + cx, y: offsetY + cy },
                    maxOffset: diam,
                    dataOptions: data,
                    dataTheme,
                    showOpen: true,
                    textNumInfo: item,
                });
                aniOpen &&
                    dataGroup.eachChild((e) => {
                        //增加动画
                        addAnimate(e, ['fadeIn'],  800,0 );
                    });
                graphics.add(dataGroup);
            }
            waveItem.add(waveGroup);
            waveItem.add(slotGroup);
            //列尾重置偏移量
            offsetX += aWidth;
            if (columnCount === curColumn) {
                columnCount = 0;
                offsetX = left;
                offsetY += aHeight;
            }
            //增加动画
            let duringTime = speed === 0 || speed === 100 ? speed : 5000 * (1 - speed / 100);
            if (aniOpen) {
                waveGroup.eachChild((child) => {
                    if(isGrow){
                        entryAnimator(
                            child,
                            { grow: newGrow },
                            {
                                target: 'shape',
                                animatorList: entryAnimatorList,
                                duration: 1200,
                            },
                        );

                    }
                    if(isFadeIn){
                        // console.log(child);
                        addAnimate(child, ['fadeIn'], 2000, 500);
                        // fadeIn(child, {time:2000, delay:200, easing:null});
                    }
                    loopAnimator(
                        child,
                        { carousel: newWaveLoop },
                        {
                            target: 'shape',
                            animatorList: loopAnimatorList,
                        },
                    );
                    // addAnimate(child, 'grow', { time: 1200 });
                    // addAnimate(child, 'waveLoop', { time: duringTime, direction, delay: 1000 });
                });
            }
            //添加交互
            addHoverAction(waveItem, { cid: item.cid, sid: item.sid });
            graphics.add(waveItem);
        });
    }
    return graphics;
}

function getDataInfo(data, range) {
    const { open } = range;
    let dataInfo = [...data];
    let maxValue =
        _.maxBy(dataInfo, function(e) {
            return e.value;
        })?.value || 0;
    let minValue =
        _.minBy(dataInfo, function(e) {
            return e.value;
        })?.value || 0;
    if (open) {
        // TODO:待补充开启量程数据计算规则
    } else {
        let total = _.sumBy(data, function(e) {
            return Math.abs(e.value);
        });
        dataInfo.forEach((item) => {
            item.percent = item.value ? item.value / total : null;
            item.value === maxValue ? (item.isMax = true) : (item.isMax = false);
            item.value === minValue ? (item.isMin = true) : (item.isMin = false);
        });
    }
    return dataInfo;
}

function getNumByPer(per, global) {
    if (per) {
        return global * 0.1 * (per / 100);
    }
    return 0;
}

//图形配置信息
const shapeInfo = {
    circle: {
        path: Circle,
    },
    diamond: {
        path: Isogon,
        options: {
            n: 4,
        },
    },
    rect: {
        path: Rect,
    },
    triangle: {
        path: Isogon,
        options: {
            n: 3,
        },
    },
    pentagon: {
        path: Isogon,
        options: {
            n: 5,
        },
    },
    droplet: {
        path: Droplet,
    },
};

function getGraph(type, options) {
    let shape = shapeInfo[type];
    let Path = shape.path;
    let shapeOptions = shape.options;
    let newOptions = options;
    let borderR = options?.borderR || 0;
    let lineWidth = options?.lineWidth || 0;
    newOptions.shape = {
        ...newOptions.shape,
        ...shapeOptions,
    };
    if (Path === Isogon) {
        let h = newOptions.shape.r * 2;
        let r;
        let offset = 0;
        let n = shape.options.n;
        if (shape.options.n === 3) {
            //根据正多边形计算实际半径，外接圆半径是R=2h/3
            offset = borderR ? (4 * lineWidth) / 20 : 0;
            r = borderR ? (h * 2) / 3 - offset : (h * 2) / 3;
        } else if (shape.options.n === 5) {
            //根据正五边形计算实际半径r=a/2sin36
            let a = h * Math.tan((18 * Math.PI) / 180) * 2;
            r = a / (2 * Math.sin((36 * Math.PI) / 180));
        } else {
            r = newOptions.shape.r;
            n = 0;
        }
        newOptions.shape.x = newOptions.shape.cx;
        newOptions.shape.y = newOptions.shape.cy + (r - newOptions.shape.r) + offset;
        borderR && n !== 0 && (newOptions.shape.y = newOptions.shape.y + (borderR - r) / shape.options.n);
        newOptions.shape.r = r;
    }
    if (Path === Rect) {
        newOptions.shape.r = 0;
        newOptions.shape.height = newOptions.shape.height - 2;
        newOptions.shape.y = newOptions.shape.y + 1;
    }
    if (Path === Droplet) {
        newOptions.shape.width = newOptions.shape.r;
        newOptions.shape.height = newOptions.shape.r;
    }
    return new Path({ ...newOptions });
}

export default LiquidFill;
