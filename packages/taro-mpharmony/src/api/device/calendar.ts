/**
 * 向系统日历添加重复事件
 * 
 * @canUse addPhoneRepeatCalendar
 * @__object [title, startTime, allDay, description, location, endTime, alarm, alarmOffset, repeatInterval, repeatEndTime]
 */
export { addPhoneRepeatCalendar } from '@tarojs/taro-h5'

/**
 * 向系统日历添加事件
 * 
 * @canUse addPhoneCalendar
 * @__object [title, startTime, allDay, description, location, endTime, alarm, alarmOffset]
 */
export { addPhoneCalendar } from '@tarojs/taro-h5'
