/*
 * Description:
 * Author: vicky
 * Date: 2021-10-29 11:38:05
 * LastEditTime: 2021-12-08 18:26:56
 * FilePath: \packages\raycharts\src\shape\liquidFill.js
 */
import * as zrender from 'zrender';

const LiquidFill = zrender.Path.extend({
    type: 'liquidFill',
    shape: {
        waveLength: 0, //波长
        radius: 0, //半径
        radiusY: 0, //垂直半径
        cx: 0, //圆心x
        cy: 0, //圆心y
        waterLevel: 0, //波水平位置
        amplitude: 0, //振幅
        phase: 0, //偏移
        inverse: false, //相反
    },
    buildPath: function (ctx, shape) {
        if (shape.waterLevel !== 0 && shape.waveLength !== 0) {
            let radius = shape.radius;
            let cx = shape.cx;
            let cy = shape.cy + radius;
            let waterLevel = !shape.inverse
                ? cy - 2 * radius * shape.waterLevel
                : cy - 2 * radius * (1 - shape.waterLevel);
            if (shape.radiusY == null) {
                shape.radiusY = radius;
            }

            /**
             * We define a sine wave having 4 waves, and make sure at least 8 curves
             * is drawn. Otherwise, it may cause blank area for some waves when
             * wave length is large enough.
             */
            let curves = Math.max(Math.ceil(((2 * radius) / shape.waveLength) * 4) * 5, 8);
            // map phase to [-Math.PI * 2, 0]
            while (shape.phase < -Math.PI * 2) {
                shape.phase += Math.PI * 2;
            }
            while (shape.phase > 0) {
                shape.phase -= Math.PI * 2;
            }
            // wave
            let phase = (shape.phase / Math.PI / 2) * shape.waveLength;

            let left = cx + phase - radius * 4;

            /**
             * top-left corner as start point
             *
             * draws this point
             *  |
             * \|/
             *  ~~~~~~~~
             *  |      |
             *  +------+
             */
            ctx.moveTo(left, waterLevel);

            /**
             * top wave
             *
             * ~~~~~~~~ <- draws this sine wave
             * |      |
             * +------+
             */
            let waveRight = 0;
            for (let c = 0; c < curves; ++c) {
                let stage = c % 4;
                let pos = getWaterPositions(
                    (c * shape.waveLength) / 4,
                    stage,
                    shape.waveLength,
                    shape.amplitude,
                );
                ctx.bezierCurveTo(
                    pos[0][0] + left,
                    -pos[0][1] + waterLevel,
                    pos[1][0] + left,
                    -pos[1][1] + waterLevel,
                    pos[2][0] + left,
                    -pos[2][1] + waterLevel,
                );

                if (c === curves - 1) {
                    waveRight = pos[2][0];
                }
            }

            if (shape.inverse) {
                /**
                 * top-right corner
                 *                  2. draws this line
                 *                          |
                 *                       +------+
                 * 3. draws this line -> |      | <- 1. draws this line
                 *                       ~~~~~~~~
                 */
                ctx.lineTo(waveRight + left, cy - shape.radiusY);
                ctx.lineTo(left, cy - shape.radiusY);
                ctx.lineTo(left, waterLevel);
            } else {
                /**
                 * top-right corner
                 *
                 *                       ~~~~~~~~
                 * 3. draws this line -> |      | <- 1. draws this line
                 *                       +------+
                 *                          ^
                 *                          |
                 *                  2. draws this line
                 */
                ctx.lineTo(waveRight + left, cy + shape.radiusY);
                ctx.lineTo(left, cy + shape.radiusY);
                ctx.lineTo(left, waterLevel);
            }

            ctx.closePath();
        }
    },
});

export default LiquidFill;

/**
 * Using Bezier curves to fit sine wave.
 * There is 4 control points for each curve of wave,
 * which is at 1/4 wave length of the sine wave.
 *
 * The control points for a wave from (a) to (d) are a-b-c-d:
 *          c *----* d
 *     b *
 *       |
 * ... a * ..................
 *
 * whose positions are a: (0, 0), b: (0.5, 0.5), c: (1, 1), d: (PI / 2, 1)
 *
 * @param {number} x          x position of the left-most point (a)
 * @param {number} stage      0-3, stating which part of the wave it is
 * @param {number} waveLength wave length of the sine wave
 * @param {number} amplitude  wave amplitude
 */
function getWaterPositions(x, stage, waveLength, amplitude) {
    if (stage === 0) {
        return [
            [x + ((1 / 2) * waveLength) / Math.PI / 2, amplitude / 2],
            [x + ((1 / 2) * waveLength) / Math.PI, amplitude],
            [x + waveLength / 4, amplitude],
        ];
    } else if (stage === 1) {
        return [
            [x + (((1 / 2) * waveLength) / Math.PI / 2) * (Math.PI - 2), amplitude],
            [x + (((1 / 2) * waveLength) / Math.PI / 2) * (Math.PI - 1), amplitude / 2],
            [x + waveLength / 4, 0],
        ];
    } else if (stage === 2) {
        return [
            [x + ((1 / 2) * waveLength) / Math.PI / 2, -amplitude / 2],
            [x + ((1 / 2) * waveLength) / Math.PI, -amplitude],
            [x + waveLength / 4, -amplitude],
        ];
    } else {
        return [
            [x + (((1 / 2) * waveLength) / Math.PI / 2) * (Math.PI - 2), -amplitude],
            [x + (((1 / 2) * waveLength) / Math.PI / 2) * (Math.PI - 1), -amplitude / 2],
            [x + waveLength / 4, 0],
        ];
    }
}
