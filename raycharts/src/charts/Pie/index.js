/*
 * Description: Pie 饼图，环形图
 * Author: vicky
 * Date: 2020-09-04 13:20:26
 * LastEditTime: 2022-01-21 18:27:05
 * FilePath: \packages\raycharts\src\charts\Pie\index.js
 */
import { Group, Sector } from '../../shape';
import _ from 'lodash';
import { getArcAngles, pointByRad } from '../../utils/tool';
import { color } from '../../utils/color';
import { OffsetData, getColorsByNum } from '../public/assist';
import { guideLine } from '../../components/guideLine';
import { addBubble, addPoint } from '../public/decorate';
import { G_NAME, G_INDEX } from '../../utils/common';
import { isArray } from '../../utils/base';
import { stringDataToNum } from '../../utils/dataUtils';
import { addAnimate, setAnimType } from '../../animation/common';

function Pie(config) {
    const { maxWidth: rootW, maxHeight: rootH, configData, addHoverAction } = config;
    // 格式化数据，防止y值出现String类型数据
    const pData = stringDataToNum(config.chartData);
    const {
        animation: { open: animOpen, entry: anim_entry_list },
    } = configData;
    const Graphics = new Group({ name: `Graphics` });
    const {
        general: {
            r,
            space,
            hole_r,
            ccw,
            area,
            line,
            s_angle = 90,
            border: {
                radius: {
                    tleft: rad_out_star,
                    tright: rad_out_end,
                    bright: rad_inner_end,
                    bleft: rad_inner_start,
                },
                line_type: border_line_type, // 属性值：solid（实线，默认）、dashed（虚线）
                line_width: border_line_width, // 描边宽度
                dash_array: border_line_dash, // 虚线数组
            },
        },
        default_theme: { graph },
        data: { visible: dataVisible, radial_offset, guide_mode, guide_line, guide_line_2 },
    } = configData;
    const line_length = guide_line.line_length;
    const line_length_2 = guide_line_2.line_length;
    // 图层初始值
    let zLog = 1;
    // 边框线条粗细
    let rLWidth = rootW * 0.1 * (line.line_width / 100);
    // 虚线数组
    let lineDashArray = isArray(line.dash_array) ? line.dash_array : null;
    // 绘制绘图区域信息
    const dAR = rootW > rootH ? rootH / 2 : rootW / 2;
    // 获取环形图半径
    let c_r = dAR * (r / 100);
    let c_r0 = c_r * (hole_r / 100);
    c_r0 = c_r - c_r0 <= 1 ? c_r - 1 : c_r0;
    // 开始角度,矫正270度的时候为默认开始0度
    let startAngle = 360 - s_angle;
    // 整体弧度
    let sAngle = (startAngle * Math.PI) / 180;
    let eAngle = ((startAngle + 360) * Math.PI) / 180;
    let arcAngles = getArcAngles({ sAngle, eAngle, ccw }, pData, space);
    let cx = rootW / 2;
    let cy = rootH / 2;
    // 发光的透明度是在area透明度的基础上减弱的
    let areaO = area.opacity / 100;
    // 颜色
    let colors = getColorsByNum(graph.colors, arcAngles.length);
    // 标签布局函数生成
    const labelSet = new LabelLayout(cx, cy, c_r, line_length, line_length_2);
    // 获取图形对应的动画列表 返回一个函数---->> shape_anim_list = ['grow', 'fadeIn'];
    const shape_list = setAnimType(anim_entry_list);
    const shape_anim_list = shape_list.getAnim('shape');
    /*              迭代              */
    !_.isEmpty(arcAngles) &&
        arcAngles.forEach((item, index) => {
            if (item.value || item.value === 0) {
                let pieItemGroup = new Group({ name: G_NAME.shape });
                let circle = new Sector({
                    name: 'pie',
                    z: zLog++,
                    shape: {
                        cx,
                        cy,
                        r: c_r,
                        r0: c_r0,
                        startAngle: item.sAngle,
                        endAngle: item.eAngle,
                        clockwise: !ccw,
                        // cornerRadius: !ccw
                        //     ? [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                        //     : [rad_inner_end, rad_inner_start, rad_out_end, rad_out_star],
                        cornerRadius: [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end],
                    },
                    style: {
                        fill: area.visible
                            ? color(colors[index], {
                                  opacity: areaO,
                                  linearByAngle: {
                                      sAngle: (item.sAngle * 180) / Math.PI,
                                      eAngle: (item.eAngle * 180) / Math.PI,
                                      ccw,
                                  },
                              })
                            : null,
                        stroke: color(colors[index], {
                            linearByAngle: {
                                sAngle: (item.sAngle * 180) / Math.PI,
                                eAngle: (item.eAngle * 180) / Math.PI,
                                ccw,
                            },
                        }),
                        lineWidth: rLWidth,
                        lineDash: line.line_type === 'solid' ? null : lineDashArray,
                        opacity: 1,
                    },
                });
                circle.setClipPath(
                    new Sector({
                        shape: {
                            cx,
                            cy,
                            r: c_r,
                            r0: c_r0,
                            startAngle: item.sAngle,
                            endAngle: item.eAngle,
                            clockwise: !ccw,
                        },
                        style: {
                            lineWidth: rLWidth,
                        },
                    }),
                );
                pieItemGroup.add(circle);
                // 因为图形必须裁剪，发光和阴影跟裁剪出现冲突，关闭发光和阴影20211129
                animOpen && pieItemGroup.eachChild((child) => addAnimate(child, shape_anim_list));
                Graphics.add(pieItemGroup);
                addHoverAction(pieItemGroup, { cid: item.info.cid, sid: item.info.sid });

                let angleOffset = 1;
                // 结点位置计算
                let rad = !ccw
                    ? item.sAngle + (item.eAngle - item.sAngle) * angleOffset
                    : item.sAngle + (item.eAngle - item.sAngle) * angleOffset;
                let pointInfo = pointByRad(cx, cy, c_r0 + (c_r - c_r0) / 2, rad);
                // 添加端点
                let pointConfig = {
                    ...config,
                    pointData: {
                        x: pointInfo.x,
                        y: pointInfo.y,
                        angle: rad,
                        maxSize: c_r,
                        isMax: item.isMax,
                        isMin: item.isMin,
                    },
                    z: G_INDEX.point,
                };
                let point = addPoint(pointConfig);

                animOpen && point.eachChild((child) => addAnimate(child, shape_anim_list));
                Graphics.add(point);

                // 数据位置计算
                let data_rad = !ccw
                    ? item.sAngle + (item.eAngle - item.sAngle) / 2
                    : item.sAngle + (item.eAngle - item.sAngle) / 2;
                let data_point = pointByRad(cx, cy, c_r0 + (c_r - c_r0) / 2, rad);
                let bubbleData = {
                    cx,
                    cy,
                    r: c_r0 + (c_r - c_r0) / 2,
                    angle: data_rad,
                    x: data_point.x,
                    y: data_point.y,
                    value: item.value,
                    seriesSum: item.seriesSum,
                    isMax: item.isMax,
                    isMin: item.isMin,
                };
                let offsetDataInfo = OffsetData(bubbleData, radial_offset);
                // 添加数据
                let bubble = addBubble({
                    ...config,
                    z: G_INDEX.data,
                    bubbleData: offsetDataInfo,
                });

                if (dataVisible && guide_mode) {
                    const callback = (startPoint, middlePoint, endPoint) => {
                        // 绘制指引线
                        if (bubble.childCount()) {
                            const lineSet = guideLine({
                                config: configData,
                                point: [startPoint, middlePoint, endPoint],
                            });
                            animOpen &&
                                lineSet.eachChild((child) => addAnimate(child, shape_anim_list));
                            Graphics.add(lineSet);
                        }
                    };
                    // 节点注册
                    labelSet.register(data_rad, bubble, callback);
                }
                animOpen && bubble.eachChild((child) => addAnimate(child, shape_anim_list));
                Graphics.add(bubble);
            }
        });
    // 触发标签重排
    labelSet.rearrange();
    return Graphics;
}

