/*
 * Description:
 * Author: vicky
 * Date: 2021-08-18 11:36:45
 * LastEditTime: 2022-03-10 14:06:38
 * FilePath: \packages\raycharts\src\charts\WordCloud\index.js
 */
import { Group, Text } from '../../shape';
import { G_NAME, G_INDEX } from '../../utils';
import render_word_cloud from './wordcloud';
import _ from 'lodash';
import { addAnimate, setAnimType } from '../../animation/common';

function WordCloud(config) {
    const { configData, chartData, maxWidth, maxHeight, addHoverAction } = config;
    const {
        general: {
            space,
            rotate_range = [-90, 90],
            rotate_ratio = 0,
            shape_type,
            image,
            font,
            shape,
            highlight_max,
            highlight_min,
        },
        default_theme: { graph },
        analysis: { sort },
        animation: { open: aniOpen, entry: anim_entry_list },
    } = configData;
    if (!render_word_cloud.isSupported) {
        throw new Error('Sorry your browser not support render_word_cloud');
    }
    const Graphics = new Group({ name: `Graphics` });
    let canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = maxHeight;

    // 获取图形对应的动画列表
    const animType_list = setAnimType(anim_entry_list);
    const typeList =  animType_list.getAnim('shape');
    //删除默认动画
    // const isGrow = animType_list.delAnim(typeList,'grow');
    // const isFadeIn = animType_list.delAnim(typeList,'fadeIn');
    const isScale = animType_list.delAnim(typeList, 'unfold');


    // 是否使用mask
    let isMask = shape_type === 'image' && image !== '';
    // 间距最大值
    let minSize = Math.min(maxWidth, maxHeight);
    let maxGSize = minSize * 0.2;
    // 字号范围
    let sizeRange = font?.size_range || [12, 60];
    let min_fz = minSize < sizeRange[0] ? minSize : sizeRange[0];
    let max_fz = minSize < sizeRange[1] ? minSize : sizeRange[1];
    const wCloudData = getData(chartData, sort, graph.colors, [min_fz, max_fz], {
        max: highlight_max ? graph.max : null,
        min: highlight_min ? graph.min : null,
    });
    // 旋转角度
    let min_rad = (rotate_range[0] * Math.PI) / 180;
    let max_rad = (rotate_range[1] * Math.PI) / 180;
    let gSpace = wCloudData.length > 1 && space ? maxGSize * (space / 100) : 0;
    const options = {
        list: wCloudData,
        fontFamily: font.font_family,
        fontWeight: font.font_weight,
        color: getTextColor,
        backgroundColor: 'transparent',
        weightFactor: 1,
        clearCanvas: !isMask,
        drawMask: false,
        maskColor: 'rgba(255,0,0,0.3)',
        maskGapWidth: 0.3,
        minSize: 0,
        gridSize: gSpace,
        origin: null,
        drawOutOfBound: false,
        minRotation: min_rad,
        maxRotation: max_rad,
        rotateRatio: rotate_ratio / 100,
        shape: isMask ? null : shape,
        ellipticity: 0.65,
        onCanvasDraw: drawText,
    };
    if (isMask) {
        maskImg(image, canvas, options, Graphics);
    } else {
        render_word_cloud(canvas, options);
    }
    const textGroup = new Group({ name: G_NAME.shape });


    function drawText(params) {

        const { word, font, color, rotation, position, scale, extraData } = params;
        const { cid, sid, index } = extraData;

        const text = new Text({
            name:'text'+index,
            scale: scale,
            rotation,
            position: position,
            z: G_INDEX.shape,
            style: {
                align: 'center',
                text: word,
                font,
                fill: color,
                verticalAlign: 'middle',
            },
        });


        // 添加hover交互
        addHoverAction(text, { cid, sid });
        textGroup.add(text);

        if(isScale && aniOpen){
            text.scale = [0, 0];
            text.animateTo({
                scale : [1, 1]
            },{
                duration: 400,
                delay:index * 20,
            });
        }

        aniOpen && addAnimate(text, typeList, 800, index * 20 );

    }
    // param支持 word/distance/extraDataArray/fontSize/theta/weight
    function getTextColor({ extraDataArray }) {
        return extraDataArray && extraDataArray[0].color;
    }



    Graphics.add(textGroup);
    return Graphics;
}

