import Taro from '@tarojs/api'

function getReferrerInfo () {
  let referrerInfo
  try {
    // @ts-ignore
    const callerBundle = bundleMap.get('callerBundle')
    // @ts-ignore
    const callerParams = bundleMap.get('callerParams')

    referrerInfo = {
      referrerInfo: {
        appId: callerBundle || '',
        extraData: JSON.parse(callerParams),
      },
    }
  } catch (err) {
    referrerInfo = {
      referrerInfo: {
        appId: '',
        extraData: {},
      },
    }
  }
  return referrerInfo
}

let launchOptions
function initLaunchOptions (options = {}) {
  Object.assign(options, getReferrerInfo())
  launchOptions = options
}

Taro.eventCenter.once('__taroRouterLaunch', initLaunchOptions)

// 生命周期
export const getLaunchOptionsSync: typeof Taro.getLaunchOptionsSync = () => launchOptions
export const getEnterOptionsSync: typeof Taro.getEnterOptionsSync = () => launchOptions
