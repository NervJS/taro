import Taro from '../../index'

declare module '../../index' {
  interface TaroStatic {
    /**
     * @supported weapp, h5, rn, harmony_hybrid
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/env/envObj.html
     */
    env: {
      [key: string]: string | undefined
      /** 框架 */
      FRAMEWORK: 'react' | 'preact' | 'nerv' | 'vue' | 'vue3'
      /** Taro 环境变量 */
      TARO_ENV: 'weapp' | 'h5' | 'rn' | 'swan' | 'alipay' | 'tt' | 'qq' | 'jd' | 'quickapp'
      /** 文件系统中的用户目录路径 (本地路径) */
      USER_DATA_PATH?: string
    }
  }
}
