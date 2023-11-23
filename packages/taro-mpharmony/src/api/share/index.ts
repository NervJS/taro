/** 
 * 更新转发属性 
 * 
 * @canNotUse updateShareMenu
*/
export { updateShareMenu } from '@tarojs/taro-h5'

/** 
 * 显示当前页面的转发按钮 
 * 
 * @canUse showShareMenu
 * @null_implementation
*/
export const showShareMenu = () => Promise.resolve({})

/** 
 * 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载 
 * 
 * @canNotUse showShareImageMenu
*/
export { showShareImageMenu } from '@tarojs/taro-h5'

/** 
 * 转发视频到聊天 
 * 
 * @canNotUse shareVideoMessage
*/
export { shareVideoMessage } from '@tarojs/taro-h5'

/** 
 * 转发文件到聊天 
 * 
 * @canNotUse shareFileMessage
*/
export { shareFileMessage } from '@tarojs/taro-h5'

/** 
 * 监听用户点击右上角菜单的「复制链接」按钮时触发的事件 
 * 
 * @canNotUse onCopyUrl
*/
export { onCopyUrl } from '@tarojs/taro-h5'

/** 
 * 移除用户点击右上角菜单的「复制链接」按钮时触发的事件的监听函数 
 * 
 * @canNotUse offCopyUrl
*/
export { offCopyUrl } from '@tarojs/taro-h5'

/** 
 * 隐藏当前页面的转发按钮 
 * 
 * @canUse hideShareMenu
 * @null_implementation
*/
export const hideShareMenu = () => Promise.resolve({})

/** 
 * 获取转发详细信息 
 * 
 * @canUse getShareInfo
 * @null_implementation 
*/
export const getShareInfo = () => Promise.resolve({})

/** 
 * 验证私密消息 
 * 
 * @canNotUse authPrivateMessage
*/
export { authPrivateMessage } from '@tarojs/taro-h5'
