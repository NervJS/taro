declare namespace Taro {
	namespace OpenUrl {
		interface Option {
			/** 跳转链接 */
			url: string
			/** 接口调用结束的回调函数（调用成功、失败都会执行） */
			complete?: (res: Taro.General.CallbackResult) => void
			/** 接口调用失败的回调函数 */
			fail?: (res: Taro.General.CallbackResult) => void
			/** 接口调用成功的回调函数 */
			success?: (res: Taro.General.CallbackResult) => void
		}
	}
	/**
	 * 由于 Expo 不支持原生的 SDK，所以无法通过集成原生的 SDK 的方式使用微信/支付宝支付。
	 * 所以 RN 端提供了 `Taro.openUrl({url:''})`的 API 打开手机浏览器，然后走 [手机网站支付](https://docs.open.alipay.com/203/105288/) 的流程。
	 * @param {Object} opts
	 * @param {string} [opts.url] 跳转链接
	 * @param {function} [opts.success] 接口调用成功的回调函数
	 * @param {function} [opts.fail] 接口调用失败的回调函数
	 * @param {function} [opts.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
	 */
	function openUrl<T>(opts: Taro.OpenUrl.Option): Promise<T>
}
