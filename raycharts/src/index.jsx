import React from 'react';
import styles from './index.less';
import _ from 'lodash';
import RayChart from './RayChart';
import { defaultConfig, getTypeConfig } from './configSet';

import { configPretreat } from './data';
import { mergeConfig, flexBoxLayout, base } from './utils';
const { isNumber, isArray, isObject } = base;

// 图标最外层，本层只处理多个 chartData 的图表切换问题
// 确保传入下一层的 chartData 为对象，合并 config 文件，config 文件预处理
// 用 chartData 驱动图表的分块绘制
class RayCharts extends React.Component {
    static defaultProps = {
        dots: true,
        dotPosition: 'top-right',
        width: 400,
        height: 250,
        chartData: [],
        configData: {},
    };

    constructor(props) {
        super();
        this.state = {
            dotIndex: 0,
            dotLength: props?.chartData?.length ?? 0,
            chartData: this.dataListPreCheck(props?.chartData),
            configData: this.configPreCheck(props?.configData),
        };
    }

    goTo(slideNumber) {
        if (!isNumber(slideNumber + 0) || isNaN(slideNumber + 0)) return false;
        const { dotLength } = this.state;
        const targetNum = Math.max(Math.min(slideNumber + 0, dotLength - 1), 0);
        this.setState({ dotIndex: targetNum });
        return true;
    }

    dataListPreCheck(chartData) {
        if (!isArray(chartData)) return [];
        const checkedData = chartData.filter((item) => isObject(item));
        return checkedData;
    }

    configPreCheck(configData) {
        const type = configData?._type ?? defaultConfig._type;
        const currConfig = getTypeConfig(type);
        const fullConfig = mergeConfig(currConfig, configData);
        return configPretreat(fullConfig, configData);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const currProps = this.props;

        // 数据改变 更新长度
        if (!_.isEqual(currProps.chartData, nextProps.chartData)) {
            const checkedData = this.dataListPreCheck(nextProps.chartData);
            this.setState({ dotLength: checkedData.length, chartData: checkedData }, () => {
                this.goTo(nextState.dotIndex);
            });
        }
        // config 更新后更新到本地
        if (!_.isEqual(currProps.configData, nextProps.configData)) {
            this.setState({ configData: this.configPreCheck(nextProps.configData) });
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        const currState = this.state;
    }

    render() {
        const { dotIndex, dotLength, configData, chartData } = this.state;
        const { width, height } = this.props;
        const zoom = Math.min(width / 400, height / 250);
        return (
            <div className={styles.charts_box}>
                {this.props?.configData?._type ? (
                    <RayChart
                        {...this.props}
                        zoom={zoom}
                        configData={configData}
                        chartData={chartData?.[dotIndex] ?? {}}
                    />
                ) : (
                    <div></div>
                )}
                <div className={styles.dot_box} style={flexBoxLayout(this.props.dotPosition)}>
                    {dotLength === 0 || dotLength === 1
                        ? null
                        : new Array(dotLength)
                              .fill(null)
                              .map((_item, index) => (
                                  <button
                                      key={index}
                                      style={{ zoom }}
                                      data-act={dotIndex === index}
                                      onClick={() => this.setState({ dotIndex: index })}
                                  ></button>
                              ))}
                </div>
            </div>
        );
    }
}

RayCharts.defaultConfig = defaultConfig;

RayCharts.getTypeConfig = getTypeConfig;

export { getTypeConfig, defaultConfig };

export default RayCharts;
