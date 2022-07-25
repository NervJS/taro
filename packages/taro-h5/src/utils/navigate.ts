import MobileDetect from 'mobile-detect'

let md: MobileDetect
let preTitle = document.title
let isLoadDdEntry = false

export function getMobileDetect (): MobileDetect {
  if (!md) {
    md = new MobileDetect(navigator.userAgent)
  }
  return md
}

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
  return title
}

export function isWeixin (): boolean {
  const md = getMobileDetect()
  return md.match(/MicroMessenger/ig)
}

export function isDingTalk (): boolean {
  const md = getMobileDetect()
  return md.match(/DingTalk/ig)
}
