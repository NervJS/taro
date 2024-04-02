/**
 * 剪贴板部分的api参考了Chameleon项目的实现：
 *
 * setClipboardData: https://github.com/chameleon-team/chameleon-api/tree/master/src/interfaces/setClipBoardData
 * getClipboardData: https://github.com/chameleon-team/chameleon-api/tree/master/src/interfaces/getClipBoardData
 */
/**
 * 设置系统剪贴板的内容
 * 
 * @canUse setClipboardData
 * @__object [data]
 */
export { setClipboardData } from '@tarojs/taro-h5'

/**
 * 获取系统剪贴板的内容
 * 
 * @canUse getClipboardData
 * @__success [data]
 */
export { getClipboardData } from '@tarojs/taro-h5'
