import Taro from '@tarojs/taro'

declare module '@tarojs/taro' {
  interface TaroStatic {
    initTabBarApis(config: AppConfig): void
  }
}

