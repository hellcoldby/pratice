import _ from 'lodash';

/**
 * 针对 configData 的预处理
 * @param {obj} configData 完整数据
 * @param {obj} diffConfig 差量数据 只能检测用不能修改用
 * @returns
 */
export function configPretreat(configData, diffConfig) {
    const chartType = configData._type;

    /*             删除部分的数据兼容             */
    // 临时 端点 size 部分的修改
    if (checkKey(configData, ['general.point.size', '!general.point.width', '!general.point.height'])) {
        const size = configData.general.point.size;
        configData.general.point.width = size;
        configData.general.point.height = size;
    }

    /*             修改部分的数据兼容             */
    // 数据盒子 position 位置部分的修改
    if (['v_bar', 'h_bar', 'test'].includes(chartType)) {
        const matchKey = ['data.position', '!data.total_position', '!data.baseline', '!data.align'];
        if (checkKey(diffConfig, matchKey)) {
            switch (configData.data.position) {
                case 'middle':
                    configData.data.baseline = 'center';
                    configData.data.align = 'center';
                    break;
                case 'bottom':
                    configData.data.baseline = 'start';
                    configData.data.align = 'end';
                    break;
                default:
                    break;
            }
        }
    }
    return configData;
}
/**
 * 是否符合规则
 * @param {Object} obj
 * @param {Array} matchKey
 * @return {Boolean}
 */
function checkKey(obj, matchKey) {
    return matchKey.every((keyPath) => {
        const rule = keyPath[0] === '!' ? false : true;
        const path = keyPath.slice(rule ? 0 : 1);
        return rule === _.has(obj, path);
    });
}
