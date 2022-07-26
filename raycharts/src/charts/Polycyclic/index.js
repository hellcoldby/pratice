/**
 * 多环图
 *
 * 7.14 新增 开始角度自定义
 * 9.27 新增 量程
 *
 */
import {
    getAngleAry,
    getSum,
    getData,
    getFontWidth,
    getRound,
} from '../../guide/coordinate/guide_common';
import { Group, Circle, Arc, Rect, Sector, Text } from '../../shape';
import { color } from '../../utils/color';
import { addPoint } from '../public/decorate';
import { G_INDEX } from '../../utils/common';
import { pointByRad } from '../../utils/tool';
import position_info from '../../guide/coordinate/position_info';
import { getMax, getMin } from './util';
import { getFirstData } from '../Jade/jade_util';
import { addAnimate, setAnimType } from '../../animation/common';

function Polycyclic(config) {
    const {
        maxWidth: rootW,
        maxHeight: rootH,
        configData,
        chartData,
        zoom,
        addHoverAction,
    } = config;
    const entry = true;
    const info = position_info(config);
    const {
        y_axis_max_height, // y轴高度
        animTime,
    } = info;

    const Graphics = new Group({ name: `polycyclic` });
    const hr = Graphics;

    const { default_theme } = configData;
    const { t, T } = animTime;

    // 动画开启或关闭
    const { open: animation_open, entry: anim_entry_list } = configData.animation;

    // 便签的颜色
    const {
        graph: {
            colors: barColorList, // 柱子的颜色列表
            outset: barOutsetColor, // 柱子外阴影颜色
        },
        guide: {
            draw_coor: {
                label: { text_color: label_color, color: label_bgColor },
            },
        },
    } = default_theme;

    // 获取图形对应的动画列表 返回---->> animType_list['shape'] = ['grow', 'fadeIn'];
    // const animType_list = setAnimType(anim_entry_list);
    const shape_list = setAnimType(anim_entry_list);
    const shape_anim_list = shape_list.getAnim('shape');

    // 绘制多环
    function draw(hr) {
        // 获取圆环的【配置信息】
        const {
            space: space_per, // 圆环 上部或下部的占位空间
            r, // 圆环半径百分比
            hole_r: hole_r_per, // 内环占半径的百分比
            column, // 圆环的列数
            ccw: clockwise, // 水逆时针
            light: {
                opacity: lightOpacity, // 透明度
                extent: bar_extent, // 柱子发光范围
            },
            inset: {
                h: insetH, // 内阴影宽
                v: insetV, // 内阴影高
                blur: insetBlur, // 内阴影模糊
            },
            outset: {
                h: outsetH, // 外阴影宽
                v: outsetV, // 外阴影高
                blur: outsetBlur, // 外阴影模糊
            },
            border: {
                radius: {
                    tleft: rad_out_star,
                    tright: rad_out_end,
                    bright: rad_inner_end,
                    bleft: rad_inner_start,
                },
            },
            slot: {
                width: slot_width, // 槽位宽度
                outset: { h: slot_outH, v: slot_outV, blur: slot_outBlur },
                border: {
                    line_type: slot_borderType, // 槽位线的类型
                    line_width: slot_borderWidth, // 槽位线的宽度
                },
            },
            point: {
                image: point_image, // 端点图片
                visible: point_visible, // 端点显示
                shape: point_shape, // 端点样式
                width: point_width, // 端点的宽度
                height: point_height, // 端点的高度
                border: {
                    line_type: point_lineType, // 端点线条类型
                    line_width: point_lineW, // 端点线条宽度
                },
                show: point_show, // 端点显示范围
            },
            s_angle, // 玉玦图开始角度
            e_angle, // 玉玦图结束角度
        } = configData.general;

        // 圆环数据【配置信息】
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
                    radius: {
                        tleft: bubble_tl,
                        tright: bubble_tr,
                        bright: bubble_br,
                        bleft: bubble_bl,
                    }, // 气泡的边框圆角
                    line_width: bubble_borderWidth, // 气泡的边框宽度
                },
            },
            show: dataMaxMin, // 显示最值
            type: dataType, // 数值的显示类型
            v_offset: data_v_offset_per, // 数据的垂直偏移
            h_offset: data_h_offset_per, // 数据的横向偏移
        } = configData.data;

        // 圆环文字标签【配置信息】
        // console.log(configData);
        const {
            draw_coor: {
                text_visible,
                font: {
                    font_family: text_fontFamily, // 字体类型
                    font_size: text_fontSize, // 字体大小
                    font_style: text_fontStyle,
                    text_decoration: text_dec,
                    font_weight: text_fontWeight,
                },
                v_offset: label_v_offset_per, // 偏移，0~100，默认0
                h_offset: label_h_offset_per, // 偏移，0~100，默认0
                scale: {
                    range: { open: scale_open, max: scale_max, min: scale_min },
                },
            },
        } = configData.guide;

        const {
            data: {
                text_color: tip_textColor, // 柱子提示文字的颜色
                text_stroke: tip_textBorderColor, // 文字描边的颜色
                bubble: {
                    // 提示文字的气泡
                    border: bubble_borderColor, // 气泡边框颜色
                    color: bubble_bgColor, // 气泡背景色
                    lead_wire: bubble_leadColor, // 气泡引线颜色
                },
            },
            slot: {
                color: slot_bgColor,
                border: slot_borderColor, // 槽位颜色
                outset: slot_outsetColor, // 槽位投影颜色
            },
        } = configData.default_theme;

        const start_angle = s_angle || 0;
        const end_angle = 360 + start_angle;

        // 横向圆环的最小间隔
        const h_min_space = 6 * zoom;

        // 背景环线宽度最小值
        let line_min_w = Number(zoom);

        // 纵向的间隔
        let space_H = 0;
        // 横向的间隔
        let space_W = 0;
        // 圆环的描边宽度
        let strokeW = 0;
        // 多环图的半径
        let radius = 0;

        // 去掉标题和副标题 绘图区域高度
        const canvasH = y_axis_max_height;

        // 获取每个系列下的第一个值(忽略空值)
        const newAry = getFirstData(chartData, true);
        if (!newAry.length) return null;

        // 开启量程,数据处理
        const _newAry = getScaleData(newAry, scale_open, scale_min, scale_max);

        // 基础数据的最大值
        const sum = scale_open ? Math.abs(scale_max - scale_min) : getSum(_newAry);

        // 将获取到的数组，转化为角度信息
        const angleInfo = getAngleAry(_newAry, start_angle, end_angle, sum);
        const { angleAry, percentAry } = angleInfo;

        // 当数据的长度小于 列数的时候，就用数据的长度作为列数
        const _column = angleAry.length < column ? angleAry.length : column;

        // 横向缝隙的集合
        const h_min_space_total = h_min_space * (_column - 1);
        // 根据列数计算圆环盒模型的占位宽(画布宽度 - 横向缝隙总和)/ 列数
        let diameter = (rootW - h_min_space_total) / _column;

        // 计算圆环的纵向间距
        let gap_H = (space_per / 100) * diameter;

        // 计算圆环 带上文字和数字的占位
        let placeholder_H = diameter;
        // 垂直方向圆环的占位
        placeholder_H = diameter + gap_H;

        // 计算圆环占几行
        const rows = Math.ceil(angleAry.length / _column);
        // 计算多行圆环在纵向的总高度
        const totalH = rows * placeholder_H;

        // 圆环纵向占位超出画布 就按照 纵向高度重新计算占位！！！！！！
        if (totalH > canvasH) {
            placeholder_H = canvasH / rows;
            // 用新的占位高度来 逆向推导圆环直径(带描边的直径)
            diameter = placeholder_H / (1 + space_per / 100);
            gap_H = (space_per / 100) * diameter;
        }

        /** ----------------------真实的半径-start----------------------------------- */

        // 孔径
        const hole_r = hole_r_per === 100 ? diameter / 2 - 1 : ((hole_r_per / 100) * diameter) / 2;

        // 圆环的最大半径
        radius = diameter / 2;
        radius = radius <= 0 ? 1 : radius;

        //圆环的宽度
        const shape_width = radius - hole_r;

        // 计算背景圆环（槽位）的宽度
        const _slotW = (slot_width / 100) * (radius - hole_r);
        const _slotBorderW = (slot_borderWidth / 100) * _slotW;

        // console.log('圆环占位：', diameter);
        // console.log('圆环内径：', radius);
        // console.log('槽位宽度：', _slotW);
        // console.log('描边宽度：', _slotBorderW);

        /** ------------------------------------------------------------------------- */

        let data_v_offset = 0; // 数字相对圆心的垂直偏移
        let data_h_offset = 0; // 数字相对圆心的横向偏移
        // 确定数字的位置(负数---顶部/左侧， 正数---底部/右侧)
        data_v_offset = (diameter * 1.5 * data_v_offset_per) / 100;
        data_h_offset = (diameter * 1.5 * data_h_offset_per) / 100;

        let label_v_offset = 0; // 文字相对圆心垂直的偏移
        let label_h_offset = 0; // 文字相对圆心横向的偏移
        // 确定文字标签位置信息(负数---顶部/左侧， 正数---底部/右侧)
        label_v_offset = (diameter * 1.5 * label_v_offset_per) / 100;
        label_h_offset = (diameter * 1.5 * label_h_offset_per) / 100;

        // 如果 数字 或 标签 偏移有超出圆环，判断环间隔的位置（true上，false下）
        let gap_dir_h = false;
        let gap_dir_w = false;

        if (Math.abs(data_v_offset) > diameter / 2 || Math.abs(label_v_offset) > diameter / 2) {
            gap_dir_h = data_v_offset_per + label_v_offset_per > 0 ? true : false;
        }

        // 计算纵向的间隔 (如果间距在下方, 行数rows减1 , 如果间距在上方,行数为rows )
        if (rows > 1) {
            space_H = (canvasH - rows * placeholder_H) / (gap_dir_h ? rows : rows - 1);
        }
        // 横向间隔
        if (_column > 1) {
            space_W = (rootW - diameter * _column) / (_column - 1);
        }

        /** -------------------------------------------------------------------------- */
        // 获取最大值
        const { max_val, max_per } = getMax(angleAry);
        // 获取最小值
        const { min_val, min_per } = getMin(angleAry);
        // 包含描边的半径
        const dr = diameter / 2;

        // 端点打组
        let point_group = new Group({ name: 'polycyclic_point' });

        for (let i = 0; i < angleAry.length; i++) {
            // 当前是第几行
            let curLine = Math.ceil((i + 1) / _column);
            // 当前是第几个
            let curOrder = i % _column;

            // x轴坐标的倍数关系
            let mX = (curOrder + 1) * 2 - 1;
            // y轴坐标的倍数关系
            let mY = curLine * 2 - 1;

            // 坐标
            let cx = dr * mX + curOrder * space_W;
            let cy = dr * mY + (curLine - 1) * (space_H + gap_H);
            // 如果间隔在上方
            if (gap_dir_h) {
                cy = dr * mY + curLine * (space_H + gap_H);
            }

            const item = angleAry[i];
            let dir = !clockwise && item.y > 0 ? true : false;
            if (scale_open) {
                dir = !clockwise;
            }

            const startAngle = Math.PI * (-start_angle / 180);
            const endAngle = dir
                ? Math.PI * ((item.end - start_angle) / 180)
                : (Math.PI * (-item.end - start_angle)) / 180;

            const props = {
                item,
                i,
                hr,
                cx,
                cy,
                startAngle,
                endAngle,
                dir,
            };

            drawBgCircle(props);
            drawArc(props); // 绘制圆环
            let point_res = drawEndPoint(props); // 绘制端点
            drawLight(props); // 绘制发光
            if (item && typeof item.y === 'number') {
                drawNumber(props); // 中心数字
            }
            drawLabel(props); // 中心标签
            point_group.add(point_res);
        }

        // 端点绘制动画
        point_group.eachChild((point) => {
            animation_open && point.eachChild((child) => addAnimate(child, shape_anim_list));
        });
        hr.add(point_group);

        // 绘制背景圆环（槽位）
        function drawBgCircle(props) {
            const { hr, cx, cy } = props;
            if (_slotW) {
                // 卡槽绘制
                let circle = new Sector({
                    shape: {
                        cx: cx,
                        cy: cy,
                        r: radius - shape_width/2 + _slotW/2,
                        r0: hole_r + shape_width/2 - _slotW/2,
                    },
                    style: {
                        fill: color(slot_bgColor),
                        stroke: color(slot_borderColor),
                        lineWidth: _slotBorderW,
                        shadowColor: color(slot_outsetColor),
                        shadowOffsetX: slot_outH,
                        shadowOffsetY: slot_outV,
                        shadowBlur: slot_outBlur,
                        opacity: 1,
                    },
                    z:G_INDEX.slot
                });
                hr.add(circle);

                if (animation_open) {
                    addAnimate(circle, ['fadeIn'], 1000);
                }
            }
        }

        // 绘制高亮环(hr,x,y, 不带描边的半径， 带描边的半径， )
        function drawArc(props) {
            const { item, hr, cx, cy, i, startAngle, endAngle, dir } = props;
            if (item.end === 0) return;
            const config = {
                shape: {
                    cx: cx,
                    cy: cy,
                    r: radius,
                    r0: hole_r,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    clockwise: dir,
                    // cornerRadius: dir
                    //     ? [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                    //     : [rad_inner_end, rad_inner_start, rad_out_end, rad_out_star],
                    cornerRadius: [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]

                },
                style: {
                    stroke:null,
                    fill: color(barColorList[newAry[i]._order % barColorList.length]),

                },
                z: G_INDEX.shape
            };

            let arc = new Sector(config);
            if(outsetBlur){
                arc.attr({
                    style:{
                        shadowColor: color(barOutsetColor),
                        shadowOffsetX: outsetH,
                        shadowOffsetY: outsetV,
                        shadowBlur: outsetBlur,
                    }
                })
            }
            addHoverAction(arc, { cid: item.id, sid: item.from });
            hr.add(arc);
            if (animation_open) {
                addAnimate(arc, shape_anim_list);
            }
        }

        // 绘制端点
        function drawEndPoint(props) {
            if (!point_visible) return;
            const { cx, cy, i, endAngle } = props;

            const showData = dataType === 'normal' ? angleAry[i].y : angleAry[i].percent;
            const _maxValue = dataType === 'normal' ? max_val : max_per;
            const _minValue = dataType === 'normal' ? min_val : min_per;

            // let sign = showData === _maxValue ? 'max' : showData === _minValue ? 'min' : 'normal';

            let pointInfo = pointByRad(cx, cy, radius - shape_width / 2, endAngle);
            let pointConfig = {
                ...config,
                pointData: {
                    x: pointInfo.x,
                    y: pointInfo.y,
                    angle: endAngle,
                    maxSize: radius,
                    isMax: showData === _maxValue,
                    isMin: showData === _minValue,
                },
                z: G_INDEX.point,
            };
            return addPoint(pointConfig);
        }

        // 绘制发光
        function drawLight(props) {
            if (!bar_extent) return;
            const { hr, cx, cy, i, startAngle, endAngle, dir } = props;

            let arc = new Sector({
                shape: {
                    cx: cx,
                    cy: cy,
                    r: radius,
                    r0: hole_r,
                    startAngle: startAngle,
                    endAngle: endAngle,
                    clockwise: dir,
                    // cornerRadius: dir
                    //     ? [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                    //     : [rad_inner_end, rad_inner_start, rad_out_end, rad_out_star],
                    cornerRadius: [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                },
                style: {
                    stroke: null,
                    fill: color(barColorList[newAry[i]._order % barColorList.length]),
                    // lineWidth: strokeW,
                    shadowColor: color(barColorList[newAry[i]._order % barColorList.length]),
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: bar_extent,
                    opacity: lightOpacity / 100,
                },
            });

            hr.add(arc);
            if (animation_open) {
                addAnimate(arc, shape_anim_list, );
            }
        }


        // 绘制圆环中心数字
        function drawNumber(props) {
            if (!data_visible) return;
            const { i } = props;
            // 数据显示的类型是 数字 还是 百分比
            const showData =
                dataType === 'normal'
                    ? scale_open
                        ? angleAry[i]._y
                        : angleAry[i].y
                    : angleAry[i].percent;
            // 百分比数字精确到一位小数
            const fixData = dataType === 'normal' ? showData : (showData * 100).toFixed(1) + '%';
            // 计算文字占位的宽度
            const font_ac_w = getFontWidth(fixData, data_fontSize, data_fontFamily);

            const params = {
                ...props,
                fixData,
                font_ac_w,
            };

            if (
                dataMaxMin === 'max' &&
                (dataType === 'normal' ? max_val === showData : max_per === showData)
            ) {
                drawData(params);
                drawBubble(params);
            } else if (
                dataMaxMin === 'min' &&
                (dataType === 'normal' ? min_val === showData : min_per === showData)
            ) {
                drawData(params);
                drawBubble(params);
            } else if (
                dataMaxMin === 'ex' &&
                (dataType === 'normal'
                    ? max_val === showData || min_val === showData
                    : max_per === showData || min_per === showData)
            ) {
                drawData(params);
                drawBubble(params);
            } else if (dataMaxMin === 'all') {
                drawData(params);
                drawBubble(params);
            }
        }

        // 渲染-- 绘制中心数字
        function drawData(params) {
            const { hr, cx, cy, r, fixData } = params;

            const cur_x = cx + data_h_offset;
            const cur_y = cy - data_v_offset;
            const data = new Text({
                position: [cur_x, cur_y],
                style: {
                    opacity: 1,
                    text: fixData,
                    fill: color(tip_textColor),
                    fontSize: data_fontSize,
                    fontWeight: data_fontWeight,
                    fontStyle: data_fontStyle,
                    fontFamily: data_fontFamily,
                    verticalAlign: 'middle',
                    align: 'center',
                },
                z: 5,
            });

            hr.add(data);

            if (animation_open) {
                const endOpacity = data.style.opacity;
                data.style.opacity = 0;
                data.animateTo(
                    {
                        style: {
                            opacity: endOpacity,
                        },
                    },
                    {
                        duration: 300,
                        delay: 300,
                    },
                );
            }
        }

        // 渲染--- 绘制中心数字的气泡边框
        function drawBubble(params) {
            if (!bubble_visible) return;
            const { hr, cx, cy, font_ac_w, fixData } = params;

            // 气泡的内边距
            const padding = data_fontSize / 6;
            const curH = data_fontSize + padding * 2;
            let curW = font_ac_w + padding * 2;
            curW = curH * 2;
            curW = font_ac_w > curW ? font_ac_w + padding * 2 : curW;
            // 较小的边作为圆角的基础

            let _bubble_borderWidth = 0;

            // 较小的边作为圆角的基础
            const borderMin = Math.min(curW, curH);
            _bubble_borderWidth = (borderMin * bubble_borderWidth) / 100;

            // 气泡整个占位（描边宽度是向内外延伸的）
            const bubble_placeHolder_width = _bubble_borderWidth + curW;
            const bubble_placeHolder_height = _bubble_borderWidth + curH;

            // console.log('气泡描边：', bubble_borderWidth);
            // console.log('气泡的占位：', bubble_placeHolder_width);

            // 气泡的x坐标
            const curX =
                cx + _bubble_borderWidth / 2 - bubble_placeHolder_width / 2 + data_h_offset;
            // 气泡的y坐标
            const curY =
                cy + _bubble_borderWidth / 2 - bubble_placeHolder_height / 2 - data_v_offset;

            let rect = new Rect({
                shape: {
                    x: curX,
                    y: curY,
                    width: curW,
                    height: curH,
                    r: [
                        getRound(borderMin, bubble_tl),
                        getRound(borderMin, bubble_tr),
                        getRound(borderMin, bubble_br),
                        getRound(borderMin, bubble_bl),
                    ],
                },
                style: {
                    fill: color(bubble_bgColor),
                    stroke: color(bubble_borderColor),
                    opacity: 1,
                    lineWidth: _bubble_borderWidth,
                    lineDash: bubble_borderType === 'solid' ? '' : [2, 2, 2, 2],
                    lineCap: 'square',
                },
                z: 3,
            });
            hr.add(rect);

            if (animation_open) {
                addAnimate(rect, shape_anim_list, 300, 300);
            }
        }

        // 绘制提示文字
        function drawLabel(props) {
            if (!text_visible) return;
            const { hr, cx, cy, dr, i } = props;
            let item = angleAry[i];
            // 字体占宽度
            let strW = getFontWidth(item.seriesName, text_fontSize, text_fontFamily);

            const posX = cx - Number(label_h_offset);
            const posY = cy - Number(label_v_offset);

            const label = new Text({
                x: posX,
                y: posY,
                width: strW,
                height: text_fontSize,
                style: {
                    text: item.seriesName,
                    fill: color(label_color),
                    fontSize: text_fontSize,
                    fontFamily: text_fontFamily,
                    fontStyle: text_fontStyle,
                    fontWeight: text_fontWeight,
                    verticalAlign: 'middle',
                    align: 'middle',
                },
                z: 3,
            });

            hr.add(label);

            if (animation_open) {
                const endOpacity = label.style.opacity;
                label.style.opacity = 0;
                label.animateTo(
                    {
                        style: {
                            opacity: endOpacity,
                        },
                    },
                    {
                        duration: 300,
                        delay: 300,
                    },
                );
            }
            return label;
        }

        return hr;
    }

    draw(hr);
    return Graphics;

    /**
     * tool --- 获取量程差值
     * @param {*} data 第一个系列的数据
     * @param {*} open 开启自定义刻度
     * @param {*} min  自定义刻度最小值
     * @param {*} max  自定义刻度最大值
     * @returns 自定义刻度下重新计算的值集合
     */
    function getScaleData(data, open, min, max) {
        if (!open) return data;
        const sum = Math.abs(max - min);
        return data.map((item) => {
            if (typeof item.y !== 'number' && !item.y) return item;
            item._y = item.y;
            if (min >= item._y) {
                item.y = 0;
            } else {
                // 当前值减去自定义最小值，得到新的值
                if (min <= item._y) {
                    item.y -= min;
                }
                // 新值如果超过最大值就等于最大值
                if (sum <= item.y) {
                    item.y = sum;
                }
            }

            return item;
        });
    }
}

export default Polycyclic;
