import { eventCenter } from "@tarojs/runtime"



export const isWeixin = () => !!navigator.userAgent.match(/\bMicroMessenger\b/ig)
export const isDingTalk = () => !!navigator.userAgent.match(/\bDingTalk\b/ig)

export function setTitle (title: string): void {
  eventCenter.trigger('__taroH5SetNavigationTitle', title)
}

export async function setNavigationBarStyle (option: { backgroundColor: string, frontColor: string }){
  eventCenter.trigger('__taroH5setNavigationBarColor', option)
}