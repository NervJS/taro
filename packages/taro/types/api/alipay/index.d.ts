declare namespace Taro {
  /**
   * 此接口可获取支付宝会员的基础信息（头像图片地址、昵称、性别、国家码、省份、所在市区），接入方法请参考 获取会员基础信息介绍。如需获取支付宝会员标识（user_id），请调用 my.getAuthCode 和 alipay.system.oauth.token 接口。
   * @supported alipay
   * @see https://docs.alipay.com/mini/api/ch8chh
   */
  function getOpenUserInfo(): Promise<string>
}
