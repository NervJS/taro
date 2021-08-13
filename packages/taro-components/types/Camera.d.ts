import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface CameraProps extends StandardProps {
  /** 模式，有效值为normal, scanCode
   * @default "normal"
   * @supported weapp
   */
  mode?: keyof CameraProps.mode

  /** 分辨率，不支持动态修改
   * @default "medium"
   * @supported weapp
   */
  resolution?: keyof CameraProps.resolution

  /** 摄像头朝向
   * @default "back"
   * @supported weapp
   */
  devicePosition?: keyof CameraProps.devicePosition

  /** 闪光灯
   * @default "auto"
   * @supported weapp
   */
  flash?: keyof CameraProps.flash

  /** 指定期望的相机帧数据尺寸
   * @default "medium"
   * @supported weapp
   */
  frameSize?: keyof CameraProps.frameSize

  /** 扫码识别区域，格式为[x, y, w, h]，
   * x,y是相对于camera显示区域的左上角，
   * w,h为区域宽度，单位px，仅在 mode="scanCode" 时生效
   * @supported weapp
   */
  scanArea?: number[]

  /** 摄像头在非正常终止时触发，
   * 如退出后台等情况
   * @supported weapp
   */
  onStop?: CommonEventFunction

  /** 用户不允许使用摄像头时触发
   * @supported weapp
   */
  onError?: CommonEventFunction

  /** 相机初始化完成时触发
   * @supported weapp
   */
  onInitDone?: CommonEventFunction<CameraProps.onInitDoneEventDetail>

  /** 在成功识别到一维码时触发，
   * 仅在 mode="scanCode" 时生效
   * @supported weapp
   */
  onScanCode?: CommonEventFunction
}

declare namespace CameraProps {
  /** mode 的合法值 */
  interface mode {
    /** 相机模式 */
    normal
    /** 扫码模式 */
    scanCode
  }
  /** resolution 的合法值 */
  interface resolution {
    /** 低 */
    low
    /** 中 */
    medium
    /** 高 */
    high
  }
  /** device-position 的合法值 */
  interface devicePosition {
    /** 前置 */
    front
    /** 后置 */
    back
  }
  /** flash 的合法值 */
  interface flash {
    /** 自动 */
    auto
    /** 打开 */
    on
    /** 关闭 */
    off
    /** 常亮 */
    torch
  }
  /** frame-size 的合法值 */
  interface frameSize {
    /** 小尺寸帧数据 */
    small
    /** 中尺寸帧数据 */
    medium
    /** 大尺寸帧数据 */
    large
  }

  interface onInitDoneEventDetail {
    /** 最大变焦 */
    maxZoom: number
  }
}

/** 系统相机
 * @classification media
 * @supported weapp
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/camera.html
 */
declare const Camera: ComponentType<CameraProps>

export { Camera, CameraProps }
