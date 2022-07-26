/*
 * Description:折线，面积，曲线
 * Author: vicky
 * Date: 2020-10-27 17:18:46
 * LastEditTime: 2020-11-03 13:47:12
 * FilePath: \packages\raycharts\src\charts\Line\index.js
 */
import { Rect, Group, CurvePolyline, CurvePolygon } from '../../shape';
import { G_NAME, G_INDEX } from '../../utils/common';
import _ from 'lodash';

import { base } from '../../utils';
const { isNumber } = base;

// 引入坐标系
import renderCoordinate from '../../guide/coordinate';
// 引入图形绘制
import renderCategoryBox from '../../components/categoryBox';
import renderEndPoint from '../../components/endPoint';
import renderDataBox from '../../components/dataBox';
import renderLineArea from '../../components/baseLineArea';
import { addAnimate, setAnimType } from '../../animation/common';

const renderLineType = (type, dashArray) =>
    type === 'solid' ? '' : type === 'dashed' ? dashArray : '';

const limitValue = (per, limit) => (limit * per) / 100;

function Line(config) {
    // 嵌入新结构 - start
    const { configData, chartData, addHoverAction, maxWidth, maxHeight } = config;
    // 整体组
    const Graphics = new Group({ name: `Graphics ${configData?.type ?? ''}` });

    // 渲染坐标轴 获取坐标轴数据
    const Coordinate = renderCoordinate(config);
    const CoordinateInfo = Coordinate?.info ?? {};
    Graphics.add(Coordinate);

    // 图形组
    const chartGroup = new Group({ name: `chartGroup ${configData?.type ?? ''}` });
    Graphics.add(chartGroup);

    // 坐标轴位置数据
    const {
        // 绘图相关
        // 位置坐标
        positionList,
        // 像素比值 px/value
        pixelRatioValue,
        // 类别的最大间隔宽度 px
        categoryMaxWeight,
        // slot
        // 值轴的最大高度 px
        valueMaxHeight,
        // 值轴最顶端到 零轴的最大偏移量 px
        slotOffset,
        // 裁切窗口
        _coorInfo: {
            s_x: baseX = 0,
            s_y: baseY = 0,
            x_w: contentWidth = maxWidth,
            y_h: contentHeight = maxHeight,
        },
    } = CoordinateInfo;

    // 图表数据
    const {
        // 系列列表
        seriesList,
        // 类别列表
        categoryList,
        // 基于系列的数据
        dataBaseSeries,
        // 基于类别的数据
        dataBaseCategory,
        // 基于系列的百分比
        perBaseSeries,
        // 基于类别的百分比
        perBaseCategory,
        // 基于系列的最值
        ultraBaseSeries,
    } = chartData;

    // 配置文件
    const {
        analysis: { type: analysis_type }, // 属性值：normal（正常，默认），percent(百分比)
        data: {
            type: DataBox_Format, // 显示的数值格式(数字 百分比)
            position: DataBox_PositionType, // 气泡的位置（上， 中， 下）
        },
        default_theme: {
            graph: { colors: Major_ColorList },
        },
        animation: { open: open_animation, entry: anim_entry_list }, // 动画开启或者关闭，默认开启true
        _mirror_axes,
    } = configData;
    const customAxis = configData.guide.draw_coor.scale.range.open;

    const shape_list = setAnimType(anim_entry_list);
    const shape_anim_list = shape_list.getAnim('shape');
    // 删除默认动画
    const isGrow = shape_list.delAnim(shape_anim_list, 'grow');
    // const isFadeIn = shape_list.delAnim(shape_anim_list,'fadeIn');
    // const isScale = shape_list.delAnim(shape_anim_list, 'unfold');

    // ------------------ 渲染方向确认 ------------------
    const growDirection = 180; // 90 , 180 , 270 , 360
    const rotationAngle = (growDirection / 360) * Math.PI * 2;

    // ------------------ 图形数据预处理 ------------------
    const checkValue = (itemData) => itemData === null || !isNumber(itemData);
    const zeroLine = positionList?.[0].position ?? [0, 0];

    // ------------------ 图形裁切处理 ----------------
    if (customAxis === true) {
        chartGroup.setClipPath(
            new Rect({ shape: { x: baseX, y: baseY, width: contentWidth, height: contentHeight } }),
        );
    }
    // 坐标点结构
    let pointMap = {};

    // 类别渲染 生成点位结构
    positionList.reduce((prev, { position, cid }, i, pArr) => {
        // hover
        prev.add(
            // 绘制 类别轴占位图层
            addHoverAction(
                renderCategoryBox({
                    name: `${i}`,
                    maxSize: [categoryMaxWeight, valueMaxHeight],
                    offsetY: [slotOffset],
                }).attr({
                    position: position,
                    rotation: rotationAngle,
                }),
                { cid },
            ),
        );
        // 基于系列 位置计算
        seriesList.reduce((subPrev, { sid, name }, j) => {
            // 获取当前数据值
            const currData = dataBaseCategory[cid][j];

            // 判空执行流程
            if (checkValue(currData)) {
                pointMap = {
                    ...pointMap,
                    [sid]: [...(pointMap?.[sid] ?? []), { point: null, base: null, set: null }],
                };
                return subPrev;
            }

            // 读取数据
            const itemValue = Number(currData ?? 0);
            const itemPercent = perBaseCategory[cid][j];
            const { min: seriesMin, max: seriesMax } = ultraBaseSeries[sid];

            // 获取高度 及 点位
            // todo pixelRatioValue 值非法
            const itemHeight =
                (analysis_type === 'percent' ? itemPercent : itemValue) * pixelRatioValue;
            const basePoint = position;
            const targetPoint = [basePoint[0], basePoint[1] + -itemHeight];

            // pointSet 内容组
            const pointSet = new Group({ name: `pointSet  ${j}_${i}`, position: targetPoint });

            // 写入集合
            pointMap = {
                ...pointMap,
                [sid]: [
                    ...(pointMap?.[sid] ?? []),
                    { point: targetPoint, base: basePoint, set: pointSet },
                ],
            };

            // 绘制 端点
            const EndPointSet = renderEndPoint(configData)({
                name: `EndPoint ${j}_${i}`,
                maxSize: maxWidth * 0.2,
                isMin: itemValue === seriesMin,
                isMax: itemValue === seriesMax,
            });
            pointSet.add(EndPointSet);

            const { width: EndPoint_Width, height: EndPoint_Height } =
                EndPointSet.getBoundingRect();

            // 绘制 数据盒子
            const DataBoxSet = renderDataBox(configData)({
                name: `DataBox ${j}_${i}`,
                dataText: DataBox_Format === 'percent' ? `${itemPercent}%` : itemValue,
                isMin: itemValue === seriesMin,
                isMax: itemValue === seriesMax,
            });
            pointSet.add(DataBoxSet);

            const { width: DataBox_Width, height: DataBox_Height } = DataBoxSet.getBoundingRect();

            // 数据盒子位置
            const halfEndPoint = EndPoint_Height / 2;
            const halfDataBox = DataBox_Height / 2;
            const DataBoxOffsetY =
                DataBox_PositionType === 'top'
                    ? halfEndPoint + (14 * halfDataBox) / 10
                    : DataBox_PositionType === 'bottom'
                    ? -halfEndPoint - (14 * halfDataBox) / 10
                    : 0;

            DataBoxSet.attr('position', [0, -DataBoxOffsetY]);

            // 间隔动画
            const T = 1.2 / (pArr.length + 6);
            const t = 8.4 / (pArr.length + 6);
            if (open_animation === true) {
                if (isGrow) {
                    scaleAnimation(pointSet, 300, 300 * i);
                } else {
                    scaleAnimation(pointSet, 400 * t, 800 * T * i);
                }
            }

            return subPrev.add(pointSet);
        }, prev);

        return prev;
    }, chartGroup);

    // 渲染折线
    seriesList.reduce((prev, { sid }, sIndex) => {
        // 系列数据
        const pointArr = pointMap[sid];

        // 基础配置
        const baseZ2 = sIndex * 10;
        const majorColor = Major_ColorList[sIndex % Major_ColorList.length];

        // 折线信息
        const PointsArr = separateArr(
            pointArr.map(({ point, base }) => ({ vertex: point, base })),
            ({ point, base }) => point === null || base === null,
        );

        // 绘制折线
        PointsArr.reduce(
            (subPrev, curr) =>
                subPrev.add(
                    new renderLineArea({
                        subZ: baseZ2,
                        configData,
                        majorColor,
                        pointsArr: curr,
                        zeroLine: zeroLine,
                        lineWidthLimit: maxWidth * 0.1,
                        origin: [1, baseY + contentHeight],
                    }),
                ),
            prev,
        );

        return prev;
    }, chartGroup);

    return Graphics;
}

function separateArr(array, filter) {
    let arrSet = [];
    (function sArr(arr) {
        const checkBit = arr.findIndex(filter);
        if (checkBit === -1) return arrSet.push(arr);
        if (checkBit === 0) return sArr(arr.slice(checkBit + 1));
        arrSet.push(arr.slice(0, checkBit));
        return sArr(arr.slice(checkBit + 1));
    })(array);
    return arrSet;
}

function scaleAnimation(sub, duration = 400, delay = 0) {
    sub.attr('scale', [0, 0]).animate('scale').delay(delay).when(duration, [1, 1]).start();
    return sub;
}

export default Line;
