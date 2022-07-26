/**
 * 图形通用动画方法
 * 主函数是 addAnimate 其余的都是工具函数，服务于主函数
 *  const {
        animation: {
             entry: anim_entry_list
        },
    } = configData
    获取每个图形对应的动画列表
 *   const animType_list = setAnimType(anim_entry_list);

    给组中的每个元素添加动画效果，animType_list(参数可以省略默认shape)
 *    addAnimate(child, animType_list('shape'))
 *
 */

import { Group, Sector } from '../shape';

/**
 * 图形对应的动画列表  返回一个函数
 * @param {*} anim_entry_list 动画列表
 * @return {object} --- 获取指定图形的动画列表 animType_list('shape') = ['grow', 'fadeIn'];
 */
export function setAnimType(anim_entry_list) {
    class GetAnimList{
        constructor(){
            this.type_list = {};
            this.init();
          
        }
        init(){
            anim_entry_list.forEach((item) => {
                const tar = item.target;
                const type = item.character || 'fadeIn';
                if (!this.type_list[tar]) {
                    this.type_list[tar] = [type];
                } else {
                    // 避免动画样式重复
                    if (this.type_list[tar].indexOf(type) === -1) {
                        this.type_list[tar].push(type);
                    }
                }
            });
        }
        //获取图形对应的动画列表
        getAnim(shapeName = 'shape'){
            
            return this.type_list[shapeName];
        }
        //删除图形动画列表里的默认动画效果['grow', 'fadeIn',...];
        delAnim(shape_anim_list, eleName){
            if(shape_anim_list instanceof Array && shape_anim_list.length){
                 const name_index = shape_anim_list.indexOf(eleName);
                 name_index>=0 && shape_anim_list.splice(name_index, 1);
                return name_index !== -1;
            }
            
        }
    }

    return new GetAnimList();
}

/**
 * 遍历组，为子元素添加动画效果
 * @method addAnimate 添加动画
 * @param {*} child 被添加对象
 * @param {Array} animList  动画数组列表['grow', 'fadeIn']
 */
export function addAnimate(child, animList, time = 800, delay = 300, easing) {

    if(!Array.isArray(animList)){

        animList = ['fadeIn'];
        console.error(' Parameter animList  must be an array');
    }

    if (child.name.match(/(point|dataText|guideLine)/g)) {
        perAnimation({ child, time, delay, animList: ['fadeIn'], aFun: mergeAnim, easing });
    } else {
        perAnimation({ child, time, delay, animList, aFun: mergeAnim, easing });
    }
}

/**
 * @method perAnimation 遍历动画
 * @param {*} child 被添加对象
 * @param {*} time 动画时间
 * @param {*} delay 延时
 * @param {*} aFun 动画方法
 */
function perAnimation({ child, time, delay, animList, aFun, easing }) {
    if (child instanceof Group) {
        child.eachChild((child) => perAnimation({ child, time, delay, animList, aFun, easing }));
    } else {
        aFun({ child, time, delay, animList, easing });
    }
}

/**
 * 合并动画效果
 * @param {*} child
 * @param {*} time
 * @param {*} delay
 * @param {*} animList
 */

function mergeAnim({ child, time, delay, animList, easing = 'linear' }) {
    const animOpts = {};

    animList.forEach((animType) => {
        mergeType(animType, child);
    });

    function mergeType(animType, child) {
        //如果 animType 是对象格式， 解析对象名称和对象值
        let _animType = animType;
        if(animType instanceof Object){
            _animType =  animType.name;
            animType.fn(animOpts, child)
        }else{
            switch (_animType) {
                case 'rotation':
                    if (!child.origin) {
                        let _cx = child.shape.cx;
                        let _cy = child.shape.cy;
                        child.origin = [_cx, _cy];
                    }
                    const _endAngle = child.endAngle;
                    child.rotation = child.startAngle;
                    animOpts.rotation = _endAngle;
                    easing = 'cubicInOut';
                    break;
                case 'grow':
                    const endAngle = child?.shape?.endAngle;
                    if(!endAngle){
                        console.error('Type of animation ‘grow’ is not found endAngle');
                        break;
                    }
                    child.shape.endAngle = child.shape.startAngle;
                    animOpts.shape = {
                        ...animOpts.shape,
                        endAngle,
                    };
                    easing = 'cubicInOut';
                    break;
                case 'fadeIn':
                    const endOpacity = child.style.opacity || 1;
                    child.style.opacity = 0;
                    animOpts.style = {
                        ...animOpts.style,
                        opacity: endOpacity,
                    };
                    break;
                case 'unfold':
                    let cx = child.shape.cx;
                    let cy = child.shape.cy;
                    const _scale = child.scale;
                    if (!child.origin) {
                        child.origin = [cx, cy];
                    }
                    child.scale = [0, 0];
                    animOpts.scale = String(_scale) === '0,0' ? [1, 1] : _scale;

                    break;

                    default:
                    break;
            }
        }

    }

    child.animateTo(animOpts, {
        duration: time,
        delay,
        easing,
        done: () => {},
    });
}

/**
 * @method fadeIn 渐隐渐现
 * @param {*} child 被添加对象
 * @param {*} duration 动画时间
 * @param {*} delay 延时
 */
function fadeIn(child, duration, delay) {
    let endOpacity = child.style.opacity;
    child.style.opacity = 0;
    child.animateTo(
        {
            style: {
                opacity: endOpacity,
            },
        },
        { duration, delay },
    );
}


