import _ from 'lodash';
import { defaultConfig } from '../configSet/defaultConfig';
import { deepCopyObj, isObject, isArray } from './base';

// merge with
export function mergeConfig(target, source) {
    return _.mergeWith(deepCopyObj(target), source, (objValue, srcValue) => {
        if (Array.isArray(objValue)) {
            if (Array.isArray(srcValue) && srcValue.length > 0) {
                return srcValue;
            } else {
                return objValue;
            }
        }
    });
}

export function mergeAttr(target, source) {
    return _.mergeWith(deepCopyObj(target), source, (objValue, srcValue) => {
        if (_.isArray(objValue)) {
            return srcValue;
        }
    });
}

export function diffConfig(newObj, oldObj = {}) {
    if (_.isEmpty(oldObj)) return newObj;
    // console.time('diffConfig');
    let result = {};
    // 取得 newObj 相对于 oldObj 的 value 修改的值，以及 oldObj 不存在的值
    const getNewMatch = (_keyPath = '') => (newValue, key) => {
        const keyPath = _keyPath === '' ? key : `${_keyPath}.${key}`;
        if (isObject(newValue)) {
            _.forIn(newValue, getNewMatch(keyPath));
            return true;
        }
        const oldValue = _.get(oldObj, keyPath, Symbol('emptyMark'));
        // value is array: set
        if (isArray(newValue) && isArray(oldValue)) {
            if (newValue.every((newValue, index) => newValue === oldValue[index])) {
                return true;
            }
            _.set(result, keyPath, newValue);
            return true;
        }
        // oldValue does not equal: set
        if (newValue !== oldValue) {
            _.set(result, keyPath, newValue);
            return true;
        }
        // equal give up
        return true;
    };
    _.forIn(newObj, getNewMatch());
    // 取得 result 相对于 oldObj 缺少的值，赋值默认。
    const getOldMiss = (_keyPath = '') => (oldValue, key) => {
        const keyPath = _keyPath === '' ? key : `${_keyPath}.${key}`;
        if (isObject(oldValue)) {
            _.forIn(oldValue, getOldMiss(keyPath));
        }
        const emptyMark = Symbol('emptyMark');
        const newValue = _.get(newObj, keyPath, emptyMark);
        // if res miss old value
        if (newValue === emptyMark) {
            _.set(result, keyPath, _.get(defaultConfig, keyPath, null));
            return true;
        }
        return true;
    };
    _.forIn(oldObj, getOldMiss());
    // console.timeEnd('diffConfig');
    return deepCopyObj(result);
}

export function diffData(newData, oldData = {}) {
    if (_.isEmpty(oldData)) return newData;
    return newData;
}
