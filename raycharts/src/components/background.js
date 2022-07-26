import * as zrender from 'zrender';
import { Group, Image, Rect, Text } from '../shape';
import { color } from '../utils/color';
import { G_NAME, G_INDEX } from '../utils/common';

const renderLineType = (type) => (type !== 'solid' ? [5, 5] : '');
const limitValue = (per, limit) => (limit * per) / 100;

class Background extends Group {
    constructor(config) {
        super({ name: `BackgroundBox`, silent: true });
        // 实例化对象
        // 背景颜色板
        this.background = this.entryAnimation(config)(new Rect(this.formBackground(config)));
        // 描边
        this.backBorder = this.entryAnimation(config)(new Rect(this.formBackBorder(config)));
        // 背景图片
        this.backImage = this.entryAnimation(config)(new Image(this.formBackImage(config)));
        // 设置背景裁剪
        this.backImage.setClipPath(new Rect(this.formBackBorder(config)));
        // 加入组
        this.add(this.background).add(this.backBorder).add(this.backImage);
    }

    updateGroup(config) {
        // this.background.animateTo(this.formBackground(config));
        // this.backBorder.animateTo(this.formBackBorder(config));
        // this.backImage.animateTo(this.formBackImage(config));
    }

    formBackground(config) {
        const { configData, width, height } = config;
        const {
            image: image_URL,
            border: {
                line_type,
                radius: {
                    tleft: radius_tl,
                    tright: radius_tr,
                    bright: radius_br,
                    bleft: radius_bl,
                },
                line_width,
            },
            // inset: { h: inset_h, v: inset_v, blur: inset_blur },
            // outset: { h: outset_h, v: outset_v, blur: outset_blur },
            opacity,
            // padding: { left: padding_left, top: padding_top, right: padding_right, bottom: padding_bottom },
        } = configData.background;
        const {
            color: background_color,
            border: border_color,
            // outset: outset_color,
            // inset: inset_color,
        } = configData.default_theme.background;
        const limitLineWidth = limitValue(line_width, Math.min(width * 0.1, height * 0.1));
        return {
            name: 'Background',
            z: G_INDEX.base - 10,
            z2: 0,
            shape: {
                x: limitLineWidth / 2,
                y: limitLineWidth / 2,
                width: width - limitLineWidth,
                height: height - limitLineWidth,
                r: [
                    limitValue(radius_tl, 100),
                    limitValue(radius_tr, 100),
                    limitValue(radius_br, 100),
                    limitValue(radius_bl, 100),
                ],
            },
            style: {
                opacity: limitValue(opacity, 1),
                fill: color(background_color),
            },
        };
    }

    formBackBorder(config) {
        const { configData, width, height } = config;
        const {
            image: image_URL,
            border: {
                line_type,
                radius: {
                    tleft: radius_tl,
                    tright: radius_tr,
                    bright: radius_br,
                    bleft: radius_bl,
                },
                line_width,
            },
            // inset: { h: inset_h, v: inset_v, blur: inset_blur },
            // outset: { h: outset_h, v: outset_v, blur: outset_blur },
            opacity,
            // padding: { left: padding_left, top: padding_top, right: padding_right, bottom: padding_bottom },
        } = configData.background;
        const {
            color: background_color,
            border: border_color,
            // outset: outset_color,
            // inset: inset_color,
        } = configData.default_theme.background;
        const limitLineWidth = limitValue(line_width, Math.min(width * 0.1, height * 0.1));
        return {
            name: 'Background',
            z: G_INDEX.base - 10,
            z2: 2,
            shape: {
                x: limitLineWidth / 2,
                y: limitLineWidth / 2,
                width: width - limitLineWidth,
                height: height - limitLineWidth,
                r: [
                    limitValue(radius_tl, 100),
                    limitValue(radius_tr, 100),
                    limitValue(radius_br, 100),
                    limitValue(radius_bl, 100),
                ],
            },
            style: {
                opacity: limitValue(opacity, 1),
                fill: 'transparent',
                lineWidth: limitLineWidth,
                lineDash: renderLineType(line_type),
                stroke: color(border_color),
            },
        };
    }

    formBackImage(config) {
        const { configData, width, height } = config;
        const {
            image: image_URL,
            border: {
                line_width,
                radius: {
                    tleft: radius_tl,
                    tright: radius_tr,
                    bright: radius_br,
                    bleft: radius_bl,
                },
            },
            opacity,
        } = configData.background;
        const limitLineWidth = limitValue(line_width, Math.min(width * 0.1, height * 0.1));
        return {
            name: 'BackImage',
            z: G_INDEX.base - 10,
            z2: 1,
            style: {
                x: limitLineWidth / 2,
                y: limitLineWidth / 2,
                image: image_URL,
                opacity: limitValue(opacity, 1),
                width: width - limitLineWidth,
                height: height - limitLineWidth,
            },
        };
    }

    entryAnimation(config) {
        const { configData } = config;
        const {
            open: open_animation, // 动画开启或者关闭，默认开启true
        } = configData.animation;
        return (sub) => {
            if (open_animation === false) return sub;
            const targetOpacity = sub.style?.opacity ?? 1;
            sub.attr('style', {
                opacity: 0,
            })
                .animate('style')
                .when(500, { opacity: targetOpacity })
                .start();
            return sub;
        };
    }
}

export default Background;
