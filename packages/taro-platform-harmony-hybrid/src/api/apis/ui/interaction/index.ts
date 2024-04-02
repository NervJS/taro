// 交互
/**
 * 显示消息提示框
 * 
 * @canUse showToast 
 * @__object [title, duration, icon[success, error, loading, none], image, mask]
 */
export { showToast } from '@tarojs/taro-h5'

/**
 * 隐藏消息提示框
 * 
 * @canUse hideToast 
 * @__object [noConflict]
 */
export { hideToast } from '@tarojs/taro-h5'

/**
 * 显示 loading 提示框
 * 
 * @canUse showLoading
 * @__object [title, mask]
 */
export { showLoading } from '@tarojs/taro-h5'

/**
 * 隐藏 loading 提示框
 * 
 * @canUse hideLoading 
 * @__object [noConflict] 
 */
export { hideLoading } from '@tarojs/taro-h5'

/**
 * 显示模态对话框
 * 
 * @canUse showModal
 * @__object [cancelColor, cancelText, confirmColor, confirmText, content, showCancel, title] 
 * @__success [cancel, confirm]
*/
export { showModal } from '@tarojs/taro-h5'


/**
 * 显示操作菜单
 * 
 * @canUse showActionSheet 
 * @__object [alertText, itemList, itemColor] 
 * @__success [tapIndex]
 */
export { showActionSheet } from '@tarojs/taro-h5'

/**
 * 开启小程序页面返回询问对话框
 * 
 * @canUse enableAlertBeforeUnload
 * @null_implementation 
 */
const enableAlertBeforeUnload = () => { }

/**
 * 关闭小程序页面返回询问对话框
 * 
 * @canUse disableAlertBeforeUnload
 * @null_implementation 
 */
const disableAlertBeforeUnload = () => { }

export {
  disableAlertBeforeUnload,
  enableAlertBeforeUnload,
}
