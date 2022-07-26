import * as zrender from 'zrender';
import { Group, Rect } from '../../shape';
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

function Bar(config) {
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
        // -------------------------- DEPRECATED --------------------------
        position: DataBox_PositionType, // 气泡的位置（上， 中， 下）
        // -------------------------- DEPRECATED --------------------------
        total_position: DataBox_Reference, // 位置计算总值：shape图形 / slot卡槽
        baseline: DataBox_Baseline, // 数据基线位置,属性值为：start（起点）、center（中心），end（终点）
        align: DataBox_Align, // 内部对齐位置：start（起点）、center（中心），end（终点）
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
    const _direction = configData._type === 'h_bar' ? 'horizontal' : 'vertical';
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
    const totalWidth = (categoryMaxWeight * Bar_WidthPercent) / 100;
    const itemGapWidth =
        seriesList.length <= 1
            ? 0
            : (totalWidth * Bar_GapPercent) / (100 * (seriesList.length - 1));
    const itemWidth =
        seriesList.length <= 1
            ? totalWidth / seriesList.length || 1
            : (totalWidth * (100 - Bar_GapPercent)) / (100 * seriesList.length) || 1;
    const MarkWidthBase =
        categoryMaxWeight *
        (seriesList.length === 1 ? 1 : (1 - Bar_GapPercent / 100) / seriesList.length);

    // ------------------ 图形数据预处理 ------------------
    const nonPositiveFlag = seriesList
        .flatMap(({ sid }) => dataBaseSeries[sid])
        .every((i) => i <= 0);

    // ------------------ 图形裁切处理 ----------------
    if (customAxis === true) {
        chartGroup.setClipPath(
            new Rect({ shape: { x: baseX, y: baseY, width: contentWidth, height: contentHeight } }),
        );
    }

    // 遍历数据绘制元素
    positionList.reduce((prev, { position: [baseX, baseY], cid }, i) => {
        const CategorySet = new Group({
            name: `category ${i}`,
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

        // 基于系列 位置计算
        seriesList.reduce((prev, { sid, name }, j, seriesArr) => {
            // 获取当前数据值
            const itemData = dataBaseCategory[cid][j];

            // 判空 如果数据不存在，或者数据不为数字，不进行渲染
            if (itemData === null || !isNumber(itemData)) return prev;

            // 计算每一个列 相对中心位置的偏移量
            const currOffset = (itemWidth + itemGapWidth) * j + itemWidth / 2 - totalWidth / 2;
            // 根据旋转角度 确定偏移方向
            const [_itemX, _itemY] =
                growDirection % 180 === 0
                    ? [currOffset, 0]
                    : growDirection % 180 === 90
                    ? [0, currOffset]
                    : [];

            // seriesLine 类别中的单独系列组
            const seriesLine = new Group({
                name: `seriesLine ${i}_${j}`,
                position: [_itemX, _itemY],
                rotation: rotationAngle,
            });

            // 槽位 slot
            const SlotSet = renderSlot(configData)({
                name: `${i}_${j}`,
                maxSize: [MarkWidthBase, valueMaxHeight],
                offsetY: [slotOffset],
                offsetR: growDirection,
            });
            seriesLine.add(SlotSet);

            // seriesLineInner 内容 组
            const seriesLineInner = new Group({
                name: `seriesLineInner ${i}_${j}`,
            });

            // 数据处理
            const currValue = Number(itemData ?? 0);
            const currPercent = perBaseCategory[cid][j];

            const currHeight =
                Math.abs(analysis_type === 'percent' ? currPercent : currValue) * pixelRatioValue;
            const { min: seriesMin, max: seriesMax } = ultraBaseSeries[sid];

            // 柱状图方向
            const currDirection = currValue > 0 ? 1 : currValue < 0 ? -1 : nonPositiveFlag ? -1 : 1;

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
                size: [itemWidth, currHeight],
                offsetR: growDirection,
                majorColor,
            });
            seriesLineInner.add(BarEffectSet);

            // todo 坐标轴返回的 比值 非法数据，传入的 currHeight 为 NaN
            // 绘制 端点
            const EndPointSet = renderEndPoint(configData)({
                name: `${i}_${j}`,
                maxSize: MarkWidthBase,
                isMin: currValue === seriesMin,
                isMax: currValue === seriesMax,
            }).attr({
                position: [0, currHeight],
                rotation: -rotationAngle,
            });
            seriesLineInner.add(EndPointSet);
            // const { width: EndPoint_Width, height: EndPoint_Height } = EndPointSet.getBoundingRect();

            // 当所有值都小于零时对0进行反转 || 对于值小于零的数据进行反转
            // 仅限图形组反转
            (nonPositiveFlag || currValue < 0) && seriesLineInner.attr({ scaleY: -1 });

            // 绘制 标签 标签不属于内容组
            const DataBoxSet = renderDataBox(configData)({
                name: `${i}_${j}`,
                dataText: DataBox_Format === 'percent' ? `${currPercent}%` : currValue,
                isMin: currValue === seriesMin,
                isMax: currValue === seriesMax,
            }).attr({ rotation: -rotationAngle });
            seriesLine.add(DataBoxSet);
            const { width: DataBox_Width, height: DataBox_Height } = DataBoxSet.getBoundingRect();

            // 节点半高（处理了水平和垂直的差异)
            // const halfEndPoint =
            //     growDirection % 180 === 90
            //         ? EndPoint_Width * 0.5
            //         : growDirection % 180 === 0
            //         ? EndPoint_Height * 0.5
            //         : 0;
            const halfDataBox =
                growDirection % 180 === 90
                    ? DataBox_Width * 0.5
                    : growDirection % 180 === 0
                    ? DataBox_Height * 0.5
                    : 0;

            // curr 槽位高
            const slotHeight = currDirection < 0 ? valueMaxHeight - slotOffset : slotOffset;

            // 确定基线位置
            const getBaseOff = (box, base) => {
                const sum = box === 'shape' ? currHeight : box === 'slot' ? slotHeight : 0;
                const baseOff =
                    base === 'start' ? 0 : base === 'center' ? sum * 0.5 : base === 'end' ? sum : 0;
                return baseOff;
            };

            const getBoxOff = (align, halfSize) => {
                const boxOff =
                    align === 'start'
                        ? -halfSize
                        : align === 'center'
                        ? 0
                        : align === 'end'
                        ? halfSize
                        : 0;
                return boxOff;
            };

            const baseOff = getBaseOff(DataBox_Reference, DataBox_Baseline);
            const boxOff = getBoxOff(DataBox_Align, halfDataBox);

            // -------------------------- DEPRECATED --------------------------
            // const DataBoxOffsetY =
            //     DataBox_PositionType === 'top'
            //         ? currHeight + halfEndPoint + (14 * halfDataBox) / 10
            //         : DataBox_PositionType === 'middle'
            //         ? currHeight / 2
            //         : DataBox_PositionType === 'bottom'
            //         ? halfDataBox
            //         : 0;
            // -------------------------- DEPRECATED --------------------------

            if (nonPositiveFlag || currValue < 0) {
                DataBoxSet.attr('position', [0, -(baseOff + boxOff)]);
            } else {
                DataBoxSet.attr('position', [0, baseOff + boxOff]);
            }

            // 添加 seriesLineInner 到 seriesLine
            return prev.add(seriesLine.add(seriesLineInner));
        }, CategorySet);
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
            // 根据 ChildName 进行匹配
            const ChildName = child?.name ?? '';
            // 获取 类别序号和分类序号
            const [CategoryCount, SeriesCount] = ChildName.match(/\d+_\d+/)?.[0].split('_') ?? [
                1, 1,
            ];
            // 计算 柱状图 动画时长 动画间隔
            const CategoryLength = categoryList.length;
            const BarGapTime = (1000 * 1.2) / (CategoryLength + 6);
            const BarRunTime = (1000 * 8.4) / (CategoryLength + 6);

            // basic;
            if (/bar main/.test(ChildName)) {
                const delay = 400 + BarGapTime * CategoryCount;
                const end = BarRunTime;
                // test
                entryAnimator(
                    child,
                    {
                        grow(sub) {
                            const height = sub.shape.height;
                            sub.attr({
                                shape: { height: 0 },
                            });
                            return { shape: { height } };
                        },
                        unfold(sub) {
                            const { x, width } = sub.shape;
                            sub.attr({
                                shape: { x: 0, width: 0 },
                            });
                            return { shape: { x, width } };
                        },
                        fadeIn(sub) {
                            const opacity = sub.style?.opacity ?? 1;
                            sub.attr({
                                style: { opacity: 0 },
                            });
                            return { style: { opacity: 1 } };
                        },
                    },
                    {
                        target: 'shape',
                        animatorList: entryAnimatorList,
                        animatorType: 'backOut',
                        duration: end,
                        delay,
                    },
                );
            } else {
                // 动画调整需要注意不要在一个动画进行中 添加另外一个动画，会导致图形没有移动到预期形状执行另外的动画
                // 尤其是两个动画得时候
                child
                    .attr('style', {
                        opacity: 0,
                    })
                    .animate('style')
                    .delay(400 + BarRunTime + BarGapTime * CategoryCount)
                    .when(BarRunTime, { opacity: 1 })
                    .start();
            }
            return child;
        };
    if (open_animation === true) chartGroup.eachChild(addAnimate());

    return Graphics;
}

export default Bar;
