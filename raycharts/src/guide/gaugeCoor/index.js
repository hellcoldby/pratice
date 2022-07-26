/*
 * Description:gaugeCoor 仪表盘刻度
 * Author: vicky
 * Date: 2020-11-15 14:37:25
 * LastEditTime: 2021-01-27 16:46:42
 * FilePath: \packages\raycharts\src\guide\gaugeCoor\index.js
 */
import { Group, Line } from '../../shape';
import canMoveLabel from '../../components/canMoveLabel';
import { color, G_NAME, G_INDEX, lenBtwPoints, pointByRad } from '../../utils';

export default function renderGaugeCoor(params) {
    const {
        configData: {
            guide: {
                draw_coor: { division },
            },
            default_theme: {
                guide: {
                    draw_coor: { division: divTheme },
                },
            },
        },
        gInfo: gI,
    } = params;
    let coorGroup = new Group({ name: G_NAME.drawCoor });
    //绘制大分度
    let aDiv = division.a_div;
    if (aDiv.visible) {
        drawDiv(
            gI.aDivInfo,
            {
                name: 'a_div_group',
                z: G_INDEX.a_div,
                lineLength: gI.r * 0.5 * (aDiv.line_length / 100),
                lineWidth: aDiv.line_width,
                lineColor: divTheme.a_div.line,
                rOffset: aDiv.radial_offset ?? 0,
            },
            coorGroup,
        );
        //绘制大分度文本
        let aLabel = division.a_label;
        const config = {
            name: 'a_div_label_group',
            z: G_INDEX.a_div_label,
            font: aLabel.font,
            theme: divTheme.a_label,
            rOffset: aLabel.radial_offset ?? 0,
        };
        aLabel.visible && drawLabel(config, gI.aDivInfo, coorGroup);
        //绘制小分度
        let bDiv = division.b_div;
        bDiv.visible &&
            drawDiv(
                gI.bDivInfo,
                {
                    name: 'b_div_group',
                    z: G_INDEX.b_div,
                    lineLength: gI.r * 0.5 * (bDiv.line_length / 100),
                    lineWidth: bDiv.line_width,
                    lineColor: divTheme.b_div.line,
                    rOffset: bDiv.radial_offset ?? 0,
                },
                coorGroup,
            );
    }
    return coorGroup;
}

/**
 * @method drawLabel 绘制标签
 * @param {*} config 配置信息
 * @param {*} info 详情数组
 * @param {*} group 所在组
 */
function drawLabel(config, info, group) {
    const { name, z, font, theme, rOffset } = config;
    if (info.length > 1) {
        info.forEach((item) => {
            let label = canMoveLabel({
                g_name: name,
                z,
                content: item.value,
                style: {
                    font,
                    borderHide: true,
                },
                colors: {
                    text: theme.text_color,
                    bg: theme.color,
                },
            });
            //计算偏移量
            let rF = (rOffset / 100) * item.r;
            let n_p = pointByRad(item.cx, item.cy, item.r + rF, item.angle);
            label.position = [n_p.x, n_p.y];
            group.add(label);
        });
    }
}

/**
 * @method drawDiv 绘制分度
 * @param {*} infoData  详情数组
 * @param {*} config 配置信息
 * @param {*} group 添加的组
 */
function drawDiv(infoData, config, group) {
    const { name, z, lineColor, lineLength, lineWidth, rOffset } = config;
    let divGroup = new Group({ name });
    if (infoData.length > 1) {
        //计算线宽
        let a = infoData[0],
            b = infoData[1];
        let lw = Math.max(lenBtwPoints(a.x, a.y, b.x, b.y) * (lineWidth / 100), 1);
        //计算偏移量
        let rF = (rOffset / 100) * a.r;
        infoData.forEach((item) => {
            const shape = getLineShape(item.cx, item.cy, item.r + rF, item.angle, lineLength);
            divGroup.add(drawLine(shape, z, lineColor, lw));
        });
    }
    group.add(divGroup);
}

/**
 * @method drawLine 绘制线
 * @param {*} shape line的shape信息
 * @param {*} z 图层
 * @param {*} lineColor 线颜色
 * @param {*} lineWidth 线宽度
 */
function drawLine(shape, z, lineColor, lineWidth) {
    return new Line({
        name: 'div_line',
        z,
        origin: [shape.c_x, shape.c_y],
        rotation: 1.5 * Math.PI - shape.rotation,
        shape,
        style: {
            stroke: lineColor ? color(lineColor) : null,
            opacity: 1,
            lineWidth,
        },
    });
}

/**
 * @method getLineShape 获取线shape信息
 * @param {*} cx 原点x
 * @param {*} cy 原点y
 * @param {*} r 半径
 * @param {*} angle 角度
 * @param {*} length 线长
 */
function getLineShape(cx, cy, r, angle, length) {
    let exp = length / 2;
    //计算原点
    let o_p = pointByRad(cx, cy, r, angle);
    let s_p = pointByRad(o_p.x, o_p.y, exp, 1.5 * Math.PI);
    let e_p = pointByRad(o_p.x, o_p.y, exp, 0.5 * Math.PI);
    return {
        x1: s_p.x,
        y1: s_p.y,
        x2: e_p.x,
        y2: e_p.y,
        c_x: o_p.x,
        c_y: o_p.y,
        rotation: angle,
    };
}
