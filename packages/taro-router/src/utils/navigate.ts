import { eventCenter } from "@tarojs/runtime"

let preTitle = document.title
let isLoadDdEntry = false

export const isWeixin = () => !!navigator.userAgent.match(/\bMicroMessenger\b/ig)
export const isDingTalk = () => !!navigator.userAgent.match(/\bDingTalk\b/ig)

export async function setTitle (title: string): Promise<string> {
  if (preTitle === title) return title
  document.title = title
  preTitle = title
  if (process.env.SUPPORT_DINGTALK_NAVIGATE !== 'disabled' && isDingTalk()) {
    if (!isLoadDdEntry) {
      isLoadDdEntry = true
      require('dingtalk-jsapi/platform')
    }
    const setDingTitle = require('dingtalk-jsapi/api/biz/navigation/setTitle').default
    setDingTitle({ title })
  }
  eventCenter.trigger('__taroH5SetNavigationTitle', title)
  return title
}
