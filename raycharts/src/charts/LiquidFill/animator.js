/*
 * Description:
 * Author: vicky
 * Date: 2021-11-03 17:31:19
 * LastEditTime: 2022-01-06 14:56:37
 * FilePath: \packages\raycharts\src\charts\LiquidFill\animator.js
 */
import _ from 'lodash';

// 动画默认参数
const defaultOptions = {
    time: 0,
    easing: 'linear',
    delay: 0,
    direction: 'right',
};
const animations = {
    waveLoop: waveLoop,
    grow,
    fadeIn,
};

// 新增动画
export function addAnimate(child, name, options = defaultOptions) {
    if (child?.shape) {
        const newOptions = _.merge(defaultOptions, options);
        if (animations[name]) {
            animations[name](child, newOptions);
        } else {
            console.error(`${name}动画不存在`);
        }
    }
}

// 水波循环动画
function waveLoop(wave, options) {
    const { time, delay, direction } = options;
    let phase = wave.shape.phase;

    let phaseOffset = 0;
    if (direction === 'right') {
        // 右移
        phaseOffset = Math.PI;
    } else {
        phaseOffset = -Math.PI;
    }

    if (time !== 0) {
        wave.animate('shape', true)
            .when(delay, {
                phase: phase,
            })
            .when(time / 2 + delay, {
                phase: phaseOffset + phase,
            })
            .when(time + delay, {
                phase: phaseOffset * 2 + phase,
            })
            .start();
    }
}

// 增长动画，水平增长
function grow(child, options) {
    const { time, delay, easing } = options;
    let end = child.shape.waterLevel;
    child.shape.waterLevel = 0;
    child.animateTo(
        {
            shape: {
                waterLevel: end,
            },
        },
        { duration: time, delay, easing },
    );
}

// 水波入场
export function newGrow(child) {
    let end = child.shape.waterLevel;
    child.shape.waterLevel = 0;
    return {
        shape: {
            waterLevel: end,
        },
    };
}

// 水波循环
export function newWaveLoop(wave, options) {
    const { delay, during, direction = 'right' } = options;
    let phase = wave.shape.phase;
    let phaseOffset = 0;
    if (direction === 'right') {
        // 右移
        phaseOffset = Math.PI;
    } else {
        phaseOffset = -Math.PI;
    }

    if (during !== 0) {
        wave.animate('shape', true)
            .when(delay, {
                phase: phase,
            })
            .when(during / 2 + delay, {
                phase: phaseOffset + phase,
            })
            .when(during + delay, {
                phase: phaseOffset * 2 + phase,
            })
            .start();
    }
}

/**
 * @method fadeIn 渐隐渐现
 * @param {*} child 被添加对象
 * @param {*} duration 动画时间
 * @param {*} delay 延时
 */
export function fadeIn(child, options) {
    if (child._textContent) {
        let endOpacity = child._textContent.style.opacity;
        child._textContent.style.opacity = 0;
        child._textContent.animateTo(
            {
                style: {
                    opacity: endOpacity,
                },
            },
            { duration: time, delay, easing },
        );
    }
    const { time, delay, easing } = options;
    let endOpacity = child.style.opacity;
    child.style.opacity = 0;
    child.animateTo(
        {
            style: {
                opacity: endOpacity,
            },
        },
        { duration: time, delay, easing },
    );
}
