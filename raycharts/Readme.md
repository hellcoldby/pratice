# RayCharts

## 安装

```shell
yarn add raycharts
```

## 简介

图表组件库

## 使用说明

```js
// 引入图形库
import RayCharts from 'raycharts';

/**
 * 图表 默认config值 获取方法
 * @param {_type} type 图表类型
 * @return {config} 对应config
 */
const getTypeConfig = RayCharts.getTypeConfig;

<RayCharts width={width} height={height} configData={configData} chartData={chartData} />;
```

## 属性

| 属性名     |     说明     | 数据类型 | 默认值 |
| :--------- | :----------: | :------: | :----: |
| width      |   图表宽度   | `Number` |  400   |
| height     |   图表高度   | `Number` |  250   |
| configData | 图表属性配置 | `Object` |   ——   |
| chartData  |   图表数据   | `Object` |   ——   |

## configData 属性值、属性默认值、说明

```js
{
    _type: 'v_bar' /* 图表类型 */,
    analysis: {
        type: 'normal', // 属性值：normal（正常，默认），percent(百分比)
        sort: 'normal', //属性值：normal（正常，默认），maxToMin(从大到小)，minToMax（从小到大）
    },
    assistant: {
        //辅助分析
        auxiliary: {
            //辅助线
            xline: {
                //横向
                show: false, //开启
                data: 60, //画线值
                line_width: 1, //线宽
                line_type: 'solid', //线类型
            },
            yline: {
                //纵向
                show: false, //开启
                data: 60, //画线值
                line_width: 1, //线宽
                line_type: 'solid', //线类型
            },
        },
    },
    general: {
        graph_width: 20, // 图表boundingBox边界的宽度
        space: 10, // 间隔
        light: {
            // 发光
            opacity: 100, // 透明度默认100 0~100
            extent: 0, // 默认50，显示范围百分比
        },
        font: {
            //词云文字
            font_family: '微软雅黑',
            font_weight: '400',
            size_range: [12, 36], // 词云字体大小范围
        },
        wavelength: 50, //波长
        amplitude: 10, //振幅
        inverse: false, //图形反向显示
        size_range: [10, 10], //图形大小区间
        rotate_range: [-90, 90], // 单词旋转范围
        rotate_ratio: 50, //单词旋转概率
        shape_type: 'shape', //词云形状shape,image两种类型
        shape: 'circle', //词云图形,圆形circle,正方形square, 三角形triangle,菱形diamond,星形star
        image: '',
        inset: { h: 0, v: 0, blur: 0 }, // 字段释义：h（水平阴影位置）、v（垂直阴影位置）、blur(模糊)
        outset: { h: 0, v: 0, blur: 0 },
        texture: '', //纹理
        smooth: false, // 平滑曲线开关，默认关闭
        area: {
            visible: false, // 面积显隐，默认关闭
            opacity: 30, // 面积透明度（0~100）
        },
        border: {
            line_type: 'solid', // 属性值：solid（实线，默认）、dashed（虚线）
            radius: { tleft: 0, tright: 0, bright: 0, bleft: 0 }, // 字段释义：tleft:top_left、tright:top_right、bright:bottom_right、bleft:bottom_left
            corner_type: 'round', // 属性值：round（默认，圆角），line（直角）
            line_width: 0,
            dash_array: [5, 5], //虚线数组
        },
        point: {
            image: '', // 填充图片
            shape: 'circle', // 属性值：默认‘circle’，可选diamond 菱形  rectangle矩形  triangle三角形
            visible: false, // 显隐，默认关闭
            width: 10, //端点宽
            height: 10, //端点高
            show: 'all', // 属性值：all（全显示，默认）、max(最大值)、min（最小值），ex（最大值+最小值）
            border: {
                line_type: 'solid',
                line_width: 2,
            },
        },
        slot: {
            image: '', // 填充图片
            width: 100,
            inset: { h: 5, v: 5, blur: 4 },
            outset: { h: 5, v: 5, blur: 4 },
            border: {
                line_type: 'solid', // 属性值：solid（实线，默认）、dashed（虚线）
                radius: { tleft: 0, tright: 0, bright: 0, bleft: 0 }, // 字段释义：tleft:top_left、tright:top_right、bright:bottom_right、bleft:bottom_left
                corner_type: 'round', // 属性值：round（默认，圆角），line（直角）
                line_width: 0,
            },
        },
        r: 100, // 百分比0~100
        hole_r: 40, // 百分比0~100
        ccw: false, // false = 顺时针，true = 逆时针,默认顺时针
        g_shadow: 10, // 差值范围0~100
        line: {
            line_type: 'solid', // 属性值：solid（实线，默认）、dashed（虚线）
            line_width: 1,
            dash_array: [5, 5], //虚线数组
        },
        sharp: false, // 尖角度，默认false，boolean
        column: 3, // 默认列数，超出10个也是10个
        s_angle: 225, //起始角度
        e_angle: 315, //终点角度
        pointer: {
            visible: true, //指针显隐
            style: {
                width: 5, //指针宽百分比
                height: 100, //指针高百分比
                name: 'opt_one', //类型名称
                border: {
                    //图形描边
                    line_type: 'solid',
                    line_width: 1,
                },
            },
            image: {
                //指针填充图片
                width: 100,
                height: 100,
                src: '',
            },
        },
        //高亮最小值
        highlight_min: false,
        //高亮最大值
        highlight_max: false,
        //方向（主漏斗图尖角方向）
        direction: false, //true向上 false向下
    },
    background: {
        image: '',
        border: {
            line_type: 'solid',
            radius: { tleft: 12, tright: 12, bright: 12, bleft: 12 },
            line_width: 0,
        },
        inset: { h: 5, v: 5, blur: 4 }, // 字段释义：h（水平阴影位置）、v（垂直阴影位置）、blur(模糊)
        outset: { h: 0, v: 0, blur: 0 },
        opacity: 30,
        padding: { left: 16, top: 16, right: 16, bottom: 16 },
    },
    data: {
        visible: false, // 属性值：true(显示)，false（不显示，默认）
        font: {
            font_family: '微软雅黑',
            font_size: 14,
            font_style: 'normal', // 属性值：normal(默认，正常)、italic（斜体字体样式）
            text_decoration: 'normal', // 属性值：normal（正常，默认），underline(下划线)
            font_weight: '400',
        },
        show: 'all', // 属性值：all（全显示，默认）、max(最大值)、min（最小值），ex（最大值+最小值）
        type: 'normal', // 属性值：normal（正常，默认），percent(百分比)
        text_stroke: {
            // 文本描边
            visible: false, // 属性值：false(不显示，默认)，true（显示）
            line_width: 0,
        },
        position: 'top', // 属性值为：top（上，默认）、middle（中），bottom（下）
        total_position: 'shape', // 位置计算总值：shape图形/slot卡槽
        baseline: 'end', // 数据基线位置,属性值为：start（起点）、center（中心），end（终点）
        align: 'end', // 内部对齐位置：start（起点）、center（中心），end（终点）
        bubble: {
            visible: false, // 属性值：true(显示)，false（不显示，默认）
            shape: 'rectangle', // diamond 菱形  rectangle矩形，默认  triangle三角形 circle圆形
            border: {
                line_type: 'solid',
                radius: { tleft: 0, tright: 0, bright: 0, bleft: 0 },
                line_width: 1,
            },
            lead_wire: {
                // 引导线
                line_type: 'solid',
                line_width: 2,
            },
        },
        radial_offset: 0, // 径向偏移，-100~100，默认0
        v_offset: 0, // 垂直偏移，-100~100，默认0
        h_offset: 0, // 水平偏移，-100~100，默认0
        angle_offset: 3, //角度偏移（玉珏图）
    },
    title: {
        visible: true, // 属性值：true(显示，默认)，false（不显示）
        width: 100,
        height: 20,
        text_align: 'left', // 属性值：left(居左，默认)，center（居中）,right(居右)
        background: {
            image: '',
            border: {
                line_type: 'solid',
                radius: {
                    tleft: 0,
                    tright: 0,
                    bright: 0,
                    bleft: 0,
                },
                line_width: 2,
            },
        },
        font: {
            font_family: '微软雅黑',
            font_size: 14,
            font_style: 'normal',
            text_decoration: 'normal',
            font_weight: '400',
        },
    },
    unit: {
        visible: true, // 属性值：true(显示，默认)，false（不显示）
        width: 100,
        height: 20,
        text_align: 'left', // 属性值：left(居左，默认)，center（居中）,right(居右)
        background: {
            image: '',
            border: {
                line_type: 'solid',
                radius: {
                    tleft: 0,
                    tright: 0,
                    bright: 0,
                    bleft: 0,
                },
                line_width: 5,
            },
        },
        font: {
            font_family: '微软雅黑',
            font_size: 14,
            font_style: 'normal',
            text_decoration: 'normal',
            font_weight: '400',
        },
    },
    legend: {
        visible: true, // 属性值：true(显示，默认)，false（不显示）
        width: 100,
        height: 30,
        position: 'bc', // 属性值：上/tl(左对齐) 、tc（居中）、tr(右对齐)，中/ml(左侧)、mc(居中)、mr（右侧），下/bl(左对齐)、bc（居中）、br(右对齐)
        shape: 'circle', // circle圆形，默认 diamond 菱形  rectangle矩形  triangle三角形
        shapeSize: {
            //图形大小
            width: 10,
            height: 10,
        },
        border: {
            line_type: 'solid',
            radius: { tleft: 0, tright: 0, bright: 0, bleft: 0 },
            line_width: 0,
        },
        font: {
            font_family: '微软雅黑',
            font_size: 14,
            font_style: 'normal',
            text_decoration: 'normal',
            font_weight: '400',
        },
    },
    guide: {
        draw_coor: {
            text_visible: true,
            font: {
                font_family: '微软雅黑',
                font_size: 14,
                font_style: 'normal',
                text_decoration: 'normal',
                font_weight: '400',
            },
            v_offset: 0, // 垂直偏移，-100~100，默认0
            h_offset: 0, // 水平偏移，-100~100，默认0
            scale: {
                range: {
                    open: false, // 开关默认关
                    max: 100, //量程最大值
                    min: 0, //量程最小值
                },
            },
            division: {
                a_div: {
                    visible: true, //大分度显隐
                    num: 10, //分度值
                    radial_offset: 0, //径向偏移
                    line_width: 1, //线宽
                    line_length: 20, //线长0~100
                    value: 20, //单分度值
                },
                a_label: {
                    visible: true, // 大分度标题显隐
                    font: {
                        font_family: '微软雅黑',
                        font_size: 12,
                        font_style: 'normal',
                        text_decoration: 'normal',
                        font_weight: '400',
                    },
                    radial_offset: -10,
                },
                b_div: {
                    visible: false, //小分度显隐
                    num: 5, //分度值
                    radial_offset: 0, //径向偏移
                    line_width: 1, //线宽
                    line_length: 20,
                },
            },
        },
        xaxis: {
            text_angle: '0', // 标签角度，取值范围-90~90 度之间
            text_visible: true, // 标签显隐，默认显示
            text_offset: 0, //标签偏移
            line: {
                line_type: 'solid',
                line_width: 1,
            },
            visible: true, // 属性值：true(显示，默认)，false（不显示）
            font: {
                font_family: '微软雅黑',
                font_size: 14,
                font_style: 'normal',
                text_decoration: 'normal',
                font_weight: '400',
            },
            word_break: {
                open: false, // 轴标签是否换行
                width: 80, //调节范围0~100，百分比
                height: 50, //调节范围0~100，百分比
                text_align: 'center', // 属性值：left(居左)，center（居中，默认）,right(居右)
                line_height: 20, // 行高，实际像素0~100
            },
            title: {
                visible: false, // 属性值：true(显示)，false（不显示，默认）
                text: 'x轴标题内容',
                width: 30,
                height: 50,
                text_align: 'center', // 属性值：left(居左)，center（居中，默认）,right(居右)
                background: {
                    image: '',
                    border: {
                        line_type: 'solid',
                        radius: {
                            tleft: 0,
                            tright: 0,
                            bright: 0,
                            bleft: 0,
                        },
                        line_width: 2,
                    },
                },
                font: {
                    font_family: '微软雅黑',
                    font_size: 14,
                    font_style: 'normal',
                    text_decoration: 'normal',
                    font_weight: '400',
                },
            },
            limit: { start: 0, end: 0 }, // 数据显示范围填写x轴id
        },
        yaxis: {
            text_angle: '180', // 标签角度，取值范围0~360，默认180
            text_visible: true, // 标签显隐，默认显示
            text_offset: 0, //标签偏移
            line: {
                line_type: 'solid',
                line_width: 0,
            },
            visible: true, // 属性值：true(显示，默认)，false（不显示）
            font: {
                font_family: '微软雅黑',
                font_size: 14,
                font_style: 'normal',
                text_decoration: 'normal',
                font_weight: '400',
            },
            title: {
                visible: false, // 属性值：true(显示)，false（不显示，默认）、
                text: 'y轴标题内容',
                width: 40,
                height: 30,
                vertical_align: 'middle', // 属性值：top(上)，middle（中，默认）,bottom(下)
                background: {
                    image: '',
                    border: {
                        line_type: 'solid',
                        radius: {
                            tleft: 12,
                            tright: 12,
                            bright: 12,
                            bleft: 12,
                        },
                        line_width: 3,
                    },
                },
                font: {
                    font_family: '微软雅黑',
                    font_size: 14,
                    font_style: 'normal',
                    text_decoration: 'normal',
                    font_weight: '400',
                },
            },
            limit: { start: 0, end: 0 }, // 数据显示范围填写y轴数值
        },
        paxis: {
            text_visible: false, // 默认false
            font: {
                font_family: '微软雅黑',
                font_size: 14,
                font_style: 'normal',
                text_decoration: 'normal',
                font_weight: '400',
            },
            text_offset: 5, // 实际像素
            line: {
                visible: false,
                line_type: 'solid',
                line_width: 1,
            },
        },
        pcoor: {
            text_visible: false, // 默认false
            font: {
                font_family: '微软雅黑',
                font_size: 14,
                font_style: 'normal',
                text_decoration: 'normal',
                font_weight: '400',
            },
            text_offset: 5, // 实际像素
            text_angle: 0, // 角度旋转0~360
            h_offset: 0, // 水平偏移 -100~100
            v_offset: 2, // 垂直偏移 -100~100
            line: {
                visible: false,
                line_type: 'solid',
                line_width: 1,
            },
        },
        padding: { left: 50, top: 0, right: 50, bottom: 0 }, // 内边距，主要是坐标使用
        grid: {
            v_line: {
                line_type: 'dashed',
                line_width: 1,
                visible: true, // 属性值：true(显示)，false（不显示，默认）
            },
            h_line: {
                line_type: 'dashed',
                line_width: 1,
                visible: false, // 属性值：true(显示)，false（不显示，默认）
            },
            polygon: {
                line_type: 'solid',
                line_width: 1,
                visible: false, // 属性值：true(显示)，false（不显示，默认）
            },
            circle: {
                line_type: 'solid',
                line_width: 1,
                visible: false, // 属性值：true(显示)，false（不显示，默认）
            },
            radial: {
                visible: false,
                line_type: 'solid',
                line_width: 1,
            },
        },
    },
    animation: {
        open: true, // 动画开启或者关闭，默认开启true
    },
    handle: {
        open: true,
        popover: {
            open: true,
            shape: 'circle',
            event_type: 'hover',
            border: {
                line_type: 'solid', // 属性值：solid（实线，默认）、dashed（虚线）
                radius: { tleft: 0, tright: 0, bright: 0, bleft: 0 }, // 字段释义：tleft:top_left、tright:top_right、bright:bottom_right、bleft:bottom_left
                line_width: 0,
            },
            outset: { h: 0, v: 0, blur: 10 },
            value: {
                font: {
                    font_family: '微软雅黑',
                    font_size: 12,
                    font_style: 'normal',
                    text_decoration: 'normal',
                    font_weight: '400',
                },
            },
            series: {
                font: {
                    font_family: '微软雅黑',
                    font_size: 12,
                    font_style: 'normal',
                    text_decoration: 'normal',
                    font_weight: '400',
                },
            },
            label: {
                font: {
                    font_family: '微软雅黑',
                    font_size: 12,
                    font_style: 'normal',
                    text_decoration: 'normal',
                    font_weight: '400',
                },
            },
        },
    },
    default_theme: {
        assistant: {
            //辅助分析
            auxiliary: {
                //辅助线
                xline_color: 'rgba(255,140,100,1)', //横向辅助线颜色
                yline_color: 'rgba(255,140,100,1)', //纵向辅助线颜色
            },
        },
        data: {
            text_color: 'rgba(255,255,255,1)',
            text_stroke: 'rgba(25,35,39,0.6)', // 文本描边颜色
            bubble: {
                border: 'rgba(255,255,255,0.6)',
                color: 'rgba(13,53,91,0.6)',
                lead_wire: 'rgba(25,35,39,0.6)',
            },
        },
        graph: {
            colors: ['rgba(84,212,144,1)', 'rgba(60,212,212,1)', 'rgba(187,76,62,0.9)'],
            max: 'rgba(211,169,85,1)',
            min: 'rgba(255,255,255,1)',
            border: 'rgba(255,255,255,1)',
            inset: 'rgba(25,35,39,0.6)',
            outset: 'rgba(61,12,112,1)',
            g_shadow: 'rgba(0,0,0,1)',
        },
        point: {
            border: 'rgba(255,255,255,0.6)',
            color: 'rgba(25,35,39,0.6)',
        },
        pointer: {
            color: 'rgba(255,255,255,1)', //指针填充
            border: 'rgba(255,255,255,1)', //指针边框
        },
        background: {
            color: 'rgba(33,40,51,1)',
            border: 'rgba(25,35,39,0.6)',
            outset: 'rgba(25,35,39,0.6)',
            inset: 'rgba(25,35,39,0.6)',
        },
        title: {
            text_color: 'rgba(255,255,255,1)',
            color: 'rgba(25,35,39,0)',
            border: 'rgba(255,35,39,0)',
        },
        unit: {
            text_color: 'rgba(255,255,255,1)',
            color: 'rgba(25,35,39,0)',
            border: 'rgba(255,35,39,0)',
        },
        legend: {
            label: {
                border: 'rgba(25,35,39,0.6)',
                text_color: 'rgba(255,255,255,1)',
                color: 'rgba(25,35,39,0.6)',
            },
            background_color: 'transparent',
            border: 'rgba(25,35,39,0.6)',
        },
        guide: {
            grid: {
                v_line: 'rgba(255,255,255,0.3)',
                h_line: 'rgba(255,255,255,0.3)',
                polygon: 'rgba(255,255,255,0.6)',
                circle: 'rgba(255,255,255,0.6)',
                radial: 'rgba(255,255,255,0.3)',
            },
            xaxis: {
                line_color: 'rgba(255,255,255,0.6)',
                title: {
                    text_color: 'rgba(255,255,255,0.6)',
                    color: 'transparent',
                    border: 'transparent',
                },
                label: {
                    text_color: 'rgba(255,255,255,1)',
                    color: 'rgba(25,35,39,0.6)',
                    border: 'rgba(255,35,39,0)',
                },
            },
            yaxis: {
                line_color: 'rgba(255,255,255,0.6)',
                title: {
                    text_color: 'rgba(255,255,255,0.6)',
                    color: 'transparent',
                    border: 'transparent',
                },
                label: {
                    text_color: 'rgba(255,255,255,1)',
                    color: 'rgba(25,35,39,0.6)',
                    border: 'rgba(25,35,39,0.6)',
                },
            },
            paxis: {
                label: {
                    text_color: 'rgba(255,255,255,0.5)',
                    color: 'rgba(25,35,39,0)',
                    border: 'rgba(25,35,39,0)',
                },
                line_color: 'rgba(255,255,255,0.6)',
            },
            pcoor: {
                label: {
                    text_color: 'rgba(255,255,255,1)',
                    color: 'rgba(25,35,39,0)',
                    border: 'rgba(25,35,39,0)',
                },
                line_color: 'rgba(255,255,255,0.6)',
            },
            draw_coor: {
                label: {
                    text_color: 'rgba(255,255,255,1)',
                    color: 'rgba(18,18,18,1)',
                    border: 'rgba(51,51,51,1)',
                },
                division: {
                    a_div: {
                        line: 'rgba(255,255,255,1)',
                    },
                    a_label: {
                        text_color: 'rgba(255,255,255,1)',
                        color: 'transparent',
                    },
                    b_div: {
                        line: 'rgba(255,255,255,1)',
                    },
                },
            },
        },
        handle: {
            popover: {
                color: 'rgba(0,0,0,0.5)',
                border: 'rgba(255,255,255,0.1)',
                outset: 'rgba(0,0,0,0.5)',
                value: {
                    text_color: 'rgba(255,255,255,1)',
                },
                label: {
                    text_color: 'rgba(255,255,255,1)',
                },
                series: {
                    text_color: 'rgba(255,255,255,1)',
                },
            },
        },
        slot: {
            color: 'rgba(25,25,39,0)',
            border: 'rgba(255,255,39,1)',
            inset: 'rgba(25,35,39,0.6)',
            outset: 'rgba(25,35,39,0.6)',
        },
    },
    _mirror_axes: false, //是否镜像坐标，临时字段，_开头的字段均为临时字段，后期会被确定的字段替代（web临时需求需要）
}
```

