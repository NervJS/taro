import Taro from '../../index'

declare module '../../index' {
  /** 用户加密模块
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/UserCryptoManager.html
   */
  interface UserCryptoManager {
    /** 获取最新的用户加密密钥
     * @supported weapp
     * @example
     * ```tsx
     * const userCryptoManager = Taro.getUserCryptoManager()
     * userCryptoManager.getLatestUserKey({
     *   success: res => {
     *     const { encryptKey, iv, version, expireTime } = res
     *     console.log(encryptKey, iv, version, expireTime)
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/UserCryptoManager.getLatestUserKey.html
     */
    getLatestUserKey(option: UserCryptoManager.getLatestUserKey.Option): Promise<UserCryptoManager.getLatestUserKey.SuccessCallbackResult>

    /** 获取密码学安全随机数
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getUserCryptoManager().getRandomValues({
     *   length: 6 // 生成 6 个字节长度的随机数,
     *   success: res => {
     *     console.log(Taro.arrayBufferToBase64(res.randomValues)) // 转换为 base64 字符串后打印
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/UserCryptoManager.getRandomValues.html
     */
    getRandomValues(option: UserCryptoManager.getRandomValues.Option): void
  }

  namespace UserCryptoManager {
    namespace getLatestUserKey {
      interface Option {
        /** 接口调用成功的回调函数 */
        success?: (res: SuccessCallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.CallbackResult) => void
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: SuccessCallbackResult) => void
      }

      interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
        /** 用户加密密钥 */
        encryptKey: string
        /** 密钥初始向量 */
        iv: string
        /** 密钥版本 */
        version: number
        /** 密钥过期时间 */
        expireTime: number
      }
    }

    namespace getRandomValues {
      interface Option {
        /** 整数，生成随机数的字节数，最大 1048576 */
        length: number
        /** 接口调用成功的回调函数 */
        success?: (res: SuccessCallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: TaroGeneral.CallbackResult) => void
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: SuccessCallbackResult) => void
      }

      interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
        /** 随机数内容，长度为传入的字节数 */
        randomValues: ArrayBuffer
      }
    }
  }

  interface TaroStatic {
    /** 获取用户加密模块
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/wx.getUserCryptoManager.html
     */
    getUserCryptoManager(): UserCryptoManager

    /** 获取密码学安全随机数
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getRandomValues({
     *   length: 6 // 生成 6 个字节长度的随机数
     * }).then(res => {
     *   console.log(Taro.arrayBufferToBase64(res.randomValues)) // 转换为 base64 字符串后打印
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/UserCryptoManager.getRandomValues.html
     */
    getRandomValues(option: UserCryptoManager.getRandomValues.Option): Promise<UserCryptoManager.getRandomValues.SuccessCallbackResult>
  }
}
