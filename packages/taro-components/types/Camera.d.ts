import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface CameraProps extends StandardProps {

  /**
   * 模式，有效值为normal, scanCode
   * 默认值：`normal`
   * 最低版本：2.1.0
   */
  mode?: 'normal' | 'scanCode'

  /**
   * 前置或后置，值为front, back
   *
   * 默认值：`front`
   */
  devicePosition?: 'front' | 'back',

  /**
   * 闪光灯，值为auto, on, off
   *
   * 默认值：`auto`
   */
  flash?: 'auto' | 'on' | 'off',

  /**
   * 扫码识别区域，格式为[x, y, w, h]，
   * x,y是相对于camera显示区域的左上角，
   * w,h为区域宽度，单位px，仅在 mode="scanCode" 时生效
   * 最低版本：2.1.0
   */
  scanArea?: number[]

  /**
   * 摄像头在非正常终止时触发，
   * 如退出后台等情况
   */
  onStop?: CommonEventFunction,

  /**
   * 用户不允许使用摄像头时触发
   */
  onError?: CommonEventFunction

  /**
   * 在成功识别到一维码时触发，
   * 仅在 mode="scanCode" 时生效
   * 最低版本：2.1.0
   */
  onScanCode?: CommonEventFunction
}

declare const Camera: ComponentType<CameraProps>

export { Camera }