function maskImg(imgUrl, canvas, options, Graphics) {
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.crossOrigin = '';
    img.src = imgUrl;
    img.onload = function readPixels() {
        let imgSize = getImgSize(img.width, img.height, canvas.width, canvas.height);
        let w = imgSize.w;
        let h = imgSize.h;
        let cW = canvas.width;
        let cH = canvas.height;
        let oX = (cW - w) / 2;
        let oY = (cH - h) / 2;
        // 绘制居中图片
        ctx.drawImage(img, oX, oY, w, h);
        let sImg = convertCanvasToImage(canvas);
        ctx.drawImage(sImg, 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let newImageData = ctx.createImageData(imageData);
        for (let i = 0; i < imageData.data.length; i += 4) {
            let tone = imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2];
            let alpha = imageData.data[i + 3];
            if (alpha >= 128 || tone > 128 * 3) {
                // Area not to draw
                newImageData.data[i] = newImageData.data[i + 1] = newImageData.data[i + 2] = 255;
                newImageData.data[i + 3] = 0;
            } else {
                // Area to draw
                newImageData.data[i] = newImageData.data[i + 1] = newImageData.data[i + 2] = 0;
                newImageData.data[i + 3] = 255;
            }
        }
        ctx.putImageData(newImageData, 0, 0);
        // 图片区域对照
        // let aImg = convertCanvasToImage(canvas);
        // let ae = new zShape.Image({
        //     style: {
        //         image: aImg.src,
        //     },
        // });
        // Graphics.add(ae);
        render_word_cloud(canvas, options);
    };
}
function convertCanvasToImage(canvas) {
    let image = new Image();
    image.src = canvas.toDataURL('image/png');
    return image;
}
// 获取词云数据
function getData(chartData, sort, colors, sizeRange, hlColor) {
    let sList = chartData?.seriesList || [];
    let dataBC = chartData?.dataBaseCategory || {};
    let cId = Object.keys(dataBC)[0];
    let cData = dataBC[cId];
    let data = [];
    let colorIndex = 0;
    let maxColor = hlColor?.max;
    let minColor = hlColor?.min;
    let max = Math.max(...cData);
    let min = Math.min(...cData);
    if (cData) {
        let minValue = Math.min(...cData);
        let maxValue = Math.max(...cData);
        let i = 0;
        sList.forEach((item, index) => {
            let word = item?.seriesName || '';
            let cVal = cData[index];
            let color = getColor(cVal === max, cVal === min, maxColor, minColor, colors[colorIndex]);
            colorIndex++;
            if (colorIndex > colors.length - 1) {
                colorIndex = 0;
            }
            let fontSize = getFontSize(cVal, sizeRange, [minValue, maxValue], sList.length);
            if (cVal || cVal === 0) {
                data.push([word, fontSize, { color, sid: item.sid, cid: cId, value: cVal, index: i }]);
                i++;
            }
        });
        if (sort === 'minToMax') {
            data.sort((a, b) => {
                return a[1] - b[1];
            });
        }
        if (sort === 'maxToMin') {
            data.sort((a, b) => {
                return b[1] - a[1];
            });
        }
    }
    return data;
}
function getImgSize(width, height, areaWidth, areaHeight) {
    let imgRatio = width / height;
    let areaRatio = areaWidth / areaHeight;
    let w;
    let h;
    if (areaRatio >= imgRatio) {
        h = areaHeight;
        w = h * imgRatio;
    } else {
        w = areaWidth;
        h = w / imgRatio;
    }
    return {
        w,
        h,
    };
}

function getColor(isMax, isMin, maxColor, minColor, defaultColor) {
    let color = defaultColor;
    if (isMax && maxColor) {
        color = maxColor;
    }
    if (isMin && minColor) {
        color = minColor;
    }
    return color;
}

function getFontSize(val, sizeRange, valueRange, length) {
    let vr0 = valueRange[0];
    let vr1 = valueRange[1];
    let sr0 = sizeRange[0];
    let sr1 = sizeRange[1];
    let subV = vr1 - vr0;
    let subS = sr1 - sr0;
    // 只有一个数据的时候字号为最大字号
    if (length === 1) {
        return sr1;
    }
    if (subV === 0) {
        return subS === 0 ? sr0 : (sr0 + sr1) / 2;
    }
    return ((val - vr0) / subV) * subS + sr0;
}





export default WordCloud;
