import _ from 'lodash';
import * as zrender from 'zrender';

// 色彩处理函数
export { color } from '../../../utils/color';

export { G_NAME, G_INDEX } from '../../../utils/common';

// 文字包围盒
export const getTextBox = (parm) => {
    let config = parm;
    if (typeof parm === 'string') {
        config = { style: { text: parm } };
    }
    const boundingRect = new zrender.Text(config).getBoundingRect();
    return boundingRect;
};

// 边界值处理
export const limitValue = (per, limit) => (limit * per) / 100;

// 虚线处理
export const renderLineType = (type, dashArray) =>
    type === 'solid' ? '' : type === 'dashed' ? dashArray ?? [2, 2] : '';

// config 配置信息合并
export const mergeConfig = (origin, addition) => {
    _.mergeWith(origin, addition, (origValue, addValue) => {
        if (Object.prototype.toString.call(origValue) !== '[object Object]') {
            return origValue ?? addValue;
        }
    });
    // console.log(origin);
    return origin;
};
