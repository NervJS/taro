import Taro from '@tarojs/taro'

declare module '@tarojs/taro' {
  namespace getSystemInfoSync {
    interface Result {
      /** 宿主 APP 名称，详情见 [appName 说明](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/device/system-information/tt-get-system-info/#appName-%E8%AF%B4%E6%98%8E) */
      appName?: string
    }
  }

  namespace getSystemInfo {
    interface Result {
      /** 宿主 APP 名称，详情见 [appName 说明](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/device/system-information/tt-get-system-info-sync/#appName-%E8%AF%B4%E6%98%8E) */
      appName?: string
    }
  }
}
