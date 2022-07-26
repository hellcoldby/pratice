/*
 * Description:ConicalGradient 锥形渐变
 * Author: vicky
 * Date: 2020-12-29 15:19:42
 * LastEditTime: 2020-12-30 16:33:19
 * FilePath: \packages\raycharts\src\utils\gradient\conicalGradient.js
 */
import _ from 'lodash';

class ColorInterpolate {
    constructor(stops = [], segment = 100) {
        const canvas = document.createElement('canvas');
        canvas.width = segment;
        canvas.height = 1;
        this.ctx = canvas.getContext('2d');

        const gradient = this.ctx.createLinearGradient(0, 0, segment, 0);
        for (let [offset, color] of stops) {
            gradient.addColorStop(offset, color);
        }

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, segment, 1);
    }

    getColor(offset) {
        const imgData = this.ctx.getImageData(offset, 0, 1, 1);
        return `rgba(${imgData.data.slice(0, 3).join(',')}, ${imgData.data[3] / 255})`;
    }
}

function createConicalGradient(
    userContext,
    colorStops = [
        [0, '#fff'],
        [1, '#fff'],
    ],
    x = 0,
    y = 0,
    startAngle = 0,
    endAngle = 2 * Math.PI,
    anticlockwise = false,
) {
    const degStart = Math.floor((startAngle * 180) / Math.PI);
    const degEnd = Math.ceil((endAngle * 180) / Math.PI);

    // init off-screen canvas
    const canvas = document.createElement('canvas');
    canvas.width = userContext.canvas.width;
    canvas.height = userContext.canvas.height;
    const ctx = canvas.getContext('2d');

    // user canvas corners
    const corners = [
        [0, 0],
        [userContext.canvas.width, 0],
        [userContext.canvas.width, userContext.canvas.height],
        [0, userContext.canvas.height],
    ];

    // gradient radius
    const radius = Math.max(...corners.map(([cx, cy]) => Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2)))) + 10;

    ctx.translate(x, y);
    const lineWidth = (2 * Math.PI * (radius + 20)) / 360;
    // color linear interpolate
    const interpolate = new ColorInterpolate(colorStops, degEnd - degStart + 1);

    // draw gradient image
    for (let i = degStart; i <= degEnd; i++) {
        ctx.save();
        ctx.rotate(((anticlockwise ? -1 : 1) * (Math.PI * i)) / 180);

        ctx.beginPath();

        ctx.moveTo(0, 0);
        ctx.lineTo(radius, -2 * lineWidth);
        ctx.lineTo(radius, 0);

        ctx.fillStyle = interpolate.getColor(i - degStart);
        ctx.fill();

        ctx.closePath();

        ctx.restore();
    }

    // clip content overflow
    const cvsForClip = document.createElement('canvas');
    cvsForClip.width = userContext.canvas.width;
    cvsForClip.height = userContext.canvas.height;
    const clipCtx = cvsForClip.getContext('2d');
    clipCtx.beginPath();
    clipCtx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    clipCtx.lineTo(x, y);
    clipCtx.closePath();
    clipCtx.fillStyle = clipCtx.createPattern(canvas, 'no-repeat');
    clipCtx.fill();

    return userContext.createPattern(cvsForClip, 'no-repeat');
}

CanvasRenderingContext2D.prototype.createConicalGradient = function () {
    const args = arguments;
    const ctx2d = this;
    const obj = {
        stops: [],
        pattern: null,
        addColorStop(offset, color) {
            this.stops.push([offset, color]);
        },
        get pattern() {
            return createConicalGradient(ctx2d, this.stops, ...args);
        },
    };

    return obj;
};

export default class ConicalGradient {
    constructor(x = 0, y = 0, width = 0, height = 0, startAngle, endAngle, anticlockwise, colorStops) {
        this.args = [x, y, startAngle, endAngle, anticlockwise];
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        this.ctx = canvas.getContext('2d');
        this.stops = colorStops;
    }
    getColor() {
        let gradient = this.ctx.createConicalGradient(...this.args);
        !_.isEmpty(this.stops) &&
            this.stops.forEach((item) => {
                gradient.addColorStop(item.offset, item.color);
            });
        return gradient.pattern;
    }
}
