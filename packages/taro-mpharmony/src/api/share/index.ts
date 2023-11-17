import { permanentlyNotSupport, temporarilyNotSupport } from '../../utils'

/** 
 * 更新转发属性 
 * 
 * @canNotUse updateShareMenu
*/
export const updateShareMenu = /* @__PURE__ */ temporarilyNotSupport('updateShareMenu')

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
export const showShareImageMenu = /* @__PURE__ */ temporarilyNotSupport('showShareImageMenu')

/** 
 * 转发视频到聊天 
 * 
 * @canNotUse shareVideoMessage
*/
export const shareVideoMessage = /* @__PURE__ */ temporarilyNotSupport('shareVideoMessage')

/** 
 * 转发文件到聊天 
 * 
 * @canNotUse shareFileMessage
*/
export const shareFileMessage = /* @__PURE__ */ temporarilyNotSupport('shareFileMessage')

/** 
 * 监听用户点击右上角菜单的「复制链接」按钮时触发的事件 
 * 
 * @canNotUse onCopyUrl
*/
export const onCopyUrl = /* @__PURE__ */ temporarilyNotSupport('onCopyUrl')

/** 
 * 移除用户点击右上角菜单的「复制链接」按钮时触发的事件的监听函数 
 * 
 * @canNotUse offCopyUrl
*/
export const offCopyUrl = /* @__PURE__ */ temporarilyNotSupport('offCopyUrl')

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
export const authPrivateMessage = /* @__PURE__ */ permanentlyNotSupport('authPrivateMessage')
