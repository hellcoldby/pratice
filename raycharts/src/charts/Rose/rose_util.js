/**
 * 修复数据在象限中的位置
 * @param {number} qua 象限
 * @param {number} x x坐标
 * @param {number} y y坐标
 * @param {number} w 文字宽度
 * @param {number} h 文字高度
 * @returns
 */
export function fix_data_pos(qua, x, y, w, h) {
    let _x = x;
    let _y = y;
    switch (qua) {
        case 1: 
            _y -= h;
            break;
        case 2:
            _x -= w;
            _y -= h;
            break;
        case 3:
            _x -= w;
            break;
        default:
            break;
    }
    return { _x, _y };
}

export function fix_guide_pos(qua, x,y, w, h){
    let _x = x;
    let _y = y;
    switch (qua) {
        case 1:case 4:
            _y -= h;
            break;
        case 2: case 3:
            _x -= w;
            _y -= h;
            break;
        
    }
    return { _x, _y };
}

/**
 * 象限换算
 * 象限参考canvas 以x轴正方为起点，顺时针画圆
 * @param {number} rad 弧度
 */
export function quadrantConversion(rad) {
    let _rad = rad % (2* Math.PI);
    const PI= Math.PI;
  
    let qua = null;
    if ((0 < _rad && _rad <= PI/2) || (rad > -2*PI && rad <= -1.5*PI)) {
        // 第四象限
        qua = 4;
    } else if ((0.5*PI < _rad && _rad <= PI) || (rad > -1.5*PI && rad <= -PI)) {
        // 第三象限
        qua = 3;
    } else if ((PI < _rad && _rad <= 1.5*PI) || (rad > -PI && rad <= -0.5*PI)) {
        // 第二象限
        qua = 2;
    } else {
        // 第一象限
        qua = 1;
    }

    return qua;
}



/**
 * @method pointByRad
 * @description 根据中心点、半径和角度获取指定角度的点坐标
 * @author vicky
 * @param {*} cx
 * @param {*} cy
 * @param {*} r
 * @param {*} rad 弧度
 * @returns {Object} {x,y}
 */
 export function pointByRad(cx, cy, r, rad) {
    let x = cx + r * Math.cos(rad);
    let y = cy + r * Math.sin(rad);
    return { x, y };
}

/**
 * 反三角函数，边界值约束
 * @param {*} _x
 * @param {*} dir 左右方向
 * @returns
 */
 export function asin(_x, dir) {
    const x = _x < -1 ? -1 : _x > 1 ? 1 : _x;
    return dir === 1 ? Math.asin(x) : Math.PI - Math.asin(x);
}