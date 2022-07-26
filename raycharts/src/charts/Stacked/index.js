import * as zrender from 'zrender';
import { Group, Rect } from '../../shape';
import { G_NAME, G_INDEX } from '../../utils/common';
import { base } from '../../utils';
const { isNumber } = base;

// 引入动画
import { entryAnimator } from '../../animation';
// 引入坐标系
import renderCoordinate from '../../guide/coordinate';
// 引入图形绘制
import renderSlot from '../../components/slotBar';
import renderBar from '../../components/singleBar';
import renderEndPoint from '../../components/endPoint';
import renderDataBox from '../../components/dataBox';
import renderCategoryBox from '../../components/categoryBox';

function Stacked(config) {
    const { configData, chartData, addHoverAction, maxWidth, maxHeight } = config;

    // 整体组
    const Graphics = new Group({ name: `${configData?.type ?? ''} Group` });

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
        type: analysis_type, // 属性值：normal（正常，默认），percent(百分比)
    } = configData.analysis;
    const {
        graph_width: Bar_WidthPercent, // 柱子的宽度
        space: Bar_GapPercent, // 柱子的缝隙
        highlight_min: Bar_LightMin, // 柱子最小值是否高亮提示
    } = configData.general;
    const {
        show: DataBox_Filter, // 显示方式（全部，最大等）
        type: DataBox_Format, // 显示的数值格式(数字 百分比)
        position: DataBox_PositionType, // 气泡的位置（上， 中， 下）
    } = configData.data;
    const customAxis = configData.guide.draw_coor.scale.range.open;
    const {
        colors: Major_ColorList, // 柱子的颜色列表
        max: Bar_MaxColor, // 最大值柱子颜色
        min: Bar_MinColor, // 最小值柱子颜色
    } = configData.default_theme.graph;
    const {
        open: open_animation, // 动画开启或者关闭，默认开启true
    } = configData.animation;
    const _mirror_axes = configData?._mirror_axes ?? false; // 镜像坐标轴预处理
    const entryAnimatorList = configData.animation.entry; // 入场动画

    // ------------------ 坐标轴值预处理 ------------------
    const _direction = configData._type === 'h_stacked' ? 'horizontal' : 'vertical';
    // 渲染方向 x y 轴是否交换 direction
    const growDirection =
        _direction === 'vertical'
            ? 180
            : _direction === 'horizontal'
            ? _mirror_axes === false
                ? 90
                : 270
            : 0; // 90 , 180 , 270 , 360
    const rotationAngle = (growDirection / 360) * Math.PI * 2;

    // ------------------ 图形大小计算 ------------------
    // 获取 柱子宽度 柱子间隔
    const barWidth = (categoryMaxWeight * Bar_WidthPercent) / 100;
    const gapLimit =
        _direction === 'vertical' ? maxHeight : _direction === 'horizontal' ? maxWidth : maxHeight;
    const barGapSize = (gapLimit * Bar_GapPercent) / 5000;
    const ratioWithGap = (valueArr) => {
        const vSum = valueArr.reduce((prev, curr) => prev + Math.abs(Number(curr ?? 0)), 0);
        const gNum = valueArr.length <= 1 ? 0 : valueArr.length - 1;
        return pixelRatioValue - (gNum * barGapSize) / vSum;
    };

    // ------------------ 图形数据预处理 ------------------
    const checkValue = (itemData) => itemData === null || !isNumber(itemData);

    // ------------------ 图形裁切处理 ----------------
    if (customAxis === true) {
        chartGroup.setClipPath(
            new Rect({ shape: { x: baseX, y: baseY, width: contentWidth, height: contentHeight } }),
        );
    }
    // 遍历数据绘制元素
    positionList.reduce((prev, { position: [baseX, baseY], cid }, i) => {
        const CategorySet = new Group({
            name: `CategorySet ${i}`,
            position: [baseX, baseY],
        }).add(
            // 绘制 类别轴占位图层
            renderCategoryBox({
                name: `${i}`,
                maxSize: [categoryMaxWeight, valueMaxHeight],
                offsetY: [slotOffset],
            }).attr({
                rotation: rotationAngle,
            }),
        );
        addHoverAction(CategorySet, { cid });

        // 有效数据获取 计算 newPixelRatio
        const validArr = (
            analysis_type === 'percent' ? perBaseCategory[cid] : dataBaseCategory[cid]
        ).filter((i) => !checkValue(i));
        const positiveRatio = ratioWithGap(validArr.filter((i) => i >= 0));
        const negativeRatio = ratioWithGap(validArr.filter((i) => i < 0));

        // 基于系列 位置计算
        seriesList.reduce(
            // eslint-disable-next-line complexity
            (subPrev, { sid, name }, j, seriesArr) => {
                // 解析 subPrev
                const { initSet: prevGroup, upOffset, downOffset } = subPrev;

                // 获取当前数据值
                const itemData = dataBaseCategory[cid][j];

                // 判空 如果数据不存在，或者数据不为数字，不进行渲染
                if (checkValue(itemData)) return subPrev;

                // stackedSet 内容组
                const stackedSet = new Group({
                    name: `stackedSet ${i}_${j}`,
                    rotation: rotationAngle,
                });

                // 槽位 slot
                // todo slotOffset 返回值不对
                const slotSet = renderSlot(configData)({
                    name: `${i}_${j}`,
                    maxSize: [categoryMaxWeight, valueMaxHeight],
                    offsetY: [slotOffset],
                    offsetR: growDirection,
                });

                // 添加 slotSet 到 stackedSet
                stackedSet.add(slotSet);

                // 数据处理
                const currValue = Number(itemData ?? 0);
                const currPercent = perBaseCategory[cid][j];
                const targetData = analysis_type === 'percent' ? currPercent : currValue;

                const { min: seriesMin, max: seriesMax } = ultraBaseSeries[sid];

                // 确定当前组的偏移高度
                const currOffset = targetData >= 0 ? upOffset : downOffset;

                // 确定当前柱子高度
                const currHeight =
                    Math.abs(targetData) * (targetData >= 0 ? positiveRatio : negativeRatio);

                // signalBarSet 内容组
                const signalBarSet = new Group({
                    name: `signalBarSet ${i}_${j}`,
                    position: [0, currOffset],
                    origin: [0, -currOffset],
                });

                // 默认颜色
                let majorColor = Major_ColorList[j % Major_ColorList.length];

                // 单系列: 最大值颜色  最小值颜色（暂时取消）
                if (seriesArr.length === 1) {
                    majorColor =
                        Bar_LightMin === true && currValue === seriesMin
                            ? Bar_MinColor
                            : currValue === seriesMax
                            ? Bar_MaxColor
                            : majorColor;
                }

                // 绘制 柱状组
                const BarEffectSet = renderBar(configData)({
                    name: `${i}_${j}`,
                    size: [barWidth, currHeight],
                    offsetR: growDirection,
                    majorColor,
                });
                signalBarSet.add(BarEffectSet);

                // 绘制 端点
                const EndPointSet = renderEndPoint(configData)({
                    name: `${i}_${j}`,
                    maxSize: categoryMaxWeight,
                    isMin: currValue === seriesMin,
                    isMax: currValue === seriesMax,
                }).attr({
                    position: [0, currHeight],
                    rotation: -rotationAngle,
                });
                signalBarSet.add(EndPointSet);
                const { width: EndPoint_Width, height: EndPoint_Height } =
                    EndPointSet.getBoundingRect();

                // 绘制 数据盒子
                const DataBoxSet = renderDataBox(configData)({
                    name: `${i}_${j}`,
                    dataText: DataBox_Format === 'percent' ? `${currPercent}%` : currValue,
                    isMin: currValue === seriesMin,
                    isMax: currValue === seriesMax,
                }).attr({ rotation: -rotationAngle });
                stackedSet.add(DataBoxSet);
                const { width: DataBox_Width, height: DataBox_Height } =
                    DataBoxSet.getBoundingRect();

                // 计算数据节点的位置
                const halfEndPoint =
                    growDirection % 180 === 90
                        ? EndPoint_Width / 2
                        : growDirection % 180 === 0
                        ? EndPoint_Height / 2
                        : 0;
                const halfDataBox =
                    growDirection % 180 === 90
                        ? DataBox_Width / 2
                        : growDirection % 180 === 0
                        ? DataBox_Height / 2
                        : 0;

                const DataBoxOffsetY =
                    // DataBox_PositionType === 'top'
                    //     ? Math.abs(currHeight) + halfEndPoint + (14 * halfDataBox) / 10
                    //     :
                    DataBox_PositionType === 'top' // 'upper'
                        ? currHeight - halfDataBox
                        : DataBox_PositionType === 'middle'
                        ? currHeight / 2
                        : DataBox_PositionType === 'bottom'
                        ? halfDataBox
                        : 0;
                DataBoxSet.attr({
                    y:
                        currValue === 0
                            ? 0
                            : targetData > 0
                            ? upOffset + DataBoxOffsetY
                            : -(downOffset + DataBoxOffsetY),
                });

                // 对于值小于零的数据进行反转
                if (targetData < 0) signalBarSet.attr({ scale: [1, -1] });

                // 添加 signalBarSet 到 stackedSet
                stackedSet.add(signalBarSet);

                return {
                    initSet: prevGroup.add(stackedSet),
                    upOffset: targetData >= 0 ? currOffset + currHeight + barGapSize : upOffset,
                    downOffset: targetData >= 0 ? downOffset : currOffset + currHeight + barGapSize,
                };
            },
            { initSet: CategorySet, upOffset: 0, downOffset: 0 },
        );
        return prev.add(CategorySet);
    }, chartGroup);

    // Animate
    const addAnimate =
        (_keyPath = '') =>
        (child, i) => {
            const keyPath = _keyPath ? `${_keyPath}_${i}` : `${i}`;
            if (child instanceof zrender.Group) {
                return child.eachChild(addAnimate(keyPath));
            }
            // 根据 ChildName 不同进行不同的样式变化
            const ChildName = child?.name ?? '';

            // slot basic;
            if (/bar main/.test(ChildName)) {
                const EndValue = child.shape.height;
                child
                    .attr('shape', {
                        height: 0,
                    })
                    .animate('shape')
                    .delay(400)
                    .when(400, { height: EndValue })
                    .start();
            } else {
                // 动画调整需要注意不要在一个动画进行中 添加另外一个动画，会导致图形没有移动到预期形状执行另外的动画
                // 尤其是两个动画得时候
                child
                    .attr('style', {
                        opacity: 0,
                    })
                    .animate('style')
                    .delay(400 + 400)
                    .when(400, { opacity: 1 })
                    .start();
            }
            child.attr('cursor', 'default');
            return child;
        };
    if (open_animation === true) chartGroup.eachChild(addAnimate());

    return Graphics;
}

export default Stacked;
