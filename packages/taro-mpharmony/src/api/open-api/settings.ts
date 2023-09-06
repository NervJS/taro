// 设置
// null-implementation
export const openSetting = () =>
  Promise.resolve({
    authSetting: {},
    subscriptionsSetting: {},
  })

// null-implementation
export const getSetting = () =>
  Promise.resolve({
    authSetting: {},
    subscriptionsSetting: {},
    miniprogramAuthSetting: {},
  })
