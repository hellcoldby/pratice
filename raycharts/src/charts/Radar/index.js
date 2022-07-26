/*
 * Description: Radar 雷达图
 * Author: vicky
 * Date: 2020-08-17 20:30:47
 * LastEditTime: 2021-11-25 15:05:51
 * FilePath: \packages\raycharts\src\charts\Radar\index.js
 */
import { getColumns } from '../public/polygon';
import { color } from '../../utils/color';
import { fFixed } from '../../utils/tool';
import { Group, Polygon } from '../../shape';
import { getOffsetDataInfo, getColorsByNum } from '../public/assist';
import { drawBubbles, drawPoints } from '../public/decorate';
import renderPolarCoor from '../../guide/PolarCoordinate';
import { G_NAME, G_INDEX } from '../../utils/common';
import { isArray } from '../../utils/base';
import _ from 'lodash';
import { stringDataToNum } from '../../utils/dataUtils';
import { addAnimate, setAnimType } from '../../animation/common';

function Radar(config) {
    const Graphics = new Group({ name: `Graphics` });
    const polygon_group = new Group({ name: `polygon_group` });
    const polygon_outline_group = new Group({ name: `polygon_outline_group` });
    const polygon_shadow_group = new Group({ name: `polygon_shadow_group` });
    const polygon_light_group = new Group({ name: `polygon_light_group` });
    const polygon_bubble_group = new Group({ name: `polygon_bubble_group` });

    const { maxWidth, configData, addHoverAction } = config;
    const {
        animation: { open: aniOpen, entry: anim_entry_list },
    } = configData;

    const {
        general: { area, line, smooth, g_shadow, light, outset },
        default_theme,
        data: { radial_offset },
    } = configData;

    // 获取图形对应的动画列表 返回一个函数---->> animType_list('shape') = ['grow', 'fadeIn'];

    const shape_list = setAnimType(anim_entry_list);
    const shape_anim_list = shape_list.getAnim('shape');
    //删除默认动画
    const isGrow = shape_list.delAnim(shape_anim_list,'grow');
    // const isFadeIn = shape_list.delAnim(shape_anim_list,'fadeIn');
    // const isScale = shape_list.delAnim(shape_anim_list, 'unfold');



    // 格式化数据，防止y值出现String类型数据
    config.chartData = stringDataToNum(config.chartData);
    // 绘制极坐标
    const pcoor = renderPolarCoor(config);
    aniOpen && pcoor.eachChild((child) => perAnimation(child, 800, 0));
    Graphics.add(pcoor);
    // 雷达图线条粗细
    let rLWidth = maxWidth * 0.1 * (line.line_width / 100);
    // 雷达图虚线数组
    let lineDashArray = isArray(line.dash_array) ? line.dash_array : null;
    // 获取装饰data数据
    const { dataPoints } = getColumns(config);
    let colors = getColorsByNum(default_theme.graph.colors, dataPoints.length);
    // 图层初始值
    let zLog = G_INDEX.shape;
    // 发光的透明度是在area透明度的基础上减弱的
    let areaO = area.opacity / 100;
    let lightO = light.opacity / 100;
    lightO = areaO !== 1 ? areaO * lightO : lightO;

    //主函数
    function main() {
        if (!_.isEmpty(dataPoints)) {
            dataPoints.forEach((item, index) => {
                const options = {
                    z: zLog++,
                    origin: [item.pointsInfo[0].cx, item.pointsInfo[0].cy],
                    shape: {
                        points: item.points,
                        smooth: smooth ? 0.5 : 0,
                    },
                    style: {
                        fill: area.visible ? color(colors[index], { opacity: areaO }) : null,
                        stroke: null,
                        opacity: 1,
                    },
                };

                draw_polygon(options, item, index);
                draw_polygonOutline(options, item, index);
                draw_polygon_shadow(options, item, index);
                draw_polygon_light(options, item, index);
                draw_points(options, item, index);
                draw_data_bubble(options, item, index);
                draw_global_shadow(options, item, index);
            });
        }
    }

    //绘制多边形
    function draw_polygon(options, item, index) {
        // 绘制图形
        const polygon = new Polygon(options);
        if (isGrow) {
            aniOpen && addAnimate(polygon, ['fadeIn', ...shape_anim_list], 400, 1000);
        } else {
            aniOpen && addAnimate(polygon, shape_anim_list, 400);
        }

        polygon_group.add(polygon);
        // addHoverAction(polygon, { sid: item.series.sid });
    }

    //绘制多边形描边
    function draw_polygonOutline(options, item, index) {
        const polygonOutline = new Polygon({
            origin: options.origin,
            z: options.z,
            shape: options.shape,
            style: {
                ...options.style,
                fill: null,
                stroke: color(colors[index]),
                lineWidth: rLWidth,
                lineDash: line.line_type === 'solid' ? null : lineDashArray,
            },
        });

        if (aniOpen && isGrow) {
            let percent = 0;
            const timer = setInterval(() => {
                percent += 0.02;
                if (percent >= 1) {
                    clearInterval(timer);
                }
                // console.log(percent);
                polygonOutline.setStyle({
                    strokePercent: percent,
                    animatePercent: true,
                });
            }, 20);
            // addAnimate(polygonOutline, [...shape_anim_list], 400, 300);
        } else {
            aniOpen&& addAnimate(polygonOutline, shape_anim_list, 400);
        }

        polygon_outline_group.add(polygonOutline);
    }

    //绘制多边形阴影
    function draw_polygon_shadow(options, item, index) {
        const polygonShadow = new Polygon({
            origin: options.origin,
            z: options.z,
            shape: options.shape,
            style: {
                ...options.style,
                fill: area.visible ? color(colors[index], { opacity: areaO }) : null,
                stroke: null,
                lineWidth: rLWidth,
                lineDash: line.line_type === 'solid' ? null : lineDashArray,
                shadowOffsetX: (outset.h / 100) * maxWidth * 0.3,
                shadowOffsetY: (outset.v / 100) * maxWidth * 0.3,
                shadowBlur: (outset.blur / 100) * 200,
                shadowColor: color(default_theme.graph.outset),
            },
        });

        if (isGrow) {
            aniOpen&& addAnimate(polygonShadow, ['fadeIn', ...shape_anim_list], 400, 1000);
        } else {
            aniOpen&&addAnimate(polygonShadow, shape_anim_list, 400);
        }
        polygon_shadow_group.add(polygonShadow);
        addHoverAction(polygonShadow, { sid: item.series.sid });
    }

    //绘制发光
    function draw_polygon_light(options, item, index) {
        if (light.opacity !== 0 && light.extent !== 0) {
            const lightPolygon = new Polygon({
                z: zLog,
                origin: options.origin,
                shape: options.shape,
                style: {
                    fill: area.visible ? color(colors[index], { opacity: lightO }) : null,
                    stroke: !area.visible ? color(colors[index], { opacity: lightO }) : null,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: (light.extent / 100) * 200,
                    shadowColor: color(colors[index], { opacity: light.opacity }),
                    lineWidth: rLWidth,
                    lineDash: line.line_type === 'solid' ? null : lineDashArray,
                    opacity: 1,
                },
            });

            if (isGrow) {
                aniOpen && addAnimate(lightPolygon, ['fadeIn', ...shape_anim_list], 400, 1000);
            } else {
                aniOpen&&addAnimate(lightPolygon, shape_anim_list, 400, );
            }

            polygon_light_group.add(lightPolygon);
        }
    }

    //绘制节点
    function draw_points(options, item, index) {
        let pointConfig = {
            ...config,
            points: item.pointsInfo,
            z: G_INDEX.point,
            maxSize: maxWidth * 0.2,
        };
        let points = drawPoints(pointConfig);

        aniOpen && points.eachChild((child) => perAnimation(child, 1000, 1600));
        Graphics.add(points);
    }

    //绘制数据气泡
    function draw_data_bubble(options, item, index) {
        // 文本偏移
        const offsetDataInfo = getOffsetDataInfo(item.pointsInfo, radial_offset);
        // 绘制数据和气泡
        let bubbles = drawBubbles({
            ...config,
            z: G_INDEX.data,
            bubbles: offsetDataInfo,
        });
        aniOpen && bubbles.eachChild((child) => perAnimation(child, 400, 900));

        polygon_bubble_group.add(bubbles);
    }

    //绘制全局阴影
    function draw_global_shadow(options, item, index) {
        // 绘制全局阴影
        let gShadowGroup = drawGShadow({
            g_shadow,
            z: zLog++,
            dataPoints: item.points,
            dataInfo: item.pointsInfo,
            colors: { color: default_theme.graph.g_shadow },
            smooth,
        });
    }

    function render() {
        main();
        Graphics.add(polygon_group);
        Graphics.add(polygon_outline_group);
        Graphics.add(polygon_shadow_group);
        Graphics.add(polygon_light_group);
        Graphics.add(polygon_bubble_group);
    }

    render();
    return Graphics;
}

