import { permanentlyNotSupport,temporarilyNotSupport } from '../../utils'

// 转发

/** 更新转发属性 */
export const updateShareMenu = temporarilyNotSupport('updateShareMenu')

/** 显示当前页面的转发按钮 */
export const showShareMenu = temporarilyNotSupport('showShareMenu')

/** 打开分享图片弹窗，可以将图片发送给朋友、收藏或下载 */
export const showShareImageMenu = temporarilyNotSupport('showShareImageMenu')

/** 转发视频到聊天 */
export const shareVideoMessage = temporarilyNotSupport('shareVideoMessage')

/** 转发文件到聊天 */
export const shareFileMessage = temporarilyNotSupport('shareFileMessage')

/** 监听用户点击右上角菜单的「复制链接」按钮时触发的事件 */
export const onCopyUrl = temporarilyNotSupport('onCopyUrl')

/** 移除用户点击右上角菜单的「复制链接」按钮时触发的事件的监听函数 */
export const offCopyUrl = temporarilyNotSupport('offCopyUrl')

/** 隐藏当前页面的转发按钮 */
export const hideShareMenu = temporarilyNotSupport('hideShareMenu')

/** 获取转发详细信息 */
export const getShareInfo = temporarilyNotSupport('getShareInfo')

/** 验证私密消息。 */
export const authPrivateMessage = permanentlyNotSupport('authPrivateMessage')
