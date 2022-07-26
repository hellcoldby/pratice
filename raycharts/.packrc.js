/*
 * Author: vicky
 * Date: 2022-07-20 15:16:00
 * LastEditTime: 2022-07-20 17:22:28
 * FilePath: \packages\raycharts\.packrc.js
 */
const isDev = process.env.NODE_ENV === 'dev';

module.exports = {
    formats: ['esm'],
    isMinify: !isDev,
    isStrip: !isDev,
    useExports: false,
};