/**
 * @method drawGShadow
 * @description 绘制全局阴影
 * @param {*} params
 */
function drawGShadow(params) {
    const { g_shadow, z, dataPoints, dataInfo, colors, smooth } = params;
    if (g_shadow === 0 || _.isEmpty(dataPoints)) return;

    // 获取center
    let cx = dataInfo[0].cx;
    let cy = dataInfo[0].cy;
    let len = dataPoints.length;
    // 结束颜色渐弱的index值
    let endIndex;
    if (len % 2 === 0) {
        endIndex = len / 2 + 1;
    } else {
        endIndex = (len + 3) / 2;
    }
    endIndex = endIndex - 1;
    // 颜色差值
    let sum_c = g_shadow / 100;
    // 渐弱间隔值
    let c_space = sum_c / endIndex;
    // 获取最小颜色值
    let min_a = fFixed(sum_c - endIndex * c_space, 2);
    let gShadowGroup = new Group({ name: 'gShadow_group' });
    dataPoints.forEach((item, index) => {
        let a = fFixed(min_a + Math.abs(endIndex - index) * c_space, 2);
        let fillColor = color(colors.color);
        let tPoints = index === len - 1 ? dataPoints[0] : dataPoints[index + 1];
        let shadowPoints = [[cx, cy], item, tPoints];
        let sPolygon = new Polygon({
            name: 'shadow',
            z,
            origin: [cx, cy],
            shape: {
                points: shadowPoints,
                smooth: smooth ? 0.5 : 0,
            },
            style: {
                fill: fillColor,
                stroke: null,
                opacity: a,
            },
        });
        gShadowGroup.add(sPolygon);
    });
    return gShadowGroup;
}

