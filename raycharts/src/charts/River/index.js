import { Group, Line, Circle, Arc, Rect, Ellipse, Sector, Text, CompoundPath } from '../../shape';
// import { Group, BrokenLine, LineArea, Rect } from '../shape';
import { getFirstData, getMax, getMin } from '../Jade/jade_util';
import { color, toRgba } from '../../utils/color';
import { changeRgbaOpacity, isNumber } from '../Jade/jade_util.js';
import { G_INDEX } from '../../utils/common';
import renderCoordinate from '../../guide/coordinate';
import { handleDec, getFontWidth, getRound } from '../../guide/coordinate/guide_common';
import { BezierArea, getValueType, BezierLine, check_value_void } from './common';
import renderEndPoint from '../../components/endPoint';
import { addAnimate, setAnimType } from '../../animation/common';
import _, { cloneDeep } from 'lodash';

export default function River(config) {
    const { maxWidth, maxHeight, configData, chartData, zoom, addHoverAction } = config;
    // 渲染坐标轴 获取坐标轴数据
    const Coordinate = renderCoordinate(config);
    const { info } = Coordinate;

    const {
        y_axis_max_height, // y轴最大高度
        forwardMax, // 正向最大值
        minusMin, // 负方向最小值
        axis_value_ary, // 轴数值集合
        rulesY_ary, // y轴刻度集合
        rulesX_ary, // x轴刻度集合,
        axis_label_ary, // x轴标签
        pixelRatioValue, // 单位像素
        animTime,
        x_axis_every_space, // 轴间隔像素
        startY,
        _coorInfo, // 图形区域裁切 自定义刻度
        positionList,
    } = info;
    const { t, T } = animTime;

    // 数据按照列表分组
    const {
        dataBaseCategory, // 每个类别对应的数值
        dataBaseSeries, //  每个系列下的数值
        perBaseCategory, // 每个类别对应的百分比
        perBaseSeries, // 每个系列下的百分比
        seriesList,
        ultraBaseSeries, // 每个系列下的最大值 最小值
        categoryList, //
    } = chartData;

    // 数据配置
    const {
        visible: data_visible, // 数据显示
        font: {
            font_family: data_fontFamily,
            font_size: data_fontSize,
            font_style: data_fontStyle,
            text_decoration: data_textDec,
            font_weight: data_fontWeight,
        },

        bubble: {
            // 气泡相关
            visible: bubble_visible, // 气泡的显示隐藏
            border: {
                line_type: bubble_borderType, // 气泡的边框样式
                radius: { tleft: bubble_tl, tright: bubble_tr, bright: bubble_br, bleft: bubble_bl }, // 气泡的边框圆角
                line_width: bubble_borderWidth, // 气泡的边框宽度
            },
        },
        type: dataType, // 数值的显示类型
        show: dataMaxMin, // 显示最值
    } = configData.data;

    const {
        graph_width: Bar_WidthPercent, // 柱子的宽度
        space: Bar_GapPercent, // 柱子的缝隙

        light: {
            opacity: light_opacity, // 发光透明度
            extent: light_blur, // 发光范围
        },

        outset: {
            h: outset_h, // 外阴影_水平
            v: outset_v, // 外阴影_垂直
            blur: outset_blur, // 外阴影_模糊
        },

        border: {
            line_type: border_line_type, // 属性值：solid（实线，默认）、dashed（虚线）
            line_width: border_line_width,
            dash_array: border_dash, // 虚线数组
        },
        point: {
            image: point_image, // 填充图片
            shape: point_shape, // 属性值：默认‘circle’，可选diamond 菱形  rectangle矩形  triangle三角形
            visible: point_visible, // 显隐，默认关闭
            width: point_width, // 端点宽
            height: point_height, // 端点高
            show: point_show, // 属性值：all（全显示，默认）、max(最大值)、min（最小值），ex（最大值+最小值）
            border: { line_type: point_line_type, line_width: point_line_width },
        },
        slot: {
            image: slot_image,
            width: slot_width,
            outset: { h: slot_h, v: slot_v, blur: slot_blur },
            border: {
                line_type: slot_line_type, // 属性值：solid（实线，默认）、dashed（虚线）
                radius: { tleft: slot_tl, tright: slot_tr, bright: slot_br, bleft: slot_bl }, // 字段释义：tleft:top_left、tright:top_right、bright:bottom_right、bleft:bottom_left
                corner_type: slot_corner_type, // 属性值：round（默认，圆角），line（直角）
                line_width: slot_line_width,
            },
        },
        smooth,
        area: {
            visible: area_visible, // 面积显隐，默认关闭
            opacity: area_opacity, // 面积透明度（0~100）
        },
        line: {
            line_type, // 属性值：solid（实线，默认）、dashed（虚线）
            line_width,
            dash_array, // 虚线数组
        },
    } = configData.general;

    // 动画
    const { open: animation_open, entry: anim_entry_list } = configData.animation;

    const {
        assistant: {
            // 正常
            normal: {
                color: normalColor, // 填充
                border: normalBorder, // 描边
            },
            // 异常
            abnormal: {
                color: abnormalColor, // 填充
                border: abnormalBorder, // 描边
            },
            // 中位数
            median: {
                border: medianBorderColor, // 描边
            },
        },
        data: {
            text_color: tip_textColor, // 柱子提示文字的颜色
            text_stroke: tip_textBorderColor, // 文字描边的颜色
            bubble: {
                // 提示文字的气泡
                border: bubble_borderColor, // 气泡边框颜色
                color: bubble_bgColor, // 气泡背景色
            },
        },
        graph: {
            colors: ColorList, // 柱子的颜色列表
            secondary_colors: secColorList, // 次级颜色列表
            inset: insetColor,
            outset: outsetColor,
            border: borderColor,
        },

        point: { border: point_border_color, color: point_fill_color },
    } = configData.default_theme;


    // 获取图形对应的动画列表 返回一个函数---->>获取shape 图形对应的动画列表 animType_list('shape') = ['grow', 'fadeIn'];
    const shape_list = setAnimType(anim_entry_list);
    const shape_anim_list = shape_list.getAnim('shape');
    //删除默认动画
    const isGrow = shape_list.delAnim(shape_anim_list,'grow');
    const isFadeIn = shape_list.delAnim(shape_anim_list,'fadeIn');
    const isScale = shape_list.delAnim(shape_anim_list, 'unfold');


    const chartGroup = new Group({ name: `river` });

    const shadow_group = new Group({ name: 'riverGroup' });
    const point_group = new Group({ name: 'pointGroup' });
    const data_group = new Group({ name: 'dataGroup' });

    const river_group = new Group({ name: 'river_group' });
    const border_group = new Group({ name: 'border_group' });

    const light_group = new Group({ name: 'light_group' });

    const clip_group = new Group({ name: 'clip_group' });

    // 绘图区域宽度
    const { x_w } = _coorInfo;

    // 线宽
    const line_w = (line_width / 100) * x_w * 0.05;

    // 端点半径
    const p_w = ((point_width / 100) * x_axis_every_space) / 2;
    const p_h = ((point_height / 100) * x_axis_every_space) / 2;

    // 端点描边线宽
    const p_b_w = Math.max(p_w, p_h) * (point_line_width / 100);

    // 气泡的内边距
    const bubble_padding = data_fontSize / 6;

    // 判断数据正负值情况
    const valueType = getValueType(info);

    // 获取中间值
    let middle_value = null;
    // 中间位置坐标
    let middle_posY = null;

    // （三种情况：1-正值 2-负值 3-正负都有）
    if (valueType !== 2) {
        middle_value = forwardMax / 2;
        middle_posY = startY + middle_value * pixelRatioValue;
    } else {
        middle_value = Math.abs(minusMin / 2);
        middle_posY = startY + middle_value * pixelRatioValue;
    }



    // 计算每个类别的边界坐标
    function getBoundary() {
        const boundary_array = [];
        for (let key in dataBaseCategory) {
            const item_arr = dataBaseCategory[key];
            // 系列数据叠加最大值
            const max_boundary = item_arr.reduce((a, b) => Number(a) + Number(b)) / 2;
            const max_boundary_h = max_boundary * pixelRatioValue;
            // 最大边界坐标
            const max_boundary_posY_up = middle_posY - max_boundary_h;
            const max_boundary_posY_down = middle_posY + max_boundary_h;

            boundary_array.push({
                up: max_boundary_posY_up,
                down: max_boundary_posY_down,
                height: Math.abs(max_boundary_posY_down - max_boundary_posY_up),
            });
        }

        return boundary_array;
    }
    const boundary_array = getBoundary();

    // 计算叠加百分比
    function dataAccumulation() {
        const _perBaseSeries = _.cloneDeep(perBaseSeries);
        for (let i = 2; i <= seriesList.length; i++) {
            const prev_series = _perBaseSeries[i - 1];
            const cur_series = _perBaseSeries[i];
            const array = cur_series.map((item, index) => {
                item += prev_series[index];
                return handleDec(item);
            });
            _perBaseSeries[i] = array;
        }
        return _perBaseSeries;
    }

    // 获取河流图节点
    function getRiverPoints() {
        const up_points = [];
        const down_points = [];
        const _perBaseSeries = dataAccumulation();
        const series_points = [];
        const series_clip_points = [];

        // 上下边界的坐标数组
        for (let i = 0, bLen = boundary_array.length; i < bLen; i++) {
            up_points.push([rulesX_ary[i], boundary_array[i].up]);
            down_points.push([rulesX_ary[i], boundary_array[i].down]);
        }

        for (let i = 0; i < seriesList.length; i++) {
            // 每个系列对应的百分比
            const cur_series_per = _perBaseSeries[i + 1];
            const cur_series_data = dataBaseSeries[i + 1];
            const ac_series_per = perBaseSeries[i + 1];
            const max = Math.max.apply(null, dataType === 'normal' ? cur_series_data : ac_series_per);
            const min = Math.min.apply(null, dataType === 'normal' ? cur_series_data : ac_series_per);

            // 当前系列上部线条的点
            const cur_up_points = [];
            // 当前系列下部线条的点
            const cur_down_points = [];

            // 无效值列表
            const cur_void_list = [];
            for (let j = 0, curLen = cur_series_per.length; j < curLen; j++) {
                const cur_pre = cur_series_per[j];
                const cur_x = rulesX_ary[j];
                const cur_y = boundary_array[j].down - (boundary_array[j].height * cur_pre) / 100;
                cur_up_points.push([cur_x, cur_y]);

                const ac_per = ac_series_per[j];
                const cur_data = dataType === 'normal' ? cur_series_data[j] : ac_per;

                const check_res = check_value_void(cur_series_data[j], j);
                check_res && cur_void_list.push(check_res - 0);

                /** ------------------渲染端点&&数据--start------------------------- */
                const EndPointSet = renderEndPoint(configData)({
                    name: `point${i}_${j}`,
                    maxSize: x_axis_every_space,
                    isMin: cur_data === min,
                    isMax: cur_data === max,
                }).attr({
                    position: [cur_x, cur_y],
                    z: G_INDEX.data,
                });

                point_group.add(EndPointSet);

                if (data_visible) {
                    if (dataMaxMin === 'max' && max === cur_data) {
                        drawData();
                    } else if (dataMaxMin === 'min' && min === cur_data) {
                        drawData();
                    } else if (dataMaxMin === 'ex' && (max === cur_data || min === cur_data)) {
                        drawData();
                    } else if (dataMaxMin === 'all') {
                        drawData();
                    }

                    function drawData() {
                        const value_width = getFontWidth(
                            dataType === 'normal' ? cur_data : cur_data + '%',
                            data_fontSize,
                            data_fontFamily,
                        );

                        let cur_w = value_width;
                        let cur_h = data_fontSize;
                        let cur_r = 0;
                        let _bubble_borderWidth = 0;
                        if (bubble_visible) {
                            cur_h = data_fontSize + bubble_padding * 2;
                            cur_w = cur_h * 2;
                            cur_w = value_width > cur_w ? value_width + bubble_padding * 2 : cur_w;
                            cur_x -= cur_w / 2;
                            cur_y -= cur_h + p_b_w + p_h;
                            // 较小的边作为圆角的基础
                            const borderMin = Math.min(cur_w, cur_h);
                            cur_r = [
                                getRound(borderMin, bubble_tl),
                                getRound(borderMin, bubble_tr),
                                getRound(borderMin, bubble_br),
                                getRound(borderMin, bubble_bl),
                            ];

                            _bubble_borderWidth = (borderMin * bubble_borderWidth) / 100;
                        } else {
                            cur_x -= value_width / 2;
                            cur_y = cur_y - p_h - p_b_w - data_fontSize;
                        }

                        const valueRect = new Rect({
                            shape: {
                                x: cur_x,
                                y: cur_y,
                                width: cur_w,
                                height: cur_h,
                                r: cur_r,
                            },
                            style: {
                                fill: bubble_visible ? color(bubble_bgColor) : null,
                                stroke: bubble_visible ? color(bubble_borderColor) : null,
                                lineWidth: _bubble_borderWidth,
                                lineDash: bubble_borderType === 'solid' ? '' : [2, 2, 2, 2],
                                lineCap: 'square',
                            },
                            textConfig: {
                                position: 'inside',
                            },
                            textContent: new Text({
                                style: {
                                    text: dataType === 'normal' ? cur_data : cur_data + '%',
                                    fill: color(tip_textColor),
                                    fontSize: data_fontSize,
                                    fontFamily: data_fontFamily,
                                    fontStyle: data_fontStyle,
                                    fontWeight: data_fontWeight,
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    align: 'middle',
                                },
                                z: G_INDEX.data + 1,
                            }),

                            z: G_INDEX.data,
                        });

                        data_group.add(valueRect);
                    }
                }
                /** ------------------渲染端点&&数据--end------------------------- */
            }

            if (i === 0) {
                cur_down_points.push(...down_points.reverse());
            } else {
                const prev_up_points = _.cloneDeep(series_points[i - 1].up);
                cur_down_points.push(...prev_up_points.reverse());
            }

            /** --------------无效值裁切-----start---------------------- */
            let points_len = cur_up_points.length;
            let obj = [];
            let clone_up = _.cloneDeep(cur_up_points);
            let clone_down = _.cloneDeep(cur_down_points);
            clone_down = clone_down.reverse();
            cur_void_list.forEach((item, index, ary) => {
                if (item !== 0 || item !== points_len) {
                    const cut_up = clone_up.splice(0, item);
                    const cut_down = clone_down.splice(0, item);
                    obj.push({
                        up: cut_up,
                        down: [...cut_down.reverse()],
                    });
                }
                // 无效值裁剪，最后还剩下一组数据也要保存起来
                if (index === ary.length - 1) {
                    clone_up.shift();
                    clone_down.shift();
                    if (clone_up.length) {
                        // console.log('--------', clone_up);
                        // console.log('--------', clone_down);
                        obj.push({
                            up: clone_up,
                            down: [...clone_down.reverse()],
                        });
                    }
                }
            });

            series_clip_points.push(obj);
            /** --------------无效值裁切-----end---------------------- */

            series_points.push({
                up: cur_up_points,
                down: cur_down_points,
            });
        }

        chartGroup.add(data_group);
        chartGroup.add(point_group);
        return {
            series_points,
            series_clip_points,
        };
    }

    // 绘制河流图
    function drawRiver(points, clip_points) {
        for (let i = 0; i < points.length; i++) {
            const p_item = points[i];
            const cp_item = clip_points[i];

            const river = new BezierArea({
                name: `river`,
                shape: {
                    up_points: p_item.up,
                    down_points: p_item.down,
                    smooth,
                    curvature: 0.3,
                },
                style: {
                    stroke: color(ColorList[i % ColorList.length]),
                    // stroke: color(ColorList[i % ColorList.length]),
                    fill: color(
                        changeRgbaOpacity(
                            ColorList[i % ColorList.length],
                            area_visible ? ((area_opacity / 100) * light_opacity) / 100 : 0,
                        ),
                    ),

                    lineWidth: line_w,
                    lineDash: line_type === 'solid' ? '' : dash_array,
                },
                z: G_INDEX.shape - i,
            });

            if (cp_item.length) {
                let compoundPath = new CompoundPath({
                    segmentIgnoreThreshold: 20,
                    shape: {
                        paths: [],
                    },
                    style: {},
                });
                cp_item.forEach((ele, i) => {
                    const clip_river = new BezierArea({
                        name: `clip_river`,
                        shape: {
                            up_points: ele.up,
                            down_points: ele.down,
                            smooth,
                            curvature: 0.3,
                        },
                        style: {
                            stroke: 'yellow',
                            fill: 'green',
                            lineWidth: line_w,
                        },
                        z: G_INDEX.shape,
                    });
                    compoundPath.shape.paths.push(clip_river);
                });
                river.setClipPath(compoundPath);
            }

            river_group.add(river);
        }
        clip_group.add(river_group);
        
        if(animation_open && isFadeIn){
            addAnimate(river_group, ['fadeIn']);
        }
    }

    // 绘制描边
    function drawBorder(points) {
        const bw = (border_line_width / 100) * x_w * 0.05;

        // 最下描边
        const d_points = [...points[0].down];

        // 上描边
        points.forEach((item, i) => {
            if (i === 0) {
                const d_line = new BezierLine({
                    shape: {
                        points: d_points,
                        smooth,
                        curvature: 0.3,
                    },
                    style: {
                        stroke: color(borderColor),
                        fill: null,
                        lineWidth: bw,
                        lineDash: border_line_type === 'solid' ? '' : border_dash,
                    },
                    // z: G_INDEX.shape + 10,
                    z: G_INDEX.shape - i,
                });
                border_group.add(d_line);
            }

            const river_line = new BezierLine({
                shape: {
                    points: item.up,
                    smooth,
                    curvature: 0.3,
                },
                style: {
                    stroke: color(borderColor),
                    fill: null,
                    lineWidth: bw,
                    lineDash: border_line_type === 'solid' ? '' : border_dash,
                },
                // z: G_INDEX.shape + 10 - i,
                z: G_INDEX.shape - i,
            });

            border_group.add(river_line);
        });
        clip_group.add(border_group);
    }

    // 绘制发光
    function drawLight(points) {
        const l_group = cloneDeep(river_group);

        l_group.eachChild((child, i) => {
            child.attr({
                style: {
                    stroke: null,
                    fill: color(
                        changeRgbaOpacity(ColorList[i % ColorList.length], area_visible ? light_opacity / 100 : 0),
                    ),
                    shadowColor: color(ColorList[i % ColorList.length]),
                    shadowBlur: light_blur,
                    opacity: 0,
                },
            });
        });
        light_group.add(l_group);
        clip_group.add(light_group);
        if(animation_open && isFadeIn){
            addAnimate(light_group, ['fadeIn']);
        }
    }

    // 绘制阴影
    function drawShadow(points) {
        const s_group = cloneDeep(river_group);

        s_group.eachChild((child, i) => {
            child.attr({
                style: {
                    stroke: null,
                    fill: color(
                        changeRgbaOpacity(ColorList[i % ColorList.length], area_visible ? area_opacity / 100 : 0),
                    ),
                    shadowColor: color(outsetColor, 1),
                    shadowOffsetX: outset_h,
                    shadowOffsetY: outset_v,
                    shadowBlur: outset_blur,
                },
            });
        });
        shadow_group.add(s_group);
        clip_group.add(shadow_group);
        if(animation_open && isFadeIn){
            addAnimate(shadow_group, ['fadeIn']);
        }
    }

    // 绘制裁遮罩动画
    function clipArea() {
       
        const { s_x, s_y, y_h, x_w } = _coorInfo;
        const rect = new Rect({
            shape: {
                x: s_x,
                y: s_y,
                width: x_w,
                height: y_h,
            },
            style: {
                fill: 'red',
                stroke: 'yellow',
                opacity: 1,
            },
            z: G_INDEX.hover,
        });


        if (animation_open ) {
            if(isGrow){
                rect.attr({
                    shape: {
                        width: 1,
                    },
                });
                rect.animateTo(
                    {
                        shape: {
                            width: x_w,
                        },
                    },
                    {
                        duration: 800,
                    },
                );
            }
            if(isScale){
                clip_group.origin = [0, middle_posY]
                clip_group.scale = [1, 0];

                clip_group.animateTo(
                    {
                        scale:  [1, 1]
                    },
                    {
                        duration: 500,
                    },
                );
            }
            
        }
        clip_group.setClipPath(rect);
        
        
   
    }

    // 鼠标划过提示
    function hoverTip() {
        const { s_x, s_y, y_h, x_w } = _coorInfo;
        const bar_group = new Group({ name: 'GroupBar' });
        for (let i = 0; i < rulesX_ary.length; i++) {
            const cur_x = rulesX_ary[i] - x_axis_every_space / 2;
            const cur_y = s_y;
            const bar = new Rect({
                shape: {
                    x: cur_x,
                    y: cur_y,
                    width: x_axis_every_space,
                    height: y_h,
                },
                style: {
                    fill: 'rgba(255,255,255,0)',
                    // stroke: 'red',
                },
                z: G_INDEX.data,
            });

            addHoverAction(bar, { cid: positionList[i]?.cid });

            bar_group.add(bar);
        }
        chartGroup.add(bar_group);
    }

    function render() {
        // 坐标系
        chartGroup.add(Coordinate);

        // 获取河流节点
        const { series_points, series_clip_points } = getRiverPoints();
        // console.log(series_points);

        // 绘制河流
        drawRiver(series_points, series_clip_points);
        // 绘制描边
        drawBorder(series_points);
        // 绘制发光
        drawLight(series_points);
        // 绘制阴影
        drawShadow(series_points);
        chartGroup.add(clip_group);

        // 遮罩动画;
        clipArea();

        hoverTip();
    }

    render();
    return chartGroup;
}