class LabelLayout {
    constructor(cx, cy, cr, line1, line2) {
        this.cx = cx;
        this.cy = cy;
        this.cr = cr;
        this.line1 = line1;
        this.line2 = line2;
    }
    leftSet = [];
    rightSet = [];
    // 注册节点以及整理顺序
    register(currRad, subNode, callback) {
        const dirRad = (currRad + Math.PI / 2) % (Math.PI * 2);
        const rad = dirRad - Math.PI / 2;
        if (dirRad < Math.PI) {
            this.rightSet.push({ rad, node: subNode, callback });
        } else {
            this.leftSet.push({ rad, node: subNode, callback });
        }
    }
    // 触发重排 -> 触发回调
    rearrange() {
        // 首先 排序
        this.rightSet.sort((a, b) => a.rad - b.rad);
        this.leftSet.sort((a, b) => b.rad - a.rad);
        // 迭代
        this.rightSet.reduce(this.reduceLabel(1), null);
        this.leftSet.reduce(this.reduceLabel(-1), null);
    }
    // 迭代执行
    reduceLabel(dir) {
        // dir（方向） right: 1 | left: -1
        const { cx, cy, cr, line1, line2 } = this;
        const offSet = dir * line2;
        const labelR = cr + line1;
        return (stackH, curr, _index) => {
            const { rad, node: box, callback } = curr;
            // 盒子尺寸
            const { width: boxW, height: boxH } = box.getBoundingRect();
            // 无避让点位
            let startPoint = pointByRad(cx, cy, cr, rad);
            let middlePoint = pointByRad(cx, cy, labelR, rad);
            let endPoint = pointByRad(cx + offSet, cy, labelR, rad);
            // 是否为首位 & 与前置是否碰撞
            if (stackH && stackH > endPoint.y - boxH / 2) {
                // 到圆心水平线的偏差高
                const newH = stackH + boxH / 2;
                if (endPoint.y <= cy) {
                    // 点在上半区
                    if (newH < cy) {
                        // 高度未超过水平中线 依照新的偏转角连线
                        const newRad = asin((newH - cy) / labelR, dir);
                        middlePoint = pointByRad(cx, cy, labelR, newRad);
                        endPoint = pointByRad(cx + offSet, cy, labelR, newRad);
                    } else {
                        // 水平中线下的垂直排布 todo
                        middlePoint = { x: cx + dir * labelR, y: newH };
                        endPoint = { x: cx + offSet + dir * labelR, y: newH };
                    }
                } else {
                    // 下半弧的点 对中间点、结束点进行修正
                    middlePoint.y = newH;
                    endPoint.y = newH;
                }
                // 判断向量垂直
                const { x: sx, y: sy } = startPoint;
                const { x: mx, y: my } = middlePoint;
                const obtuseAngleFlag = (sx - cx) * (mx - sx) + (sy - cy) * (my - sy);
                // 限制 line1 和 line 2 的夹角大于90度
                if (obtuseAngleFlag < 0) {
                    // 根据坐标求解，line1的垂线与endPoint.y所在水平线的交点
                    // 如果交点在 endPoint 相对于圆心的外侧，则中间点和终点是一个点。
                    const newMx = sx + ((my - sy) * (sy - cy)) / (cx - sx);
                    if (Math.abs(newMx - cx) >= Math.abs(endPoint.x - cx)) {
                        middlePoint = { x: endPoint.x, y: endPoint.y };
                    } else {
                        middlePoint.x = newMx;
                    }
                }
            }
            // 将盒子移动到目标位置
            box.attr({ position: [endPoint.x, endPoint.y] });
            // 修正数据盒子定位
            redirectPosition(box, [(boxW * dir) / 2, 0]);
            // 执行回调函数
            callback?.(startPoint, middlePoint, endPoint);
            return endPoint.y + boxH / 2;
        };
    }
}

/**
 * 反三角函数，边界值约束
 * @param {*} _x
 * @param {*} dir 左右方向
 * @returns
 */
function asin(_x, dir) {
    const x = _x < -1 ? -1 : _x > 1 ? 1 : _x;
    return dir === 1 ? Math.asin(x) : Math.PI - Math.asin(x);
}

/**
 * @method redirectPosition 重定位元素
 * @param {*} child 操作对象
 * @param {Array} offSet 偏移量
 */
function redirectPosition(child, offSet) {
    const [bx, by] = child.position;
    child.attr({ position: [bx + offSet[0], by + offSet[1]] });
    return child;
}

export default Pie;
