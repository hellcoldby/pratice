/*
 * Description:
 * Author: vicky
 * Date: 2021-08-12 13:16:33
 * LastEditTime: 2021-11-25 17:43:10
 * FilePath: \packages\raycharts\src\configSet\partConfig.js
 */
/**
 * name: type,
 * value: {Array || Object}
 * value[Object]: 合并的部分配置
 * value[Array]: 二维数组，第一维是路径，第二维是默认值
 */
// 示例
// export const v_bar = { general: { graph_width: 40 } };
// export const h_bar = [['general>>graph_width', 40]];

export const multi_pie = [['general>>s_angle', 90]];
export const pie = [['general>>s_angle', 90]];
export const wordCloud = [
    ['legend>>visible', false],
    ['analysis>>sort', 'maxToMin'],
    ['general>>highlight_max', true],
    [
        'animation>>entry',
        [
            {
                target: 'shape',
                character: 'fadeIn',
            },
        ],
    ],
];
export const liquidFill = [
    ['general>>r', 90],
    ['general>>area>>visible', true],
    ['general>>slot>>border>>line_width', 1],
];

export const scatter = [
    ['legend>>visible', false],
    [
        'animation>>entry',
        [
            {
                target: 'shape',
                character: 'fadeIn',
            },
        ],
    ],
];

export const rose = [
    ['general>>area>>visible', true],
    ['general>>s_angle', 90],
];

export const boxplot = [['general>>border>>line_width', 1]];

export const radar = [
    [
        'animation>>entry',
        [
            {
                target: 'shape',
                character: 'fadeIn',
            },
        ],
    ],
];
