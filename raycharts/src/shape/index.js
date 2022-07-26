/*
 * Description:
 * Author: vicky
 * Date: 2020-11-09 17:01:32
 * LastEditTime: 2021-10-29 14:12:44
 * FilePath: \packages\raycharts\src\shape\index.js
 */
import * as zrender from 'zrender';

// 继承
const {
    Rect,
    Group,
    Text,
    Polygon,
    Arc,
    Polyline,
    Sector,
    Ellipse,
    Line,
    Isogon,
    Circle,
    Trochoid,
    BezierCurve,
    Droplet,
    CompoundPath,
    Path,
} = zrender;
import Image from './Image';

// 新图形
import CurvePolyline from './CurvePolyline'; // 平滑折线
import CurvePolygon from './CurvePolygon'; // 平滑多边形
import BrokenLine from './brokenLine'; // 折线图折线
import LineArea from './LineArea'; // 折线图面积
import Trapezoid from './Trapezoid'; // 梯形
import LiquidFill from './liquidFill'; // 梯形

export {
    Rect,
    Group,
    Text,
    Polygon,
    Arc,
    Polyline,
    Sector,
    Ellipse,
    Image,
    Line,
    Isogon,
    Circle,
    Trochoid,
    Trapezoid,
    BrokenLine,
    LineArea,
    CurvePolyline,
    CurvePolygon,
    BezierCurve,
    Droplet,
    LiquidFill,
    CompoundPath,
    Path,
};
