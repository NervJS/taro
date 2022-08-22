import { networkInterfaces } from 'os'

export function getOpenHost () {
  let result
  const interfaces = networkInterfaces()
  for (const devName in interfaces) {
    const isEnd = interfaces[devName]?.some(item => {
      // 取IPv4, 不为127.0.0.1的内网ip
      if (['IPv4', 4, '4'].includes(item.family) && item.address !== '127.0.0.1' && !item.internal) {
        result = item.address
        return true
      }
      return false
    })
    // 若获取到ip, 结束遍历
    if (isEnd) {
      break
    }
  }
  return result
}

export const PLAYGROUNDREPO = 'https://github.com/wuba/taro-playground'

export const PLAYGROUNDINFO = `use [Taro Playground App](${PLAYGROUNDREPO}) to scan`

export const isWin = /^win/.test(process.platform)
