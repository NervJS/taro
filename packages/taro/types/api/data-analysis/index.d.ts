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

import Taro from '../../index'

declare module '../../index' {
  interface TaroStatic {
    /** 自定义业务数据监控上报接口。
     *
     * **使用说明**
     * 使用前，需要在「小程序管理后台-运维中心-性能监控-业务数据监控」中新建监控事件，配置监控描述与告警类型。每一个监控事件对应唯一的监控ID，开发者最多可以创建128个监控事件。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.reportMonitor('1', 1)
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportMonitor.html
     */
     reportMonitor(
      /** 监控ID，在「小程序管理后台」新建数据指标后获得 */
      name: string,
      /** 上报数值，经处理后会在「小程序管理后台」上展示每分钟的上报总量 */
      value: number,
    ): void

    /** 自定义分析数据上报接口。使用前，需要在小程序管理后台自定义分析中新建事件，配置好事件名与字段。
     * @supported weapp, tt
     * @example
     * ```tsx
     * Taro.reportAnalytics('purchase', {
     *   price: 120,
     *   color: 'red'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportAnalytics.html
     */
    reportAnalytics(
      /** 事件名 */
      eventName: string,
      /** 上报的自定义数据，key 为配置中的字段名，value 为上报的数据。 */
      data: TaroGeneral.IAnyObject,
    ): void

    /** 事件上报
     * @supported weapp
     * @example
     * ```tsx
     * Taro.reportEvent('purchase', {
     *   price: 120,
     *   color: 'red'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.reportEvent.html
     */
    reportEvent(
      /** 事件名 */
      eventId: string,
      /** 上报的自定义数据，key 为配置中的字段名，value 为上报的数据。 */
      data: TaroGeneral.IAnyObject,
    ): void

    /** 给定实验参数数组，获取对应的实验参数值
     * @supported weapp
     * @example
     * ```tsx
     * Taro.getExptInfoSync(['color'])
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/data-analysis/wx.getExptInfoSync.html
     */
    getExptInfoSync(
      /** 实验参数数组，不填则获取所有实验参数 */
      keys?: Array<string>
    ): TaroGeneral.IAnyObject
  }
}
