import _ from 'lodash';
import { mergeConfig, base } from '../utils';
const { deepCopyObj, isObject, isArray } = base;

import { defaultConfig as config } from './defaultConfig';
import * as partConfigList from './partConfig';

const configMap = {
    ...partConfigList,
};

function getPartConfig(type) {
    if (configMap?.[type]) {
        if (isObject(configMap[type])) {
            const partConfig = configMap[type];
            return partConfig;
        }
        if (isArray(configMap[type])) {
            const partList = configMap[type];
            const partConfig = partList.reduce((configSet, command) => {
                if (!isArray(command)) return configSet;
                const [path, value] = command;
                _.set(configSet, path.split('>>'), value);
                return configSet;
            }, {});
            return partConfig;
        }
    }
    return {};
}

export function getTypeConfig(type) {
    if (type) {
        const partConfig = getPartConfig(type);
        const fullConfig = mergeConfig(config, partConfig);
        return fullConfig;
    }
    return deepCopyObj(config);
}

export const defaultConfig = deepCopyObj(config);
