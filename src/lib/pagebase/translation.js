/**
 * 页面切换效果
 * 平移
 * @return {[type]} [description]
 */

import { config } from '../config/index'

let calculateContainer
let offsetLeft
let offsetRight
let offsetCut
let prevEffect
let currEffect
let nextEffect
let prefix = Xut.plat.prefixStyle
let xxtTrans = (offset) => {
    offset = config.virtualMode ? offset / 2 : offset;
    return "translate3d(" + offset + "px, 0, 0)";
}
let dydTransform = (distance) => {
    distance = config.virtualMode ? distance / 2 : distance;
    return prefix('transform') + ':' + 'translate3d(' + distance + 'px,0px,0px)'
}


/**
 * 设置基本参数
 * @return {[type]} [description]
 */
let initOptions = () => {
    calculateContainer = config.proportion.calculateContainer()
    offsetLeft = (-1 * calculateContainer.width)
    offsetRight = calculateContainer.width
    offsetCut = 0
    prevEffect = xxtTrans(offsetLeft)
    currEffect = xxtTrans(offsetCut)
    nextEffect = xxtTrans(offsetRight)
}


/**
 * 切换坐标
 * @param  {[type]} context  [description]
 * @param  {[type]} distance [description]
 * @param  {[type]} speed    [description]
 * @param  {[type]} element  [description]
 * @return {[type]}          [description]
 */
let toTranslate3d = (context, distance, speed, element) => {
    distance = config.virtualMode ? distance / 2 : distance;
    if (element = element || context.element || context.$contentProcess) {
        element.css(prefix('transform'), 'translate3d(' + distance + 'px,0px,0px)');
        if (config.pageFlip) {
            //修正pageFlip切换页面的处理
            //没有翻页效果
            if (distance === 0) {
                var cur = Xut.sceneController.containerObj('current')
                cur.vm.$globalEvent.setAnimComplete(element);
            }
        } else {
            element.css(prefix('transition-duration'), speed + "ms")
        }
    }
}


/**
 * 复位
 * @return {[type]} [description]
 */
let reset = (context) => {
    var element
    if (element = context.element || context.$contentProcess) {
        element.css(prefix('transition-duration'), '');
        element.css(prefix('transform'), 'translate3d(0px,0px,0px)');
    }
}


/**
 * 移动
 * @return {[type]} [description]
 */
let flipMove = (context, distance, speed, element) => {
    toTranslate3d(context, distance, speed, element)
}


/**
 * 移动反弹
 * @return {[type]} [description]
 */
let flipRebound = (context, distance, speed, element) => {
    toTranslate3d(context, distance, speed, element)
}


/**
 * 移动结束
 * @return {[type]} [description]
 */
let flipOver = (context, distance, speed, element) => {
    //过滤多个动画回调，保证指向始终是当前页面
    if (context.pageType === 'page') {
        if (distance === 0) { //目标页面传递属性
            context.element.attr('data-view', true)
        }
    }
    toTranslate3d(context, distance, speed, element)
}


/**
 * translation滑动接口
 * @type {Object}
 */
export var translation = {
    reset: reset,
    flipMove: flipMove,
    flipRebound: flipRebound,
    flipOver: flipOver
}


/**
 * 修正坐标
 * @return {[type]} [description]
 */
export function fix(element, translate3d) {
    var transform = prefix('transform')
    var translate3d = translate3d === 'prevEffect' ? prevEffect : nextEffect
    element.css(transform, translate3d)
}


/**
 * 创建起始坐标
 * @return {[type]}
 */
export function createTransform(currPageIndex, createPageIndex) {
    initOptions();
    var translate3d, direction, offset;
    if (createPageIndex < currPageIndex) {
        translate3d = prevEffect;
        offset = offsetLeft;
        direction = 'before';
    } else if (createPageIndex > currPageIndex) {
        translate3d = nextEffect;
        offset = offsetRight;
        direction = 'after';
    } else if (currPageIndex == createPageIndex) {
        translate3d = currEffect;
        offset = offsetCut;
        direction = 'original';
    }
    return [translate3d, direction, offset, dydTransform];
}
