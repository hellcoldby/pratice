import _ from 'lodash';
import { Group, Rect, Text, Circle } from '../../../shape';
import parse from '../parse/decorator';
import { parseSpot } from './parse';
import { addAnimate, setAnimType } from '../../../animation/common';

class Spot {
    name = 'scatter spot';

    constructor(config) {
        const { position, size, color, anim } = config;

        // 绘图信息
        this.position = position;
        this.size = size;
        this.color = color;
        this.anim = anim;

        const { graph, border, outset } = config;
        const graphStyle = {
            ...(graph ?? {}),
        };
        const borderStyle = {
            ...(border ?? {}),
        };
        const outsetStyle = {
            ...(outset ?? {}),
        };

        this.graphLayerArr = [graphStyle, borderStyle, outsetStyle];

        // 节点容器
        this.nodeGroup = new Group({ position, name: this.name });
        // 获取图形对应的动画列表 返回---->> animType_list['shape'] = ['grow', 'fadeIn'];
        this.animType_list = setAnimType(anim.anim_entry_list);
    }

    // 圆形
    circleNode() {
        const { size } = this;
        const node = new Circle({
            shape: { r: size / 2 },
        });
        return node;
    }

    render() {
        this.graphLayerArr.forEach((style) => {
            const shape = this.circleNode();
            const node = shape.attr(style);
            this.nodeGroup.add(node);
        });

        if (this.anim.animOpen) {
            this.nodeGroup.eachChild((child) => addAnimate(child, this.animType_list.getAnim('shape')));
            // this.nodeGroup.eachChild((child) => addAnimate(child, ['unfold']));
        }

        return this.nodeGroup;
    }
}

export default parse(parseSpot)(Spot);
