/*
 * Description:漏斗图
 * Author: vicky
 * Date: 2020-12-02 17:55:32
 * LastEditTime: 2022-01-21 16:05:18
 * FilePath: \packages\raycharts\src\charts\Funnel\index.js
 */
import { Group, Trapezoid ,Rect} from '../../shape';
import { getColorsByNum } from '../public/assist';
import { G_NAME, G_INDEX, color } from '../../utils';
import { addBubble } from '../public/decorate';
// import { addAnimate, addAnimateOneByOne, fadeIn } from './animator';
import { isArray } from '../../utils/base';
import _ from 'lodash';
import { stringDataToNum } from '../../utils/dataUtils';
import { addAnimate, setAnimType } from '../../animation/common';

function Funnel(config) {
    //格式化数据，防止y值出现String类型数据
    config.chartData = stringDataToNum(config.chartData);
    const { maxWidth: rootW, maxHeight: rootH, chartData, configData, addHoverAction } = config;
    const {
        general: {
            graph_width: widthRatio,
            light,
            outset,
            border: { line_type, dash_array },
        },
        data: { baseline, align },
        animation: { open: aniOpen, entry: anim_entry_list },
        default_theme: { graph },
    } = configData;

    // 获取图形对应的动画列表
    const animType_list = setAnimType(anim_entry_list);
    const typeList =  animType_list.getAnim('shape');
    //删除默认动画
    const isGrow = animType_list.delAnim(typeList,'grow');
    // const isFadeIn = animType_list.delAnim(typeList,'fadeIn');
    const isScale = animType_list.delAnim(typeList, 'unfold');

    //发光的透明度是在area透明度的基础上减弱的
    let lightO = light.opacity / 100;
    //图形描边虚线数组
    let borderDashArray = isArray(dash_array) ? dash_array : null;
    //获取图形数据
    const options = getTrapezoidOptions(chartData, configData, rootW, widthRatio, rootH);

    const graphics = new Group({ name: `Graphics` });
    const shape_group = new Group({ name: 'shape_group' });
    const bubble_group = new Group({ name:'bubble_group' });
    const grow_clip_group = new Group({ name: 'grow_clip_group' });


    function main(){
        options.forEach((item, index) => {
            const shape_group_item = new Group({ name: 'shape_group_item'+index });
            if (item.value || item.value === 0) {
                let parameters = {
                    shape_group_item,
                    item,
                    index
                }
                draw_grow_mask(parameters);
                draw_shape(parameters);
                draw_shadow(parameters);
                draw_light(parameters);
                draw_data(parameters);
                shape_group.add(shape_group_item);
            }
        });
    }

        //绘制生长遮罩
    function draw_grow_mask({shape_group_item,item,index}){
        const grow_mask = new Rect({
            name: 'grow_mask',
            originX : item.origin[0],
            originY : item.origin[1] + item.shapeHeight/2,
            scaleY: 0,
            shape: {
                x: item.origin[0]-rootW/2,
                y: item.origin[1] - item.shapeHeight/2,
                width: rootW,
                height: item.shapeHeight,
            },
            style:{
                fill:'rgba(255,255,0,1)',
                stroke:'yellow'
            },
            z: G_INDEX.shape*10,
        });

        grow_clip_group.add(grow_mask);

        // grow_mask.animateTo({
        //     scaleY: 1
        // })
        shape_group_item.setClipPath(grow_mask);

    }

    //绘制漏斗图
    function draw_shape({shape_group_item,item,index}){
        let trapezoid = new Trapezoid({
            name: 'shape',
            z: G_INDEX.shape,
            dataIndex: index,
            shape: {
                points: item.points,
                r: item.r,
            },
            style: {
                fill: color(item.color),
                stroke: color(graph.border),
                lineWidth: item.lineWidth,
                lineDash: line_type === 'solid' ? null : borderDashArray,
                opacity: 1,
            },
        });

        //绘制裁切区域
        const trapezoid_clip =  new Trapezoid({
            originX : item.origin[0],
            originY : item.origin[1] - item.shapeHeight/2,
            z: G_INDEX.shape + 1,
            shape: {
                points: item.points,
                r: item.r,
            },
            style: {
                fill:'red'
            }

        });
        // trapezoid.setClipPath(trapezoid_clip);
        //添加交互
        addHoverAction(trapezoid, { cid: item.cid, sid: item.sid });
        shape_group_item.add(trapezoid);

    }

    //绘制阴影
    function draw_shadow({shape_group_item,item,index}){
        let trapezoidShadow = new Trapezoid({
            name: 'shadow',
            z: G_INDEX.base,
            dataIndex: index,
            shape: {
                points: item.points,
                r: item.r,
            },
            style: {
                fill: color(item.color),
                stroke: color(graph.border),
                lineWidth: 0,
                lineDash: line_type === 'solid' ? null : borderDashArray,
                opacity: 1,
                shadowOffsetX: (outset.h / 100) * rootW * 0.3,
                shadowOffsetY: (outset.v / 100) * rootW * 0.3,
                shadowBlur: (outset.blur / 100) * 200,
                shadowColor: color(graph.outset),
            },
        });
        shape_group_item.add(trapezoidShadow);
    }
    //绘制发光
    function draw_light({shape_group_item,item,index}){
        if (light.opacity !== 0 && light.extent !== 0) {
            let trapezoidLight = new Trapezoid({
                name: 'light',
                dataIndex: index,
                z: G_INDEX.base,
                shape: {
                    points: item.points,
                    r: item.r,
                },
                style: {
                    fill: color(item.color),
                    stroke: color(graph.border),
                    lineWidth: 0,
                    lineDash: line_type === 'solid' ? null : borderDashArray,
                    opacity: 1,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: (light.extent / 100) * 200,
                    shadowColor: color(item.color, { opacity: lightO }),
                },
            });
            shape_group_item.add(trapezoidLight);
        }
    }

    //绘制数据气泡
    function draw_data({item}){
        let oX = item.origin[0],
        oY = item.origin[1];
        let bubbleData = {
            x: oX,
            y: oY,
            value: item.value,
            isMax: item.isMax,
            isMin: item.isMin,
            seriesSum: item.maxWidthValue,
        };
        //添加数据
        let bubble = addBubble({
            ...config,
            z: G_INDEX.data,
            bubbleData: bubbleData,
        });
        //图形不显示给数据加交互
        !item.showGraph &&
            bubble.eachChild((e) => {
                e.silent = false;
                addHoverAction(e, { cid: item.cid, sid: item.sid });
            });
        //处理数据位置,控制字段baseline,align
        let bubbleRect = bubble.getBoundingRect();
        let sHeight = item.shapeHeight;
        //基线位置oY中心Y值坐标
        //起始坐标
        let sY = oY - sHeight / 2;
        let blPosition = { start: sY + sHeight, center: sY + sHeight / 2, end: sY };
        //内部位置
        let inPosition = { start: -bubbleRect.height / 2, center: 0, end: bubbleRect.height / 2 };
        bubble.position = [oX, blPosition[baseline ? baseline : 'end'] + inPosition[align ? align : 'end']];
        bubble_group.add(bubble);
    }

    //动画
    function add_anim(){

     
        //自定义缩放动画
      
        if(isScale && aniOpen){
            shape_group.originX = rootW/2;
            shape_group.originY = 0;
            shape_group.scaleX = 0;
            shape_group.animateTo({
                scaleX: 1
            },{
                duration: 600,
                delay:100,
            })
        }

        //自定义生长动画
       
        if(isGrow && aniOpen){
            grow_clip_group.eachChild(child=>{
                child.animateTo({
                    scaleY: 1
                })
            })

        }
        aniOpen && shape_group.eachChild((child) => {
            addAnimate(child, typeList, 600, 100 );
        });

        aniOpen && bubble_group.eachChild((child) =>  addAnimate(child, typeList, 600, 100 ));
    }

    function render(){
        main();
        add_anim();
        graphics.add(shape_group);
        graphics.add(bubble_group);
    }

    render();
    return graphics;
}

