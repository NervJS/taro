/**
 * 支持冒泡的事件, 除 支付宝小程序外，其余的可冒泡事件都和微信保持一致
 * 详见 见 https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html
 */
export const BUBBLE_EVENTS = new Set([
  'touchstart',
  'touchmove',
  'touchcancel',
  'touchend',
  'touchforcechange',
  'tap',
  'longpress',
  'longtap',
  'transitionend',
  'animationstart',
  'animationiteration',
  'animationend'
])
