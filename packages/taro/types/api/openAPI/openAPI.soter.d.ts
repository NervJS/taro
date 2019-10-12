declare namespace Taro {
  namespace startSoterAuthentication {
    type Promised = {
      /**
       * 错误码
       */
      errCode: number
      /**
       * 生物认证方式
       */
      authMode: string
      /**
       * 在设备安全区域（TEE）内获得的本机安全信息（如TEE名称版本号等以及防重放参数）以及本次认证信息（仅Android支持，本次认证的指纹ID）（仅Android支持，本次认证的指纹ID）
       *
       * **resultJSON 说明：**
       *
       * 此数据为设备TEE中，将传入的challenge和TEE内其他安全信息组成的数据进行组装而来的JSON，对下述字段的解释如表2。例子如下：
       *
       *   字段名    |  说明
       * ------------|-----------------------------------------------------
       *   raw       |  调用者传入的challenge
       *   fid       |（仅Android支持）本次生物识别认证的生物信息编号（如指纹识别则是指纹信息在本设备内部编号）
       *   counter   |  防重放特征参数
       *   tee_n     |  TEE名称（如高通或者trustonic等）
       *   tee_v     |  TEE版本号
       *   fp_n      |  指纹以及相关逻辑模块提供商（如FPC等）
       *   fp_v      |  指纹以及相关模块版本号
       *   cpu_id    |  机器唯一识别ID
       *   uid       |  概念同Android系统定义uid，即应用程序编号
       */
      resultJSON: string
      /**
       * 用SOTER安全密钥对result_json的签名(SHA256withRSA/PSS, saltlen=20)
       */
      resultJSONSignature: string
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 请求使用的可接受的生物认证方式
       */
      requestAuthModes: string[]
      /**
       * 挑战因子。挑战因子为调用者为此次生物鉴权准备的用于签名的字符串关键识别信息，将作为result_json的一部分，供调用者识别本次请求。例如：如果场景为请求用户对某订单进行授权确认，则可以将订单号填入此参数。
       */
      challenge: string
      /**
       * 验证描述，即识别过程中显示在界面上的对话框提示内容
       */
      authContent?: string
    }
  }
  /**
   * @since 1.5.0
   *
   * 开始 SOTER 生物认证
   *
   * **生物识别方式定义：**
   *
   *   mode          |  说明
   * ----------------|---------------
   *   fingerPrint   |  指纹识别
   *   facial        |人脸识别（暂未支持）
   *   speech        |声纹识别（暂未支持）
   *
   * **resultJSON 说明：**
   *
   ```json
   {
       "raw":"msg",
       "fid":"2",
       "counter":123,
       "tee_n":"TEE Name",
       "tee_v":"TEE Version",
       "fp_n":"Fingerprint Sensor Name",
       "fp_v":"Fingerprint Sensor Version",
       "cpu_id":"CPU Id",
       "uid":"21"
   }
   ```
   *
   * **示例代码：**
   *
   ```javascript
   Taro.startSoterAuthentication({
     requestAuthModes: ['fingerPrint'],
     challenge: '123456',
     authContent: '请用指纹解锁',
     success(res) {
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.startSoterAuthentication.html
   */
  function startSoterAuthentication(OBJECT: startSoterAuthentication.Param): Promise<startSoterAuthentication.Promised>

  namespace checkIsSupportSoterAuthentication {
    type Promised = {
      /**
       * 该设备支持的可被SOTER识别的生物识别方式
       *
       * **supportMode 有效值：**
       *
       *   值            |  说明
       * ----------------|---------------
       *   fingerPrint   |  指纹识别
       *   facial        |人脸识别（暂未支持）
       *   speech        |声纹识别（暂未支持）
       */
      supportMode: string[]
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {}
  }
  /**
   * @since 1.5.0
   *
   * 获取本机支持的 SOTER 生物认证方式
   *
   * **示例代码：**
   *
   ```javascript
   Taro.checkIsSupportSoterAuthentication({
       success(res) {
           // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
           // res.supportMode = ['fingerPrint'] 只支持指纹识别
           // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.checkIsSupportSoterAuthentication.html
   */
  function checkIsSupportSoterAuthentication(OBJECT?: checkIsSupportSoterAuthentication.Param): Promise<checkIsSupportSoterAuthentication.Promised>

  namespace checkIsSoterEnrolledInDevice {
    type Promised = {
      /**
       * 是否已录入信息
       */
      isEnrolled: boolean
      /**
       * 接口调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 认证方式
       *
       * **checkAuthMode 有效值：**
       *
       *   值            |  说明
       * ----------------|---------------
       *   fingerPrint   |  指纹识别
       *   facial        |人脸识别（暂未支持）
       *   speech        |声纹识别（暂未支持）
       */
      checkAuthMode: string
    }
  }
  /**
   * @since 1.6.0
   *
   * 获取设备内是否录入如指纹等生物信息的接口
   *
   * **示例代码：**
   *
   ```javascript
   Taro.checkIsSoterEnrolledInDevice({
       checkAuthMode: 'fingerPrint',
       success(res) {
           console.log(res.isEnrolled)
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/soter/wx.checkIsSoterEnrolledInDevice.html
   */
  function checkIsSoterEnrolledInDevice(OBJECT: checkIsSoterEnrolledInDevice.Param): Promise<checkIsSoterEnrolledInDevice.Promised>
}
