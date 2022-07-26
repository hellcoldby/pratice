/**
 * 玫瑰图
 */
import { Group, Circle, Arc, Rect, Ellipse, Sector, Text } from '../../shape';
import { getFirstData, getMax, getMin } from '../Jade/jade_util';
import { color, toRgba } from '../../utils/color';
import { G_INDEX } from '../../utils/common';
import { changeRgbaOpacity, isNumber } from '../Jade/jade_util.js';
import position_info from '../../guide/coordinate/position_info';
import { getFontWidth, getRound } from '../../guide/coordinate/guide_common';
import { fix_data_pos,fix_guide_pos, quadrantConversion, pointByRad, asin } from './rose_util';
import { guideLine } from '../../components/guideLine';
import { addAnimate } from '../../animation/common';


function Rose(config) {
    const { maxWidth, maxHeight, configData, chartData, zoom, addHoverAction } = config;
    const info = position_info(config);
    // console.log(info);
    const { y_axis_max_height } = info;

    const chartGroup = new Group({ name: `rose` });

    const {
        analysis: { rose_type, sort, type },
        general: {
            space: gap, // 间距
            hole_r: hole_r_per, // 内环占半径的百分比
            r: rose_r, // 自定义半径
            outset: {
                h: outset_h, // 外阴影_水平
                v: outset_v, // 外阴影_垂直
                blur: outset_blur, // 外阴影_模糊
            },
            light: {
                // 发光
                opacity: light_opacity,
                extent: light_extent, // 默认50，显示范围百分比
            },
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
            ccw, // 顺逆时针
            s_angle, // 起始角度
            area: {
                visible: area_visible, // 面积显隐，默认关闭
                opacity: area_opacity, // 面积透明度（0~100）
            },
            line: {
                line_type, // 属性值：solid（实线，默认）、dashed（虚线）
                line_width,
                dash_array, // 虚线数组
            },
        },
        data: {
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
            type: dataType, // 数值的显示类型 normal、percent
            radial_offset, //
            guide_mode,// 指引线开关，默认关闭false
            guide_line:{ 
                line_length:guide_len1, 
                line_type:guide_len1_type,
                line_width:guide_len1_Width

            },
            guide_line_2:{
                line_length:guide_len2, 
                line_type:guide_len2_type,
                line_width:guide_len2_Width
            }
        },
        default_theme: {
            data: {
                text_color: data_textColor, // 柱子提示文字的颜色
                text_stroke: tip_textBorderColor, // 文字描边的颜色
                bubble: {
                    // 提示文字的气泡
                    border: bubble_borderColor, // 气泡边框颜色
                    color: bubble_bgColor, // 气泡背景色
                    lead_wire: bubble_leadColor, // 气泡引线颜色
                },
            },
            graph: {
                colors: graphColors,
                inset: insetColor,
                outset: outsetColor,
                border: graph_borderColor,
            },
        },
    } = configData;

    // 动画
    const { open: animation_open } = configData.animation;

    // 获取每个系列下的第一个值（并删除空值）
    const newAry = getFirstData(chartData, true);

    if (!newAry.length) return chartGroup;
    let { max_val } = getMax(newAry);
    let { min_val } = getMin(newAry);
    // 数据量
    const total_len = newAry.length;


    // 取绝对值的最大值
    const abs_val_max = Math.max(Math.abs(max_val), Math.abs(min_val));

    // 半径的最大高度
    const larger_r = Math.min(y_axis_max_height, maxWidth);
    const r_max = ((rose_r / 100) * larger_r) / 2 || 1;

    // 气泡的内边距
    const bubble_padding = data_fontSize / 6;

    // 中心的孔径大小
    let hole_r = hole_r_per <= 1 ? 1 : (hole_r_per / 100) * r_max;
    hole_r = hole_r >= r_max ? hole_r - 1 : hole_r;

    // 最大值和最大高度的像素比
    const pixelRatio = abs_val_max ? r_max / abs_val_max : 0;

    // 图形的中心点坐标
    const centX = maxWidth / 2;
    const centY = maxHeight / 2;

    // 顺逆时针的转换
    const ccw_flag = ccw ? -1 : 1;

    // 扇形缝隙间距= 10 * 百分比
    const gap_space = (gap / 100) * 10 * ccw_flag;
    const total_gap = Math.abs(total_len * gap_space);
    

    // 数据是否需要排序
    if (sort !== 'normal') {
        newAry.sort(function (a, b) {
            return sort === 'minToMax' ? a.y - b.y : b.y - a.y;
        });
    }

    // 所有数值总和
    let sum = 0;
    newAry.forEach((item) => {
        sum += Math.abs(Number(item.y));
    });
    if (typeof sum !== 'number') return chartGroup;

    let _maxValue = max_val;
    let _minValue = min_val;
    if (dataType !== 'normal') {
        _maxValue = Math.abs(Number(max_val) / sum);
        _minValue = Math.abs(Number(min_val) / sum);
    }
  

      // 最大值的半径
      let max_val_r = 0;

    
    /** 数据转换为角度
     * trans_data_to_rad
     * rose_type === radius规则1：按照数据量平均分配角度
     * rose_type === area 规则2：按照数据所占百分比计算角度
     * @returns  
     * 返回每条数据对应的 半径长度r 开始角度s_angle 、结束角度e_angle、百分比pre
     */
    function trans_data_to_rad() {
        const initAngle = s_angle * -1;
        let cur_angle = 0;
        if (rose_type === 'radius') {
            cur_angle = ((360 - total_gap) / total_len) * ccw_flag;
        }
        const res_ary= newAry.map((item, index, ary) => {
            let s_angle = 0;
            let e_angle = 0;

            const pre = sum ? Math.abs(Number(item.y) / sum) : 0;

            if (rose_type == 'area') {
                cur_angle = Math.abs(pre) * (360 - total_gap) * ccw_flag;
            }
            if (index === 0) {
                s_angle = initAngle;
                e_angle = s_angle + cur_angle;
            } else {
                s_angle = ary[index - 1].e_angle + gap_space;
                e_angle = s_angle + cur_angle;
            }

            let radius =
                hole_r +
                (abs_val_max * pixelRatio - hole_r) *
                    (abs_val_max ? Math.abs(item.y) / abs_val_max : 0);

            if(Math.abs(item.y) === abs_val_max){
                max_val_r = radius;
            }

            // 径向偏移
            const _radial_offset = (radial_offset / 100) * radius;

            //中心点角度
            const center_angle = s_angle + cur_angle / 2;
            //中心点弧度
            const center_rad = center_angle * Math.PI/180;

            //中心点坐标
            const center_x =
                (radius + _radial_offset) * Math.cos(center_rad);
            const center_y =
                (radius + _radial_offset) * Math.sin(center_rad);
            // 获取象限
            const qua = quadrantConversion(center_rad); 
            // 获取数据坐标
            item.data_pos = { x: centX + center_x, y: centY + center_y }; 
            item.r = radius;
            item.s_angle = s_angle;
            item.e_angle = e_angle;
            item.c_rad = center_rad;
            item.pre = pre;
            item.qua = qua;
            return item;
        });

        return  res_ary
    }

    //主函数
    function main() {
        const res_ary = trans_data_to_rad();
        const guide_line = new Reset_data_position(centX, centY, max_val_r, guide_len1, guide_len2);
        for (let i = 0; i < total_len; i++) {
            let zLevel = G_INDEX.slot;
            let index = i;
          
            if (sort !== 'normal') {
                index = sort === 'minToMax' ? i : total_len - 1 - i;
            }

            const item = res_ary[index];
            // 层级关系
            zLevel = G_INDEX.slot + Math.abs(item.y) * 10 + i;
            const curColor = color(
                changeRgbaOpacity(
                    graphColors[item._order % graphColors.length],
                    area_visible ? area_opacity / 100 : 0,
                ),
            );
            const line_width = (line_width / 100) * item.r * 0.1;
            
            //转换为弧度
            item.s_angle = item.s_angle * Math.PI /180;
            item.e_angle = item.e_angle * Math.PI /180;
            //生成配置
            const opt = {
                shape: {
                    cx: centX,
                    cy: centY,
                    r: item.r,
                    r0: hole_r,
                    startAngle: item.s_angle ,
                    endAngle: item.e_angle ,
                    clockwise: !ccw,
                    cornerRadius: [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]

                },
                style: {
                    fill: curColor,
                    stroke: color(graphColors[item._order % graphColors.length]),
                    lineWidth: line_width * 2,
                    lineDash: line_type === 'solid' ? '' : dash_array,
                },
                z: zLevel + 1,
            };
            //打组裁切
            const clip_group = new Group({ name: `clip${index}` });
            //合成参数
            const params  = {
                item,
                opt,
                clip_group,
                line_width,
                zLevel,
                i
            }
            
            drawRose(params);
            drawShadow(params);
            drawLight(params);
            drawStroke(params);
            drawStrokeClip(params);
            //数据气泡节点
            const data_node = isDrawData(params)(renderData);
            //指引线处理
            if (data_visible && guide_mode) {
               
                guide_line.add({...item, data_node,  callback:drawGuidLine} );
            }
            chartGroup.add(data_node);
           
            addHoverAction(clip_group, { sid: item.from, cid: item.id });
            chartGroup.add(clip_group);
        }
        guide_line.sort();
    }

    //绘制玫瑰图
    function drawRose({item, opt, clip_group}){
        const arc = new Sector({
            shape: {
                ...opt.shape,
                endAngle: animation_open
                    ? item.s_angle
                    : item.e_angle 
            },
            style: {
                ...opt.style,
            },
            z: opt.z,
        });
        if(animation_open){
            arc.animateTo(
                {
                    shape: {
                        endAngle: item.e_angle,
                    },
                },
                {
                    duration: 600,
                    easing: 'cubicInOut',
                },
            );
        }
        if (item.y !== 0) {
            clip_group.add(arc);
        }
    }

    //绘制投影
    function drawShadow({item, opt, line_width, zLevel}){
        const shadow = new Sector({
            shape: {
                ...opt.shape,
                endAngle: animation_open
                    ? item.s_angle 
                    : item.e_angle 
            },
            style: {
                ...opt.style,

                stroke: null,
                lineWidth: line_width,
                shadowColor: color(changeRgbaOpacity(outsetColor, 1)),
                shadowOffsetX: outset_h,
                shadowOffsetY: outset_v,
                shadowBlur: outset_blur,
            },
            z: zLevel,
        });
        // 阴影
        if (outset_v || outset_h || outset_blur) {
            if (item.y !== 0) {
                chartGroup.add(shadow);
            }
        }
        if (animation_open) {
            shadow.animateTo(
                {
                    shape: {
                        endAngle: item.e_angle 
                    },
                },
                {
                    duration: 600,
                    easing: 'cubicInOut',
                },
            );
        }
    }

    //绘制发光
    function drawLight({item, opt, zLevel}){
        const light = new Sector({
            shape: {
                ...opt.shape,
                endAngle: animation_open
                    ? item.s_angle 
                    : item.e_angle ,
            },
            style: {
                ...opt.style,
                stroke: null,
                // lineWidth: line_width,
                shadowColor: color(
                    changeRgbaOpacity(
                        graphColors[item._order % graphColors.length],
                        area_visible ? light_opacity / 100 : 0,
                    ),
                ),
                shadowBlur: light_extent,
            },
            z: zLevel,
        });
        // 发光 （层级最高）
        if (item.y !== 0) {
            chartGroup.add(light);
        }

        if(animation_open){
            light.animateTo(
                {
                    shape: {
                        endAngle: item.e_angle,
                    },
                },
                {
                    duration: 600,
                    easing: 'cubicInOut',
                },
            );
        }
    }

    //绘制描边
    function drawStroke({item, opt, clip_group, zLevel, i}){
        // 绘制描边 位于线的上层
        const border_r = (border_line_width / 100) * item.r * 0.1;
        const border = new Sector({
            shape: opt.shape,
            style: {
                ...opt.style,
                opacity: animation_open ? 0 : 1,
                fill: null,
                stroke: color(graph_borderColor),
                lineWidth: border_r * 2,
                lineDash: border_line_type === 'solid' ? '' : border_line_dash,
            },
            z: zLevel + 1 + i * 2,
        });

        if(animation_open){
            border.animateTo(
                {
                    style: {
                        opacity: 1,
                    },
                },
                {
                    duration: 400,
                    delay: 400,
                    easing: 'cubicInOut',
                },
            );
        }
          // 裁切区域
          if (item.y !== 0) {
            clip_group.add(border);
        }
    }

    //绘制描边裁切
    function  drawStrokeClip({item, opt, clip_group, zLevel}){
        // 绘制描边裁切
        const clipBorder = new Sector({
            shape: {
                ...opt.shape,
            },
            style: {
                ...opt.style,
                fill: 'red', // 需要一个填充色，避免hover 提示失效
                stroke: null,
                lineWidth: 0,
            },
            z: zLevel,
        });
          // 裁切区域（玫瑰图 + 描边）
          if (item.y !== 0) {
            clip_group.setClipPath(clipBorder);
        }

        
    }

    //判断渲染条件 -- thunk回调
    function isDrawData(params){
        const{item} = params;
        let isRender = false;  
        if (data_visible) {
            const cur_data = dataType === 'normal' ? item.y : item.pre;
            if (dataMaxMin === 'max' && _maxValue === cur_data) {
                isRender = true;
            } else if (dataMaxMin === 'min' && _minValue === cur_data) {
                isRender = true;
            } else if (
                dataMaxMin === 'ex' &&
                (_maxValue === cur_data || _minValue === cur_data)
            ) {
                isRender = true;
            } else if (dataMaxMin === 'all') {
                isRender = true;
            }
            
        }

        return function(renderData){
            if(isRender){
               return renderData(params);
            }
        }
    }
    
    //绘制数据
    function renderData({item, opt, clip_group, zLevel}) {
        const { x, y } = item.data_pos;
        const _cur_data =
            dataType === 'normal'
                ? item.y
                : (item.y > 0 ? 1 : -1) * (item.pre * 100).toFixed(2) + '%';
        const value_width = getFontWidth(_cur_data, data_fontSize, data_fontFamily);
        let cur_x = 0;
        let cur_y = 0;
        let cur_w = value_width;
        let cur_h = data_fontSize;
        let cur_r = null;
        let _bubble_borderWidth = 0;

        if (bubble_visible) {
            cur_h = data_fontSize + bubble_padding * 2;
            cur_w = cur_h * 2;
            cur_w = value_width > cur_w ? value_width + bubble_padding * 2 : cur_w;
            // 较小的边作为圆角的基础
            const borderMin = Math.min(cur_w, cur_h);
            cur_r = [
                getRound(borderMin, bubble_tl),
                getRound(borderMin, bubble_tr),
                getRound(borderMin, bubble_br),
                getRound(borderMin, bubble_bl),
            ];

            _bubble_borderWidth = (borderMin * bubble_borderWidth) / 100;
        }

        ({ _x: cur_x, _y: cur_y } = fix_data_pos(item.qua, x, y, cur_w, cur_h));

        const data = new Rect({
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
                    text: _cur_data,
                    fill: color(data_textColor),
                    fontSize: data_fontSize,
                    fontFamily: data_fontFamily,
                    fontStyle: data_fontStyle,
                    fontWeight: data_fontWeight,
                    textAlign: 'center',

                    textPadding: data_fontSize / 6,
                },
                z: G_INDEX.slot * 10 + 1,
            }),
            z: G_INDEX.slot * 10,
        });
        // console.log(data);
        return data;
      
    }

    function drawGuidLine(startPoint, middlePoint, endPoint){
        
            // 绘制指引线
            const lineSet = guideLine({
                config: configData,
                point: [startPoint, middlePoint, endPoint],
            });
            animation_open && lineSet.eachChild((child) => addAnimate(child,['fadeIn']));
            chartGroup.add(lineSet);
        
    }

    // 创建指引线原型
    class Reset_data_position{
        constructor(cx, cy, cr, line1, line2){
            this.cx = cx;
            this.cy = cy;
            this.cr = cr;
            this.line1 = line1;
            this.line2 = line2;
            // 返回一四象限在右侧的数组
            // 返回二三象限在左侧数组
            this.left_ary = [];
            this.right_ary = [];
        }
        add(item){
            if(item.qua === 1 || item.qua === 4){
                this.right_ary.push(item);
            }else{
                this.left_ary.push(item);
            }
        }

        sort(){
            //排序
            this.left_ary.sort((a,b)=>(b.c_rad - a.c_rad));
            this.right_ary.sort((a,b)=>(a.c_rad - b.c_rad));
            // console.log('----',this.right_ary, this.left_ary);
            this.getPos();
        }

        getPos(){
            //迭代计算位置信息
            this.left_ary.length && this.left_ary.reduce(this.reduceFn(-1), null);
            this.right_ary.length && this.right_ary.reduce(this.reduceFn(1), null);
        }

        reduceFn(dir){
            const { cx, cy, cr, line1, line2} = this;
            const offSet = dir * line2;
            const labelR = cr + line1;

            return (stackH, curr, index,)=>{
                const {data_node:box, c_rad:rad , qua, callback, r:cur_r} = curr;
                if(!box) return;
                // 盒子尺寸
                const {width:boxW,  height: boxH } = box.getBoundingRect();
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
                const { _x: cur_x, _y: cur_y } = fix_guide_pos(qua, endPoint.x, endPoint.y, boxW, boxH/2);
                box.attr({ 
                    shape:{
                        x: cur_x,
                        y: cur_y
                    } 
                });
                // 执行回调函数
                callback?.(pointByRad(cx, cy, cur_r, rad), middlePoint, endPoint);

                return endPoint.y + boxH / 2;
            }

        }

    }

    main();
    return chartGroup;
   
}

export default Rose;
