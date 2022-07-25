import MobileDetect from 'mobile-detect'

let md: MobileDetect

export function getMobileDetect (): MobileDetect {
  if (!md) {
    md = new MobileDetect(navigator.userAgent)
  }
  return md
}

export function isWeixin (): boolean {
  const md = getMobileDetect()
  return md.match(/MicroMessenger/ig)
}

export function isDingding (): boolean {
  const md = getMobileDetect()
  return md.match(/DingTalk/ig)
}
