import * as zrender from 'zrender';
import { Group, BrokenLine, LineArea, Rect } from '../shape';
import { elUpdate } from '../animation';
import { color, mergeAttr, G_NAME, G_INDEX } from '../utils';

import { addAnimate, setAnimType } from '../animation/common';

const renderLineType = (type, dashArray) =>
    type === 'solid' ? '' : type === 'dashed' ? dashArray : '';
const limitValue = (per, limit) => (limit * per) / 100;

/**
 * @method baseLine
 * @description 渲染折线面积
 * @param {Object} config 设置参数
 * @returns {sub} 折线面积效果组
 * @example
 * config: {
 *  configData: 配置文件
 *  pointsArr: Arr:[]{ vertex: [], base: [] } 点坐标集合
 *  majorColor: 主色
 *  lineWidthLimit: 线宽最大值
 *  subZ: 图形层级（z2）
 *  delay: 动画延迟时间
 *  duration: 动画执行时间
 * }
 */
class baseLineArea extends Group {
    constructor(config) {
        const { configData, origin } = config;
        const {
            area: { visible: area_visible },
            outset: { h: outset_h, v: outset_v, blur: outset_blur },
        } = configData.general;
        const { open: open_animation, entry: anim_entry_list } = configData.animation;

        // 实例化对象
        super({ name: `lineAreaGroup` });

        this.origin = origin;

        this.shape_group = new Group({ name: 'shape_group' });

        this.animType_list = setAnimType(anim_entry_list);

        this.line = new BrokenLine(this.formLine(config));
        this.area = new LineArea(this.formArea(config));

        this.lineOutset = new BrokenLine(this.formLineOutset(config));
        this.areaOutset = new LineArea(this.formAreaOutset(config));

        this.shape_group.add(this.line);
        this.shape_group.add(this.area);
        this.shape_group.add(this.lineOutset);
        this.shape_group.add(this.areaOutset);

        // 入场动画
        this.entryAnimation(config);

        // 线 && 发光
        this.add(this.line);
        // 面积 && 发光
        if (area_visible === true) this.add(this.area);
        // 投影
        if (!(outset_h === 0 && outset_v === 0 && outset_blur === 0)) {
            this.add(this.lineOutset);
            if (area_visible === true) this.add(this.areaOutset);
        }
    }

    updateGroup(config) {
        // elUpdate(this.line, this.formLine(config));
        // elUpdate(this.lineOutset, this.formOutset(config));
        // elUpdate(this.area, this.formArea(config));
        // elUpdate(this.areaOutset, this.formOutset(config));
    }

    formLine(config) {
        const { configData, pointsArr, majorColor, lineWidthLimit, subZ } = config;
        const {
            smooth: line_smooth, // 平滑曲线开关，默认关闭
            line: {
                line_type, // 属性值：solid（实线，默认）、dashed（虚线）
                line_width,
                dash_array: line_dashArray, //虚线数组
            },
            light: {
                opacity: light_opacity, // 透明度默认100 0~100
                extent: light_extent, // 默认50，显示范围百分比
            },
        } = configData.general;
        const linePoints = pointsArr.map(({ vertex }) => vertex);
        return {
            name: `baseLine ${G_NAME.shape}`,
            z: G_INDEX.shape,
            z2: subZ,
            shape: {
                linePoints,
                smooth: line_smooth,
            },
            style: {
                fill: null,
                lineJoin: 'miter',
                stroke: color(majorColor),
                lineWidth: limitValue(line_width, lineWidthLimit),
                lineDash: renderLineType(line_type, line_dashArray),
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: limitValue(light_extent, 200),
                shadowColor: color(majorColor, { opacity: light_opacity / 100 }),
            },
        };
    }

    formLineOutset(config) {
        const { configData, subZ } = config;
        const {
            outset: { h: outset_h, v: outset_v, blur: outset_blur },
        } = configData.general;
        const {
            graph: { outset: outset_color },
        } = configData.default_theme;
        return mergeAttr(this.formLine(config), {
            name: `baseLineOutset ${G_NAME.shape}`,
            z2: subZ - 2,
            style: {
                shadowOffsetX: limitValue(outset_h, 100),
                shadowOffsetY: limitValue(outset_v, 100),
                shadowBlur: limitValue(outset_blur, 200),
                shadowColor: color(outset_color),
            },
        });
    }

