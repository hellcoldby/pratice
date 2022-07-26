/**
 * 装饰器 - 处理数据的转换
 * 把配置数据转换成渲染数据，
 * 并且注入到生命周期中。
 * @param {*} pipe
 * @returns
 */
const parse = (pipe) => (Origin) => {
    if (pipe ?? typeof pipe === 'function') {
        return class extends Origin {
            constructor(props) {
                const newConfig = pipe(props);
                super(newConfig);
            }
            update(props) {
                const newConfig = pipe(props);
                super.update(newConfig);
            }
        };
    }
    return Origin;
};

export default parse;
