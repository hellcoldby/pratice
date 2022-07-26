import * as zrender from 'zrender';
import { Rect, Group } from '../shape';

import { dataPreCheck, dataPretreat } from '../data';

import switchGraphic from '../charts/switchGraphic';
import renderTitleBox from '../components/titleBox';
import renderUnitBox from '../components/unitBox';
import renderLegendBox from '../components/legendBox';

function boundingRect(sub) {
    return sub instanceof zrender.Group && (sub?._clipPath ?? sub);
}

export default function mainLayout(BoundingBox, config) {
    const { width, height } = BoundingBox;
    const { configData, chartData: _chartData, addHoverAction, zoom } = config;

    const MainGroup = new Group({ name: `MainGroup` });

    if (!dataPreCheck(_chartData)) return MainGroup;

    const chartData = dataPretreat(_chartData);

    // 标题
    const TitleBox = renderTitleBox(configData)({
        maxWidth: width,
        maxHeight: height,
        text: chartData.title,
    }).attr({
        position: [0, 0],
    });
    const { width: TitleBox_Width, height: TitleBox_Height } =
        boundingRect(TitleBox).getBoundingRect();
    MainGroup.add(TitleBox);

    // 单位
    const UnitBox = renderUnitBox(configData)({
        maxWidth: width,
        maxHeight: height,
        text: chartData.unit,
    }).attr({
        position: [0, TitleBox_Height],
    });
    const { width: UnitBox_Width, height: UnitBox_Height } =
        boundingRect(UnitBox).getBoundingRect();
    MainGroup.add(UnitBox);

    // 图例
    const LegendBox = renderLegendBox(configData)({
        zoom,
        maxWidth: width,
        maxHeight: height - TitleBox_Height - UnitBox_Height,
        seriesList: chartData?.seriesList,
    });
    const { width: LegendBox_Width, height: LegendBox_Height } =
        boundingRect(LegendBox).getBoundingRect();

    // 图例 位置
    const Legend_Position = configData.legend.position;
    let Legend_X = 0;
    let Legend_Y = TitleBox_Height + UnitBox_Height;
    // 图例 位置 左 中 右
    if (/l/.test(Legend_Position)) {
        Legend_X = 0;
    } else if (/c/.test(Legend_Position)) {
        Legend_X = (width - LegendBox_Width) / 2;
    } else if (/r/.test(Legend_Position)) {
        Legend_X = width - LegendBox_Width;
    }
    // 图例 位置 上 中 下
    if (/t/.test(Legend_Position)) {
        Legend_Y = TitleBox_Height + UnitBox_Height;
    } else if (/m/.test(Legend_Position)) {
        Legend_Y = -LegendBox_Height / 2 + (height + TitleBox_Height + UnitBox_Height) / 2;
    } else if (/b/.test(Legend_Position)) {
        Legend_Y = height - LegendBox_Height;
    }
    // 字段接入内层位置，外层不变动 （有字段后开放）
    if (/t|b/.test(Legend_Position)) Legend_X = 0;

    MainGroup.add(LegendBox.attr({ position: [Legend_X, Legend_Y] }));

    // 绘图区域
    let Graphic_Width = width;
    let Graphic_Height = height - TitleBox_Height - UnitBox_Height;
    if (/t|b/.test(Legend_Position)) {
        Graphic_Height = Graphic_Height - LegendBox_Height;
    } else if (/m/.test(Legend_Position)) {
        Graphic_Width = Graphic_Width - LegendBox_Width;
    }
    let Graphic_X = 0;
    let Graphic_Y = TitleBox_Height + UnitBox_Height;
    if (/t/.test(Legend_Position)) {
        Graphic_Y = Graphic_Y + LegendBox_Height;
    } else if (/m/.test(Legend_Position)) {
        if (/l/.test(Legend_Position)) {
            Graphic_X = Graphic_X + LegendBox_Width;
        } else if (/r/.test(Legend_Position)) {
        }
    } else if (/b/.test(Legend_Position)) {
    }
    // 获取绘图方法
    const graphic = switchGraphic(configData?._type ?? null);

    const graphicConfig = {
        zoom,
        // DEPRECATED
        maxWidth: Graphic_Width,
        maxHeight: Graphic_Height,
        chartData,
        configData,
        addHoverAction,
    };

    const Graphic = graphic(graphicConfig).attr({ position: [Graphic_X, Graphic_Y] });

    // // 绘图区域裁剪
    // const graphicBox = new Rect({
    //     shape: {
    //         width: Graphic_Width,
    //         height: Graphic_Height,
    //     },
    // });
    // Graphic.setClipPath(graphicBox);

    MainGroup.add(Graphic);

    // ------ dev ------- 背景板 确认是否超出区域
    // console.log(graphicConfig);
    // ------ dev ------- 背景板 确认是否超出区域

    return MainGroup;
}
