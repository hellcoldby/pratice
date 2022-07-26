/*
 * @Description:
 * @Author: ygp
 * @Date: 2021-01-04 14:23:13
 * LastEditors: Please set LastEditors
 * LastEditTime: 2021-10-28 14:36:22
 */
import { Rect } from '../shape';
import Bar from './Bar'; // 柱形图
import Stacked from './Stacked'; // 堆叠图
import Radar from './Radar'; // 雷达图
import Line from './Line'; // 折线图
import LineStacked from './LineStacked'; // 折线图
import Pie from './Pie'; // 环图
import Polycyclic from './Polycyclic'; // 多环图
import Gauge from './Gauge'; // 仪表盘
import Funnel from './Funnel'; // 漏斗图
import Jade from './Jade'; // 玉玦图
import WordCloud from './WordCloud'; // 词云图
import LiquidFill from './LiquidFill'; // 水波图
import Scatter from './Scatter'; // 散点图
import Boxplot from './Boxplot'; // 盒须图
import Rose from './Rose'; // 玫瑰图
import River from './River'; // 河流图
import Histogram from './Histogram'; // 直方图

// for Dev
import Test from './Test';

export default function switchGraphic(_type) {
    switch (_type) {
        case 'h_bar':
            return Bar;
        case 'v_bar':
            return Bar;
        case 'h_stacked':
            return Stacked;
        case 'v_stacked':
            return Stacked;
        case 'radar':
            return Radar;
        case 'line':
            return Line;
        case 'line_stacked':
            return LineStacked;
        case 'pie':
            return Pie;
        case 'jade':
            return Jade;
        case 'multi_pie':
            return Polycyclic;
        case 'test':
            return Test;
        case 'gauge':
            return Gauge;
        case 'funnel':
            return Funnel;
        case 'wordCloud':
            return WordCloud;
        case 'liquidFill':
            return LiquidFill;
        case 'scatter':
            return Scatter;
        case 'boxplot':
            return Boxplot;
        case 'rose':
            return Rose;
        case 'river':
            return River;
        case 'histogram':
            return Histogram;
        default:
            return ({ maxWidth, maxHeight }) =>
                new Rect({
                    shape: { width: maxWidth, height: maxHeight },
                    style: { fill: 'transparent' },
                });
    }
}
