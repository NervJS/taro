import Taro from '../../index'

declare module '../../index' {
  interface TaroStatic {
    /**
     * @supported weapp, rn
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/env/envObj.html
     */
    env: {
      [key: string]: string | undefined
      /** 文件系统中的用户目录路径 (本地路径) */
      USER_DATA_PATH: string
    }
  }
}
