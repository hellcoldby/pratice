/*
 * Description:公共文件
 * Author: vicky
 * Date: 2020-11-02 19:57:51
 * LastEditTime: 2020-11-17 17:12:22
 * FilePath: \packages\raycharts\src\utils\common.js
 */

//图层组名称
//命名中包括：图层名称，自身名称，类型名称、属性名称能够关联的均可以加入里面，方便检索
export const G_NAME = {
    //数据
    data: '_decorate_data_group',
    //气泡
    bubble: '_decorate_bubble_group',
    //端点
    point: '_decorate_point_group',
    //图形
    shape: 'shape_group',
    //槽位
    slot: '_decorate_bg_slot_group',
    //标题
    title: '_base_title_text_group',
    //单位
    unit: '_base_unit_text_group',
    //x轴线
    xALine: '_base_guide_x_axis_line_group',
    //x轴标题
    xATitle: '_base_guide_x_axis_title_text_group',
    //x轴标签
    xALabel: '_base_guide_x_axis_label_text_group',
    //y轴线
    yALine: '_base_guide_y_axis_line_group',
    //y轴标题
    yATitle: '_base_guide_y_axis_title_text_group',
    //y轴标签
    yALabel: '_base_guide_y_axis_label_text_group',
    //极轴
    pALabel: '_base_guide_polar_axis_label_text_group',
    //极坐标
    pCoorLabel: '_base_guide_polar_coor_label_text_group',
    //绘图坐标
    drawCoor: '_base_guide_draw_coor_group',
    //绘图坐标标签
    drawCoorLabel: '_base_guide_draw_coor_text_group',
    //指针
    pointer: 'pointer_group',
    //网格线
    grid: '_base_guide_grid_group',
    //图例
    legend: '_base_legend_group',
    //hover辅助
    hoverGuide: '_hover_guide_group',
    //hover弹出
    hoverPop: '_hover_pop_group',
};

//幂数
let pow = 3;
//图层层级值
export const G_INDEX = {
    //交互层级
    hover: 9 * Math.pow(10, pow),
    //数据
    data: 8 * Math.pow(10, pow),
    //气泡
    bubble: 7 * Math.pow(10, pow),
    //指针
    pointer: 6 * Math.pow(10, pow),
    //大分度标签
    a_div_label: 5 * Math.pow(10, pow),
    //端点
    point: 4 * Math.pow(10, pow),
    //图形
    shape: 3 * Math.pow(10, pow),
    //大分度
    a_div: 2.4 * Math.pow(10, pow),
    //小分度
    b_div: 2.2 * Math.pow(10, pow),
    //刻度轴线
    scale: 2 * Math.pow(10, pow),
    //槽位
    slot: Math.pow(10, pow),
    //底层基础配置项0~Math.pow(10,pow)
    //包括标题、单位、轴线、轴标签、轴标题、网格线等及其阴影、描边
    base: 0,
};

//交互命名
export const ACTIVE_NAME = {
    hover: '_event_hover',
    click: '_event_click',
    drag: '_event_drag',
    refresh: 'refresh',
    //隐藏
    hide: 'hide',
};
