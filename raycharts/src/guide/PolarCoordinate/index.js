/*
 * Description:极坐标系
 * Author: vicky
 * Date: 2020-11-10 17:13:28
 * LastEditTime: 2020-12-17 14:07:15
 * FilePath: \packages\raycharts\src\guide\PolarCoordinate\index.js
 */
import { getColumns } from '../../charts/public/polygon';
import { dashArray } from '../../utils/tool';
import { color } from '../../utils/color';
import { Polygon, Circle, Line, Group } from '../../shape';
import { G_NAME, G_INDEX } from '../../utils/common';
import { drawCoorLabel } from './label';

export default function renderPolarCoor(params) {
    const {
        configData: {
            guide: {
                grid: { polygon, circle },
            },
            default_theme: { guide: guideColor },
        },
    } = params;
    //获取网格颜色
    let gridColorP = color(guideColor.grid.polygon);
    let gridColorC = color(guideColor.grid.circle);
    //获取网格数据
    const colData = getColumns(params);
    const points = colData.points;
    let pCoorGroup = new Group({ name: G_NAME.grid });
    //绘制网格
    if (polygon.visible) {
        drawGrid(
            pCoorGroup,
            { points, lineWidth: polygon.line_width, lineType: polygon.line_type, gridColor: gridColorP },
            'polygon',
        );
    }
    if (circle.visible) {
        drawGrid(
            pCoorGroup,
            { points, lineWidth: circle.line_width, lineType: circle.line_type, gridColor: gridColorC },
            'circle',
        );
    }
    const labelGroup = drawCoorLabel(params);
    labelGroup.forEach((e) => {
        pCoorGroup.add(e);
    });
    return pCoorGroup;
}

/**
 * @method drawGrid 绘制网格线
 * @param {*} pCoorGroup 坐标组
 * @param {*} params 网格参数
 * @param {*} type 网格线类型
 */
function drawGrid(pCoorGroup, params, type) {
    const { points, lineWidth, lineType, gridColor } = params;
    for (let i = 0; i < points.length; i++) {
        let gridItem = points[i];
        const style = {
            fill: null,
            stroke: gridColor,
            lineWidth: lineWidth,
            lineDash: lineType === 'solid' ? null : dashArray,
            opacity: 1,
        };
        let drawFun = type === 'circle' ? Circle : Polygon;
        let shape =
            type === 'circle'
                ? {
                      cx: gridItem.centerX,
                      cy: gridItem.centerY,
                      r: gridItem.radius,
                  }
                : { points: gridItem.points };
        const grid = new drawFun({
            name: 'grid',
            z: G_INDEX.base,
            shape,
            style,
        });
        pCoorGroup.add(grid);
        //绘制连线
        if (i === points.length - 1) {
            drawLine(pCoorGroup, {
                outPoints: gridItem,
                gridColor,
                lineWidth,
                lineType,
            });
        }
    }
}

/**
 * @method drawLine
 * @description 绘制雷达图直线
 * @param {*} group 组
 * @param {*} params
 */
function drawLine(group, params) {
    const { outPoints, gridColor, lineWidth, lineType } = params;

    outPoints.info.forEach((item) => {
        let line = new Line({
            name: 'grid',
            z: G_INDEX.base,
            shape: {
                x1: outPoints.centerX,
                y1: outPoints.centerY,
                x2: item.x,
                y2: item.y,
                percent: 1,
            },
            style: {
                fill: null,
                stroke: gridColor,
                lineDash: lineType === 'solid' ? null : dashArray,
                lineWidth: lineWidth,
                opacity: 1,
            },
        });
        group.add(line);
    });
}
