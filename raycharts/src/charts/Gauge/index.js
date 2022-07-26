/*
 * Description:仪表板盘
 * Author: vicky
 * Date: 2020-11-12 16:49:50
 * LastEditTime: 2022-01-21 18:17:58
 * FilePath: \packages\raycharts\src\charts\Gauge\index.js
 */
import { Group, Sector, Polygon, Image } from '../../shape';
import renderGaugeCoor from '../../guide/gaugeCoor';
import { G_NAME, G_INDEX, getGaugeInfo, color, dashArray } from '../../utils';
import renderEndPoint from '../../components/endPoint';
import canMoveLabel from '../../components/canMoveLabel';
import { isArray } from '../../utils/base';
import { stringDataToNum } from '../../utils/dataUtils';
import { addAnimate, setAnimType } from '../../animation/common';

function Gauge(config) {
    const graphics = new Group({ name: `Graphics` });
    const gauge_group_slot = new Group({ name: 'gauge_group_slot' });
    const gauge_group= new Group({ name: 'gaugeGroup' });
    const gauge_group_pointer = new Group({ name: 'gauge_group_pointer' });
    // 格式化数据，防止y值出现String类型数据
    config.chartData = stringDataToNum(config.chartData);
    const { maxWidth: rootW, maxHeight: rootH, configData, addHoverAction } = config;
    const {
        animation: { open: aniOpen, entry: anim_entry_list },
    } = configData;

    const {
        general: {
            slot: {
                width: slot_width,
                outset: slot_outset,
                border: {
                    radius: {
                        tleft: slot_out_star,
                        tright: slot_out_end,
                        bright: slot_inner_end,
                        bleft: slot_inner_start,
                    },
                    line_width: slot_line_width,
                    line_type: slot_line_type,
                },
            },
            area,
            light,
            outset,
            line,
            pointer: { visible: p_visible, style: p_style, image: p_image },
            ccw,
            border: {
                radius: {
                    tleft: rad_out_star,
                    tright: rad_out_end,
                    bright: rad_inner_end,
                    bleft: rad_inner_start,
                },
               
            },
        },
        data,
        guide: { draw_coor },
        default_theme: {
            data: dataTheme,
            graph: { colors, outset: outsetColor },
            slot: slotTheme,
            pointer: pointerTheme,
            guide: { draw_coor: draw_coorTheme },
        },
    } = configData;

    // 发光的透明度是在area透明度的基础上减弱的
    let areaO = area.opacity / 100;
    let lightO = light.opacity / 100;
    lightO = areaO !== 1 ? areaO * lightO : lightO;
    // 边框线条粗细
    let rLWidth = rootW * 0.1 * (line.line_width / 100);
    // 线虚线数组
    let lineDashArray = isArray(line.dash_array) ? line.dash_array : null;
    // 获取仪表盘数据
    const gI = getGaugeInfo({ ...config });
    // 判断是否是空值
    let isNull = !gI.value && gI.value !== 0;

    // 获取图形对应的动画列表
    const animType_list = setAnimType(anim_entry_list);
    const typeList =  animType_list.getAnim('shape');
    //删除默认动画
    // const isGrow = animType_list.delAnim(typeList,'grow');
    // const isFadeIn = animType_list.delAnim(typeList,'fadeIn');
    const isScale = animType_list.delAnim(typeList, 'unfold');

    if(isNull) return graphics;

    // 分度
    function drawDividing(){
        let coorGroup = renderGaugeCoor({ ...config, gInfo: gI });
        aniOpen &&
            coorGroup.eachChild((e) => {
                addAnimate(e, ['fadeIn'], 800, 0);
            });
        graphics.add(coorGroup);
    }

    // 绘制卡槽
    function drawSlot(){
        let slot_w = gI.width * (slot_width / 100);
        let slot_r = gI.r - (gI.width - slot_w) / 2;
        let slot_r0 = gI.r0 + (gI.width - slot_w) / 2;
        let slotShape = new Sector({
            name: 'slot_shape',
            z: G_INDEX.slot,
            shape: {
                cx: gI.cx,
                cy: gI.cy,
                r: slot_r,
                r0: slot_r0,
                startAngle: gI.sAngle,
                endAngle: gI.eAngle,
                clockwise: true, // 顺逆时针绘图对于卡槽不起作用
                cornerRadius:[slot_inner_start, slot_inner_end, slot_out_star, slot_out_end]
            },
            style: {
                fill: color(slotTheme.color),
                stroke: color(slotTheme.border),
                lineWidth: slot_w * (slot_line_width / 100),
                lineDash: slot_line_type === 'solid' ? null : dashArray,
                opacity: 1,
                shadowOffsetX: (slot_outset.h / 100) * rootW * 0.3,
                shadowOffsetY: (slot_outset.v / 100) * rootW * 0.3,
                shadowBlur: (slot_outset.blur / 100) * 200,
                shadowColor: color(slotTheme.outset),
            },
        });
        // 添加交互
        addHoverAction(slotShape, { cid: gI.cId, sid: gI.sId });
        gauge_group_slot.add(slotShape);
        aniOpen &&
            gauge_group_slot.eachChild((e) => {
                // addAnimate(e, 800, 0, fadeIn);
                addAnimate(e, ['fadeIn'], 600, 100);
            });
        graphics.add(gauge_group_slot);
    }

    //绘制表盘
    function drawGuage(){
        if (gI.showGraph) {
            let gauge = new Sector({
                name: 'shape',
                z: G_INDEX.shape,
                origin: [gI.cx, gI.cy],
                shape: {
                    cx: gI.cx,
                    cy: gI.cy,
                    r: gI.r,
                    r0: gI.r0,
                    startAngle: gI.data_sAngle,
                    endAngle: gI.data_eAngle,
                    clockwise: !ccw, // 图形支持逆向
                    cornerRadius: [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                    // cornerRadius: !ccw
                    //     ? [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                    //     : [rad_inner_end, rad_inner_start, rad_out_end, rad_out_star],
                },
                style: {
                    fill: area.visible
                        ? color(colors[0], {
                              opacity: areaO,
                              linearByAngle: {
                                  sAngle: (gI.data_sAngle * 180) / Math.PI,
                                  eAngle: (gI.data_eAngle * 180) / Math.PI,
                                  ccw: !ccw,
                              },
                          })
                        : null,
                    stroke: color(colors[0], {
                        linearByAngle: {
                            sAngle: (gI.data_sAngle * 180) / Math.PI,
                            eAngle: (gI.data_eAngle * 180) / Math.PI,
                            ccw: !ccw,
                        },
                    }),
                    lineWidth: rLWidth,
                    lineDash: line.line_type === 'solid' ? null : lineDashArray,
                    opacity: 1,
           
                },
                z:G_INDEX.shape
            });
            gauge_group.add(gauge);
            // 绘制发光
            if (light.opacity !== 0 && light.extent !== 0) {
                let gaugeLight = new Sector({
                    name: 'light',
                    z: G_INDEX.base,
                    shape: {
                        cx: gI.cx,
                        cy: gI.cy,
                        r: gI.r,
                        r0: gI.r0,
                        startAngle: gI.data_sAngle,
                        endAngle: gI.data_eAngle,
                        clockwise: !ccw,
                        cornerRadius: [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                    },
                    style: {
                        fill: area.visible ? color(colors[0], { opacity: lightO }) : null,
                        stroke: !area.visible ? color(colors[0], { opacity: lightO }) : null,
                        lineWidth: rLWidth,
                        lineDash: line.line_type === 'solid' ? null : lineDashArray,
                        opacity: 1,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: (light.extent / 100) * 200,
                        shadowColor: color(colors[0], { opacity: light }),
                    },
                });
                gauge_group.add(gaugeLight);
            }

         
  
            const strokeWidth = gI.r - gI.r0;

            aniOpen &&
                gauge_group.eachChild((e) => {
                    if(isScale){
                       e.attr({
                           shape:{
                            r: (gI.r - strokeWidth/2),
                            r0: (gI.r0 + strokeWidth/2),
                           }
                       });
                        e.animateTo({
                            shape:{
                                r: (gI.r),
                                r0: (gI.r0),
                               }
                        },{
                            duration: 600,
                            delay:100,
                        })
                    }
                        addAnimate(e, typeList, 600, 100);

                });
            addHoverAction(gauge_group, { cid: gI.cId, sid: gI.sId });
            graphics.add(gauge_group);
        }
    }

    function drawShadow(){
        if (gI.showGraph) {
            let shadow = new Sector({
                name: 'shape',
                z: G_INDEX.shape,
                origin: [gI.cx, gI.cy],
                shape: {
                    cx: gI.cx,
                    cy: gI.cy,
                    r: gI.r,
                    r0: gI.r0,
                    startAngle: gI.data_sAngle,
                    endAngle: gI.data_eAngle,
                    clockwise: !ccw, // 图形支持逆向
                    cornerRadius: [rad_inner_start, rad_inner_end, rad_out_star, rad_out_end]
                },
                style: {
                    fill: area.visible
                        ? color(colors[0], {
                              opacity: areaO,
                              linearByAngle: {
                                  sAngle: (gI.data_sAngle * 180) / Math.PI,
                                  eAngle: (gI.data_eAngle * 180) / Math.PI,
                                  ccw: !ccw,
                              },
                          })
                        : null,
                   

                    opacity: 1,
                    shadowOffsetX: (outset.h / 100) * rootW * 0.3,
                    shadowOffsetY: (outset.v / 100) * rootW * 0.3,
                    shadowBlur: (outset.blur / 100) * 200,
                    shadowColor: color(outsetColor),
                },
                z:G_INDEX.shape -10
            });
            gauge_group.add(shadow);
            const strokeWidth = gI.r - gI.r0;

            if(aniOpen){

                if(isScale){
                   shadow.attr({
                       shape:{
                        r: (gI.r - strokeWidth/2),
                        r0: (gI.r0 + strokeWidth/2),
                       }
                   });
                    shadow.animateTo({
                        shape:{
                            r: (gI.r),
                            r0: (gI.r0),
                           }
                    },{
                        duration: 600,
                        delay:100,
                    })
                }
                    addAnimate(shadow, typeList, 600, 100);
            }
       

            
        } 
    }

    //绘制指针
    function drawHand(){
        if (p_visible) {
            // 计算绘图区域最小边
            let maxWidth = Math.min(rootW, rootH);
            let p_w = maxWidth * (p_style.width / 100);
            let p_h = maxWidth * 0.5 * (p_style.height / 100);
            let a_p = [gI.cx - p_w / 2, gI.cy];
            let b_p = [gI.cx + p_w / 2, gI.cy];
            let c_p = [gI.cx, gI.cy - p_h];

            let pointer = new Polygon({

                z: G_INDEX.pointer,
                origin: [gI.cx, gI.cy],
                rotation: 1.5 * Math.PI - gI.data_eAngle,
                startAngle: 1.5 * Math.PI - gI.data_sAngle,
                endAngle: 1.5 * Math.PI - gI.data_eAngle,
                shape: {
                    points: [a_p, b_p, c_p],
                    smooth: 0,
                },
                style: {
                    fill: color(pointerTheme.color),
                    stroke: color(pointerTheme.border),
                    lineWidth: maxWidth * 0.05 * (p_style.border.line_width / 100),
                    lineDash: p_style.border.line_type === 'solid' ? null : dashArray,
                    opacity: 1,
                    lineJoin: 'round',
                },
            });
            gauge_group_pointer.add(pointer);
            // 图片填充
            let pWidth = maxWidth * (p_image.width / 100);
            let pHeight = maxWidth * (p_image.height / 100);
            let pImage = new Image({
                name: '',
                z: G_INDEX.pointer,
                origin: [gI.cx, gI.cy],
                rotation: 1.5 * Math.PI - gI.data_eAngle,
                startAngle: 1.5 * Math.PI - gI.data_sAngle,
                endAngle: 1.5 * Math.PI - gI.data_eAngle,
                style: {
                    image: p_image.src,
                    x: gI.cx - pWidth / 2,
                    y: gI.cy - pHeight / 2,
                    width: pWidth,
                    height: pHeight,
                },
            });
            gauge_group_pointer.add(pImage);
            // 处理动画和交互
            aniOpen &&
            gauge_group_pointer.eachChild((e) => {
                addAnimate(e, ['rotation'], 600, 100);
            });
            addHoverAction(gauge_group_pointer, { cid: gI.cId, sid: gI.sId });
            graphics.add(gauge_group_pointer);
        }
    }

    //绘制端点
    function drawPoint(){
        let pointGroup = renderEndPoint(configData)({
            name: 'point',
            baseZ: G_INDEX.point,
            maxSize: gI.r,
            isMin: true,
            isMax: true,
        }).attr({
            position: [gI.point.x, gI.point.y],
            rotation: 1.5 * Math.PI - gI.data_eAngle,
        });
        aniOpen &&
            pointGroup.eachChild((e) => {
                e.origin = [0, gI.centerR];
                e.sAngle = !ccw ? gI.dataAngle : -gI.dataAngle;
                e.eAngle = 0;
                // addAnimate(e, 600, 100, rotationIn);

                rotationIn(e, 600, 100);
            });
        addHoverAction(pointGroup, { cid: gI.cId, sid: gI.sId });
        graphics.add(pointGroup);
    }

    // 绘制数据
    function drawData(){
        if (data.visible) {
            let dataGroup = canMoveLabel({
                g_name: G_NAME.data,
                z: G_INDEX.data,
                content: data.type === 'normal' ? gI.value : gI.dataPctString,
                origin: { x: rootW / 2, y: rootH / 2 },
                maxOffset: gI.r * 2,
                dataOptions: data,
                dataTheme,
            });
            aniOpen &&
                dataGroup.eachChild((e) => {
                    // addAnimate(e, 800, 0, fadeIn);
                    addAnimate(e, ['fadeIn'], 800, 0);
                });
            graphics.add(dataGroup);
        }
    }

    function drawText(){
        // 绘制绘图文本
        if (draw_coor.text_visible) {
            let drawGroup = canMoveLabel({
                g_name: G_NAME.drawCoorLabel,
                z: G_INDEX.base,
                content: gI.text,
                h_offset: draw_coor.h_offset,
                v_offset: draw_coor.v_offset,
                origin: { x: rootW / 2, y: rootH / 2 },
                maxOffset: gI.r * 2,
                style: {
                    font: draw_coor.font,
                    borderHide: true,
                },
                colors: {
                    text: draw_coorTheme.label.text_color,
                    border: draw_coorTheme.label.border,
                    bg: draw_coorTheme.label.color,
                },
            });
            aniOpen &&
                drawGroup.eachChild((e) => {

                    addAnimate(e, ['fadeIn'], 800, 0);
                });
            graphics.add(drawGroup);
        }
    }

    function render(){
        drawDividing();
        drawSlot();
        drawGuage();
        drawHand();
        drawPoint();
        drawData();
        drawText();
        drawShadow();
    }

    render();

    return graphics;
}




/**
 * @method rotationIn 旋转进入
 * @param {*} child 被添加对象
 * @param {*} duration 动画时间
 * @param {*} delay 延时
 */
function rotationIn(child, duration, delay) {
    child.rotation = child.sAngle;
    child.animateTo(
        {
            rotation: child.eAngle,
        },
        { duration, delay },
    );
}

/**
 * @method growIn 增长动画
 * @param {*} child 被添加对象
 * @param {*} duration 动画时间
 * @param {*} delay 延时
 */
function growIn(child, duration, delay) {
    let endAngle = child.shape.endAngle;
    child.shape.endAngle = child.shape.startAngle;
    child.animateTo(
        {
            shape: {
                endAngle,
            },
        },
        { duration, delay },
    );
}

export default Gauge;
