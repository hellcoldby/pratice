import _ from 'lodash';
import easingFuncs from './easingFn';

export { elUpdate } from './elUpdate';

export function entryAnimator(sub, cbSet = {}, opts = {}) {
    const {
        target = '',
        animatorList = [],
        animatorType = 'linear',
        delay = 0,
        duration = 1000,
        // duration = 1000
    } = opts;
    const endState = animatorList.reduce((set, info) => {
        const { target: t, character } = info;
        const end = cbSet[character]?.(sub) ?? {};
        return t === target ? _.merge(set, end) : set;
    }, {});
    // 执行动画
    // console.log(endState);
    // console.log(easingFuncs?.[animatorType] ?? 'linear');
    return sub.animateTo(endState, {
        duration,
        delay,
        easing: easingFuncs?.[animatorType] ?? easingFuncs.linear,
    });
}

export function loopAnimator(sub, cbSet = {}, opts = {}) {
    const { target = '', animatorList = [] } = opts;

    animatorList.forEach((info) => {
        const { target: t, character, ...rest } = info;
        t === target && cbSet[character]?.(sub, rest);
    });
}