/**
 * @method getTrapezoidOptions 获取漏斗图相关配置信息
 * @param {*} data chartData数据
 * @param {*} config configData
 * @param {*} drawWidth 绘图区域宽
 * @param {*} drawHeight 绘图区域高
 */
function getTrapezoidOptions(data, config, drawWidth, widthRatio, drawHeight) {
    const {
        analysis: { sort: dataSort },
        general: {
            space: spacePer,
            direction,
            sharp,
            border: { radius, line_width },
        },
        guide: { padding },
        default_theme: { graph },
    } = config;
    //可绘制区域信息
    //边距
    let left = limitValue(padding.left, drawWidth * 0.2),
        right = limitValue(padding.right, drawWidth * 0.2),
        top = limitValue(padding.top, drawHeight * 0.2),
        bottom = limitValue(padding.bottom, drawHeight * 0.2);
    let maxWidth = drawWidth - left - right;
    let width = (widthRatio / 100) * maxWidth;
    let height = drawHeight - top - bottom;
    //间距
    let space = limitValue(spacePer, drawHeight * 0.02);
    //筛选系列，每个系列第一个分类值
    let category = data?.categoryList[0];
    let c_data = data?.dataBaseCategory[category.cid] ?? [];
    //极值
    const maxValue = Math.max(...c_data);
    const minValue = Math.min(...c_data);
    //宽度最大值
    let maxWidthValue = Math.abs(
        _.maxBy(c_data, (e) => {
            return Math.abs(e);
        }),
    );
    let info = [];
    //图形总数
    let num = data.seriesList.length;
    //颜色
    let colors = getColorsByNum(graph.colors, num);
    //梯形高度
    let shapeHeight = (height - space * (num - 1)) / num;
    //提醒描边宽度
    let lineWidth = limitValue(line_width, shapeHeight * 0.4);
    !_.isEmpty(data.seriesList) &&
        data.seriesList.forEach((item, index) => {
            let value = c_data[index];
            info.push({
                ...item,
                ...category,
                value,
                color: colors[index],
                isMax: value === maxValue,
                isMin: value === minValue,
                lineWidth,
                maxWidthValue,
                shapeHeight,
            });
        });
    if (dataSort !== 'normal') {
        let orders = dataSort === 'maxToMin' ? 'desc' : 'asc';
        info = _.orderBy(info, ['value'], orders);
    }
    //排序后位置信息计算
    let cx = left + maxWidth / 2;
    let startY = top;
    info.map((item, index) => {
        //计算原点位置
        let cy = startY + shapeHeight / 2;
        //长度计算
        let value, nextValue;
        if (direction) {
            value = index === 0 ? (sharp ? 0 : item.value) : info[index - 1].value;
            nextValue = item.value;
        } else {
            value = item.value;
            nextValue = index < num - 1 ? info[index + 1].value : sharp ? 0 : value;
        }
        let tl = lineLength(width * (value / maxWidthValue));
        let bl = lineLength(width * (nextValue / maxWidthValue));
        // 当数据为0，并且置于图形底部的时候不显示
        item.showGraph = true;
        if (item.value === 0 && tl === bl) {
            (tl = 0), (bl = 0);
            item.showGraph = false;
        }
        item.points = getTrapezoidPoints(cx, startY, shapeHeight, tl, bl);
        //圆角半径最大值
        let maxR = Math.min(Math.abs(tl), Math.abs(bl), shapeHeight);
        //根据翻转处理圆角
        let tleft = tl < 0 ? radius.tright : radius.tleft;
        let tright = tl < 0 ? radius.tleft : radius.tright;
        let bleft = bl < 0 ? radius.bright : radius.bleft;
        let bright = bl < 0 ? radius.bleft : radius.bright;
        //计算圆角
        item.r = [limitValue(tleft, maxR), limitValue(tright, maxR), limitValue(bright, maxR), limitValue(bleft, maxR)];
        item.origin = [cx, cy];
        startY = startY + shapeHeight + space;
        return item;
    });
    return info;
}

/**
 * @method getTrapezoidPoints 获取梯形点数组
 * @param {*} cx 梯形圆心x坐标
 * @param {*} y 梯形起始y坐标
 * @param {*} height 梯形高度
 * @param {*} len1 上边长度
 * @param {*} len2 下边长度
 */
function getTrapezoidPoints(cx, y, height, len1, len2) {
    return [
        [cx - len1 / 2, y],
        [cx + len1 / 2, y],
        [cx + len2 / 2, y + height],
        [cx - len2 / 2, y + height],
    ];
}

const limitValue = (per, limit) => (limit * per) / 100;
const lineLength = (length) => (Math.abs(length) > 1 ? length : 1);

export default Funnel;
