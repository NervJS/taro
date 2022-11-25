import { ComponentType } from 'react'
import { StandardProps } from './common'
interface RtcRoomItemProps extends StandardProps {
  /** rtc-room-item 组件的唯一标识符
   * @supported swan
   */
  id?: string

  /** 指定 item 展示本地 / 远端画面，有效值：local、remote ，不可动态变更
   * @supported swan
   */
  type?: string

  /** item 展示画面的用户 id
   * @supported swan
   */
  userId?: number
}

/** 实时音视频通话画面
 * @classification media
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/media_rtc-room-item/
 */
declare const RtcRoomItem: ComponentType<RtcRoomItemProps>
export { RtcRoomItem, RtcRoomItemProps }