/**
 * @method addAnimate 添加动画
 * @param {*} child 被添加对象
 * @param {*} count 动画对象总数
 * @param {*} index 当前index
 */
// function addAnimate(child, count, index) {
//     let shapeTime = 800 / count;
//     let decorateTime = 300;
//     let delay = 800;
//     let aT = child.name.match(/(point|bubble)/g)
//         ? { time: decorateTime, delay: shapeTime * count }
//         : { time: shapeTime, delay: delay + shapeTime * index };
//     perAnimation(child, aT.time, aT.delay);
// }

/**
 * @method perAnimation 遍历动画
 * @param {*} child 被添加对象
 * @param {*} time 动画时间
 * @param {*} delay 延时
 */
function perAnimation(child, time, delay) {
    if (child instanceof Group) {
        child.eachChild((child) => perAnimation(child, time, delay));
    } else {
        fadeIn(child, time, delay);
    }
}

/**
 * @method fadeIn 渐隐渐现
 * @param {*} child 被添加对象
 * @param {*} duration 动画时间
 * @param {*} delay 延时
 */
function fadeIn(child, duration, delay) {
    if (child._textContent) {
        let endOpacity = child._textContent.style.opacity;
        child._textContent.style.opacity = 0;
        child._textContent.animateTo(
            {
                style: {
                    opacity: endOpacity,
                },
            },
            { duration, delay },
        );
    }
    let endOpacity = child.style.opacity;
    child.style.opacity = 0;
    child.animateTo(
        {
            style: {
                opacity: endOpacity,
            },
        },
        { duration, delay },
    );
}
export default Radar;
