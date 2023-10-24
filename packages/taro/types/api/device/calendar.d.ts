import Taro from '../../index'

declare module '../../index' {
  namespace addPhoneRepeatCalendar {
    interface Option {
      /** 日历事件标题 */
      title: string
      /** 开始时间的 unix 时间戳 (1970年1月1日开始所经过的秒数) */
      startTime: number
      /** 是否全天事件
       * @default false
       */
      allDay?: boolean
      /** 事件说明 */
      description?: string
      /** 事件位置 */
      location?: string
      /** 结束时间的 unix 时间戳，默认与开始时间相同 */
      endTime?: string
      /** 是否提醒
       * @default true
       */
      alarm?: boolean
      /** 提醒提前量，单位秒，默认 0 表示开始时提醒
       * @default 0
       */
      alarmOffset?: number
      /** 重复周期，默认 month 每月重复
       * @default "month"
       */
      repeatInterval?: keyof RepeatInterval
      /** 重复周期结束时间的 unix 时间戳，不填表示一直重复 */
      repeatEndTime?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
    }
    interface RepeatInterval {
      /** 每天重复 */
      day
      /** 每周重复 */
      week
      /** 每月重复。该模式日期不能大于 28 日 */
      month
      /** 每年重复 */
      year
    }
  }

  namespace addPhoneCalendar {
    interface Option {
      /** 日历事件标题 */
      title: string
      /** 开始时间的 unix 时间戳 (1970年1月1日开始所经过的秒数) */
      startTime: number
      /** 是否全天事件
       * @default false
       */
      allDay?: boolean
      /** 事件说明 */
      description?: string
      /** 事件位置 */
      location?: string
      /** 结束时间的 unix 时间戳，默认与开始时间相同 */
      endTime?: string
      /** 是否提醒
       * @default true
       */
      alarm?: boolean
      /** 提醒提前量，单位秒，默认 0 表示开始时提醒
       * @default 0
       */
      alarmOffset?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
  }

  interface TaroStatic {
    /** 向系统日历添加重复事件
     * @supported weapp, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/calendar/wx.addPhoneRepeatCalendar.html
     */
    addPhoneRepeatCalendar(option: addPhoneRepeatCalendar.Option): Promise<TaroGeneral.CallbackResult>
    /** 向系统日历添加事件
     * @supported weapp, tt, h5
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/device/calendar/wx.addPhoneCalendar.html
     */
    addPhoneCalendar(option: addPhoneCalendar.Option): Promise<TaroGeneral.CallbackResult>
  }
}
