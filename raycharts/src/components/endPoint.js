import * as zrender from 'zrender';
import { Group, Rect, Ellipse, Image } from '../shape';
import { color } from '../utils/color';
import { G_NAME, G_INDEX } from '../utils/common';

const renderLineType = (type) => (type !== 'solid' ? [2, 2, 2, 2] : '');
const limitValue = (per, limit) => (limit * per) / 100;

/**
 * @method endPoint
 * @description 渲染生成端点
 * @param {Object} configData 配置项
 * @param {Object} config 设置参数
 * @returns {sub} 端点组 返回的图形在定位点中心
 * @example
 * config: {
 *  name: 元素名称，不传为空
 *  maxSize: 图形最大尺寸
 *  isMin: 是否为最小值
 *  isMax: 是否为最大值
 *  _baseZ: 图形层级, 不传使用默认层级
 * }
 */
function endPoint(configData) {
    const {
        // 端点
        point: {
            image: Endpoint_ImageURL, // 图片地址
            shape: Endpoint_Shape, // 端点样式
            visible: Endpoint_Visible, // 端点显示隐藏
            size: Endpoint_Size, // 端点尺寸
            width: Endpoint_Width, //端点宽
            height: Endpoint_Height, //端点高
            show: Endpoint_Filter,
            border: {
                line_type: Endpoint_BorderType, // 端点边框样式
                line_width: Endpoint_BorderWidth, // 端点边框宽度
            },
        },
    } = configData?.general;
    // 端点的【颜色】
    let {
        border: Endpoint_BorderColor, // 端点的边框颜色
        color: Endpoint_BGColor, // 端点的背景色
    } = configData?.default_theme?.point;

    return (config) => {
        const { name: baseName, _baseZ, maxSize, isMin, isMax } = config;
        // 容器组
        const endPointGroup = new Group({ name: `${G_NAME.point} ${baseName}` });

        // 判空
        if (Endpoint_Visible === false) return endPointGroup;
        if (Endpoint_Filter === 'min' && isMin === false) return endPointGroup;
        if (Endpoint_Filter === 'max' && isMax === false) return endPointGroup;
        if (Endpoint_Filter === 'ex' && isMin === false && isMax === false) return endPointGroup;

        // 节点大小
        const PointWidth = limitValue(Endpoint_Width, maxSize);
        const PointHeight = limitValue(Endpoint_Height, maxSize);
        const PointMin = Math.min(PointWidth, PointHeight);

        // 基本配置
        const endPointConfig = {
            name: `EndPoint ${baseName}`,
            z: _baseZ || G_INDEX.point,
            silent: true,
            style: {
                fill: color(Endpoint_BGColor),
                lineDash: renderLineType(Endpoint_BorderType),
                lineWidth: limitValue(Endpoint_BorderWidth, PointMin),
                stroke: color(Endpoint_BorderColor),
            },
        };

        // 添加形状
        endPointGroup.add(
            Endpoint_Shape === 'circle'
                ? new Ellipse(endPointConfig).attr({
                      shape: {
                          rx: -PointWidth / 2,
                          ry: -PointHeight / 2,
                      },
                  })
                : Endpoint_Shape === 'rectangle'
                ? new Rect(endPointConfig).attr({
                      shape: {
                          x: -PointWidth / 2,
                          y: -PointHeight / 2,
                          width: PointWidth,
                          height: PointHeight,
                      },
                  })
                : null,
        );

        // 添加图片
        endPointGroup.add(
            Endpoint_ImageURL === ''
                ? null
                : new Image({
                      name: `EndPointImage ${baseName}`,
                      z: _baseZ || G_INDEX.point,
                      silent: true,
                      style: {
                          image: Endpoint_ImageURL,
                          x: -PointWidth / 2,
                          y: -PointHeight / 2,
                          width: PointWidth,
                          height: PointHeight,
                      },
                  }),
        );

        return endPointGroup;
    };
}

export default endPoint;
