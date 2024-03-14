import { eventCenter } from '@tarojs/runtime'

export const isWeixin = () => !!navigator.userAgent.match(/\bMicroMessenger\b/ig)
export const isDingTalk = () => !!navigator.userAgent.match(/\bDingTalk\b/ig)
let preTitle = document.title
let isLoadDdEntry = false

export function setMpaTitle (title: string): void {
  if (preTitle === title) return
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
}

export function setTitle (title: string): void {
  eventCenter.trigger('__taroH5SetNavigationBarTitle', title)
}

export function setNavigationBarStyle (option: { backgroundColor: string, frontColor: string }):void {
  eventCenter.trigger('__taroH5setNavigationBarColor', option)
}

export function setNavigationBarLoading (loading: boolean): void {
  eventCenter.trigger('__taroH5setNavigationBarLoading', loading)
}