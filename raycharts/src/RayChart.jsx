import React from 'react';
import styles from './index.less';
import _ from 'lodash';
import * as zrender from 'zrender';

import { defaultConfig } from './configSet'; // 默认配置

import HoverLayer from './handler/HoverLayer';
import EntryLayout from './layout';

import { dataPreCheck, dataPretreat } from './data';
import { base } from './utils';
const { deepCopyObj } = base;

const limitValue = (per, limit) => (limit * per) / 100;
const fixRadius = (radius, offset) => (radius === 0 ? 0 : radius + offset);

const DevKey = '__RayChartsDev__';

class RayChart extends React.Component {
    static defaultProps = {
        zoom: 1,
        width: 400,
        height: 250,
        chartData: {},
        configData: deepCopyObj(defaultConfig),
    };

    constructor(props) {
        super();
        this.state = {
            width: props.width,
            height: props.height,
        };
        this.zr = null;
        this.ChartDom = null;
    }

    initContext(props) {
        if (this.ChartDom !== null) {
            const opts = this.props?.renderOpts ?? {};
            this.zr = zrender.init(this.ChartDom, {
                ...opts,
            });
            this.build(props);
        }
    }

    build(props) {
        const zr = this.zr;
        if (zr === null) return this.initContext(props);
        const info = {
            width: zr.getWidth(),
            height: zr.getHeight(),
            zoom: props.zoom,
            configData: props.configData,
            chartData: props.chartData,
            addHoverAction: this.hoverHandler?.addHoverAction ?? (() => null),
        };
        this.ChartEntry = new EntryLayout(info);
        zr.add(this.ChartEntry);
    }

    update(props) {
        const zr = this.zr;
        this.ChartEntry.updateGroup({
            // width: zr.getWidth(),
            // height: zr.getHeight(),
            zoom: props.zoom,
            configData: props.configData,
            chartData: props.chartData,
        });
    }

    resizeDom = _.debounce((props) => {
        this.setState({ width: props.width, height: props.height });
    }, 200);

    refresh(props) {
        this.zr.clear();
        this.hoverHandler && this.hoverHandler.reset();
        this.build(props);
    }

    componentDidMount() {
        this.initContext(this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const [currState, currProps] = [this.state, this.props];
        if (this.zr === null) {
            this.initContext(nextProps);
            return true;
        }
        // 更新节点大小
        if (currProps.width !== nextProps.width || currProps.height !== nextProps.height) {
            // console.log('dom resize');
            this.resizeDom(nextProps);
            return true;
        }
        // 更新配置
        if (!_.isEqual(currProps.configData, nextProps.configData)) {
            // console.log('configData');
            this.refresh(nextProps);
            // this.update(nextProps);
        }
        // 更新数据
        if (!_.isEqual(currProps.chartData, nextProps.chartData)) {
            // console.log('chartData');
            this.refresh(nextProps);
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        const [currState, currProps] = [this.state, this.props];
        // 更新画布大小
        if (prevState.width !== currState.width || prevState.height !== currState.height) {
            // console.log('canvas resize');
            this.zr.resize();
            this.refresh(currProps);
            // this.resizeCanvas(currProps);
        }
    }

    componentWillUnmount() {
        // dispose
        this.zr.dispose();
        this.zr = null;
    }

    render() {
        const { width, height } = this.state;
        const { configData, chartData } = this.props;
        // 圆角 投影
        const {
            border: {
                radius: { tleft, tright, bright, bleft },
                line_width,
            },
            inset: { h: insetH, v: insetV, blur: insetBlur },
            outset: { h: outsetH, v: outsetV, blur: outsetBlur },
        } = configData.background;
        const { outset: outSetColor, inset: inSetColor } = configData.default_theme.background;
        const rOffSet = limitValue(line_width, Math.min(width * 0.1, height * 0.1)) * 0.5;
        const baseStyle = {
            backgroundColor: 'transparent',
            borderRadius: `${fixRadius(tleft, rOffSet)}px ${fixRadius(
                tright,
                rOffSet,
            )}px ${fixRadius(bright, rOffSet)}px ${fixRadius(bleft, rOffSet)}px`,
            transition: `all 1s`,
        };
        const outsetStyle = {
            ...baseStyle,
            boxShadow: `${outsetH}px ${outsetV}px ${outsetBlur}px ${outSetColor}`,
        };
        const insetStyle = {
            ...baseStyle,
            boxShadow: `inset ${insetH}px ${insetV}px ${insetBlur}px ${inSetColor}`,
        };
        // 不使用 z-index 控制层级，使用节点先后顺序
        return (
            <div style={{ width, height }} className={styles.root_wrap}>
                <div
                    ref={(node) => (this.ChartDom = node)}
                    style={outsetStyle}
                    className={styles.root}
                ></div>
                {/* <div style={insetStyle} className={styles.root_inset}></div> */}
                <HoverLayer
                    boxSize={{ width, height }}
                    chartData={dataPretreat(chartData)}
                    configData={configData}
                    onRef={(ref) => (this.hoverHandler = ref)}
                />
                {/* {dataPreCheck(chartData) ? () : null} */}
            </div>
        );
    }
}

export default RayChart;
