/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

declare namespace Taro {
	namespace OpenUrl {
		interface Option {
			/** 跳转链接 */
			url: string
			/** 接口调用结束的回调函数（调用成功、失败都会执行） */
			complete?: (res: TaroGeneral.CallbackResult) => void
			/** 接口调用失败的回调函数 */
			fail?: (res: TaroGeneral.CallbackResult) => void
			/** 接口调用成功的回调函数 */
			success?: (res: TaroGeneral.CallbackResult) => void
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
