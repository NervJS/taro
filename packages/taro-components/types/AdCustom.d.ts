/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
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

import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
import { AdProps } from './Ad'
interface AdCustomProps extends StandardProps {
  /** 广告单元id，可在[小程序管理后台](https://mp.weixin.qq.com/)的流量主模块新建
   * @supported weapp
   */
  unitId: string

  /** 广告自动刷新的间隔时间，单位为秒，参数值必须大于等于30（该参数不传入时 Banner 广告不会自动刷新）
   * @supported weapp
   */
  adIntervals?: number

  /** 广告加载成功的回调
   * @supported weapp
   */
  onLoad?: CommonEventFunction

  /** 当广告发生错误时，触发的事件，可以通过该事件获取错误码及原因
   * @supported weapp
   */
  onError?: CommonEventFunction<AdProps.onErrorEventDetail>
}

/** Banner 广告
 * @classification open
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *       <AdCustom
 *         unitId=''
 *         adIntervals={60}
 *         onLoad={() => console.log('ad onLoad')}
 *         onError={() => console.log('ad onError')}
 *         onClose={() => console.log('ad onClose')}
 *       />
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/ad.html
 */
declare const AdCustom: ComponentType<AdCustomProps>
export { AdCustom, AdCustomProps }