    formArea(config) {
        const { configData, pointsArr, majorColor, subZ } = config;
        const {
            smooth: line_smooth, // 平滑曲线开关，默认关闭
            area: {
                opacity: area_opacity, // 面积透明度（0~100）
            },
            light: {
                opacity: light_opacity, // 透明度默认100 0~100
                extent: light_extent, // 默认50，显示范围百分比
            },
        } = configData.general;
        const vertex = pointsArr.map(({ vertex }) => vertex);
        const base = pointsArr.map(({ base }) => base);
        return {
            name: `baseArea ${G_NAME.shape}`,
            z: G_INDEX.shape,
            z2: subZ - 1,
            shape: {
                vertexPoints: vertex,
                basePoints: base,
                smooth: line_smooth,
            },
            style: {
                // 填充
                fill: color(majorColor, { opacity: area_opacity / 100, degree: 270 }),
                // 发光
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: limitValue(light_extent, 200),
                shadowColor: color(majorColor, {
                    opacity: (area_opacity / 100) * (light_opacity / 100),
                }),
            },
        };
    }

    formAreaOutset(config) {
        const { configData, subZ } = config;
        const {
            outset: { h: outset_h, v: outset_v, blur: outset_blur },
        } = configData.general;
        const {
            graph: { outset: outset_color },
        } = configData.default_theme;
        return mergeAttr(this.formArea(config), {
            name: `baseAreaOutset ${G_NAME.shape}`,
            z2: subZ - 2,
            style: {
                shadowOffsetX: limitValue(outset_h, 100),
                shadowOffsetY: limitValue(outset_v, 100),
                shadowBlur: limitValue(outset_blur, 200),
                shadowColor: color(outset_color),
            },
        });
    }

    entryAnimation(config) {
        const { configData, zeroLine, delay = 0, duration = 1200 } = config;

        const {
            open: open_animation, // 动画开启或者关闭，默认开启true
        } = configData.animation;
        const [, zeroY = 0] = zeroLine ?? [];

        if (open_animation === false) return;

        //主图形的动画列表
        const shape_anim_list = this.animType_list.getAnim('shape');

        shape_anim_list.forEach((anim) => {
            if (anim === 'grow') {
                [this.line, this.area].forEach((sub) => {
                    // 发光
                    const shadowBlur = sub.style.shadowBlur;
                    const lightOn = sub
                        .attr('style', { shadowBlur: 0 })
                        .animate('style')
                        .when(duration, { shadowBlur });
                    // 生长
                    const { x, y, width, height } = sub.getBoundingRect();
                    const rect = new Rect({ shape: { x, y, width, height } });
                    sub.setClipPath(rect);
                    rect.attr('shape', { width: 0 }).animateTo(
                        { shape: { width } },
                        {
                            duration,
                            delay,
                            easing: 'sinusoidalIn',
                            done: () => {
                                sub.removeClipPath(rect);
                                lightOn.start();
                            },
                        },
                    );
                });
            }
            if (anim === 'unfold') {
                this.shape_group.eachChild((item) => {
                    item.origin = this.origin;
                    item.scale = [1, 0];
                });

                this.shape_group.eachChild((item) => {
                    item.animateTo(
                        {
                            scale: [1, 1],
                        },
                        {
                            duration: 400,
                            delay,
                        },
                    );
                });
            }
            if (anim === 'fadeIn') {
                addAnimate(this.shape_group, ['fadeIn']);
            }
        });

        // [this.lineOutset, this.areaOutset].forEach((sub) =>
        //     sub
        //         .attr('style', {
        //             opacity: 0,
        //         })
        //         .animate('style')
        //         .delay(duration)
        //         .when(duration / 3, { opacity: 1 })
        //         .start(),
        // );

        // [this.line].forEach((sub) => {
        //     const linePoints = sub.shape.linePoints;
        //     const zeroPoints = linePoints.map(([x, y]) => [x, zeroY]);
        //     sub.attr('shape', { linePoints: zeroPoints })
        //         .animate('shape')
        //         .delay(delay)
        //         .when(duration, { linePoints: linePoints })
        //         .start();
        // });

        // // path 的数据变更 数据对比 一定是要对所有对象进行地址更换 slice concat 浅拷贝会导致失效
        // [this.area].forEach((sub) => {
        //     const vertexPoints = sub.shape.vertexPoints;
        //     const basePoints = sub.shape.basePoints;
        //     const vertexZero = basePoints.map(([x, y]) => [x, zeroY]);
        //     const baseZero = vertexPoints.map(([x, y]) => [x, zeroY]);
        //     sub.attr('shape', {
        //         vertexPoints: vertexZero,
        //         basePoints: baseZero,
        //     })
        //         .animate('shape')
        //         .delay(delay)
        //         .when(duration, {
        //             vertexPoints: vertexPoints,
        //             basePoints: basePoints,
        //         })
        //         .start();
        // });
        return;
    }
}

export default baseLineArea;