## 图表类型（ \_type）

| 属性名       |    说明    |
| :----------- | :--------: |
| v_bar        | 基础柱状图 |
| line_bar     | 线柱混合图 |
| v_stacked    | 柱形堆叠图 |
| h_stacked    | 条形堆叠图 |
| h_bar        | 基础条形图 |
| line         | 基础折线图 |
| pie          | 基础环状图 |
| multi_pie    |   多环图   |
| radar        |   雷达图   |
| funnel       |   漏斗图   |
| gauge        |   仪表盘   |
| line_stacked |  堆叠面积  |

## chartData 数据结构

```js
[
    {
        title: 'tab1',
        cname: '类别总称',
        series: [
            { sid: 1, name: '系列1', unit: '单位' },
            { sid: 2, name: '系列2', unit: '单位' },
        ],
        data: [
            { from: 1, id: 1, x: '名称', y: 4 },
            { from: 1, id: 2, x: '名称', y: 4 },
            { from: 2, id: 1, x: '名称', y: 5 },
            { from: 2, id: 2, x: '名称', y: 5 },
        ],
    },
    {
        title: 'tab2',
        cname: '类别总称',
        series: [
            { sid: 1, name: '系列1', unit: '单位' },
            { sid: 2, name: '系列2', unit: '单位' },
        ],
        data: [
            { from: 1, id: 1, x: '名称', y: 4 },
            { from: 1, id: 2, x: '名称', y: 4 },
            { from: 2, id: 1, x: '名称', y: 5 },
            { from: 2, id: 2, x: '名称', y: 5 },
        ],
    },
];
```

字段结构说明

| 字段   |      类型       |          说明           |
| :----- | :-------------: | :---------------------: |
| title  | string(字符串） |        图表名称         |
| cname  |     string      |      图表类别名称       |
| series |  array(数组）   |        图表系列         |
| sid    |     number      |         系列 id         |
| name   | string(字符串） |        系列名称         |
| unit   | string(字符串） |        系列单位         |
| data   |  array(数组）   |        系列数据         |
| from   |     number      | 数据归属系列的 id (sid) |
| id     |     number      |        x 坐标 id        |
| x      | string(字符串） | x 坐标轴的名称（类别）  |
| y      |  number(数字）  |    x 坐标轴对应的值     |
