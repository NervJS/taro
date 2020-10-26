declare namespace Taro {
  /**
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/env/envObj.html
   */
  abstract class env {
    /** 文件系统中的用户目录路径 (本地路径) */
    static USER_DATA_PATH: string
  }
}
