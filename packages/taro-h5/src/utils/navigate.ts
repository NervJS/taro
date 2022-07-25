import MobileDetect from 'mobile-detect'

let md: MobileDetect
let preTitle = document.title

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
