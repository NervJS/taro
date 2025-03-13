import '@tarojs/taro'

declare module '@tarojs/taro' {
  interface TaroStatic {
    triggerTaskPoolMethods(option: {
      name?: string
      args?: any[]
      complete?: (res: any) => void
      fail?: (res: any) => void
      success?: (res: any) => void
    }): Promise<any>
  }
}
