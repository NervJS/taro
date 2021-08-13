declare namespace Taro {
  namespace addPhoneContact {
    interface Option {
      /** 名字 */
      firstName: string
      /** 联系地址城市 */
      addressCity?: string
      /** 联系地址国家 */
      addressCountry?: string
      /** 联系地址邮政编码 */
      addressPostalCode?: string
      /** 联系地址省份 */
      addressState?: string
      /** 联系地址街道 */
      addressStreet?: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 电子邮件 */
      email?: string
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 住宅地址城市 */
      homeAddressCity?: string
      /** 住宅地址国家 */
      homeAddressCountry?: string
      /** 住宅地址邮政编码 */
      homeAddressPostalCode?: string
      /** 住宅地址省份 */
      homeAddressState?: string
      /** 住宅地址街道 */
      homeAddressStreet?: string
      /** 住宅传真 */
      homeFaxNumber?: string
      /** 住宅电话 */
      homePhoneNumber?: string
      /** 公司电话 */
      hostNumber?: string
      /** 姓氏 */
      lastName?: string
      /** 中间名 */
      middleName?: string
      /** 手机号 */
      mobilePhoneNumber?: string
      /** 昵称 */
      nickName?: string
      /** 公司 */
      organization?: string
      /** 头像本地文件路径 */
      photoFilePath?: string
      /** 备注 */
      remark?: string
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
      /** 职位 */
      title?: string
      /** 网站 */
      url?: string
      /** 微信号 */
      weChatNumber?: string
      /** 工作地址城市 */
      workAddressCity?: string
      /** 工作地址国家 */
      workAddressCountry?: string
      /** 工作地址邮政编码 */
      workAddressPostalCode?: string
      /** 工作地址省份 */
      workAddressState?: string
      /** 工作地址街道 */
      workAddressStreet?: string
      /** 工作传真 */
      workFaxNumber?: string
      /** 工作电话 */
      workPhoneNumber?: string
    }
  }

  /** 添加手机通讯录联系人。用户可以选择将该表单以「新增联系人」或「添加到已有联系人」的方式，写入手机系统通讯录。
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/contact/wx.addPhoneContact.html
   */
  function addPhoneContact(option: addPhoneContact.Option): Promise<General.CallbackResult>
}
