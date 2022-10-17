import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface CameraProps extends StandardProps {
  /** 模式，有效值为normal, scanCode
   * @default "normal"
   * @supported weapp, tt, qq, jd, rn, alipay
   */
  mode?: keyof CameraProps.Mode

  /** 分辨率，不支持动态修改
   * @default "medium"
   * @supported weapp, tt, alipay
   */
  resolution?: keyof CameraProps.Resolution

  /** 摄像头朝向
   * @default "back"
   * @supported weapp, swan, tt, qq, jd, rn, alipay
   */
  devicePosition?: keyof CameraProps.DevicePosition

  /** 闪光灯
   * @default "auto"
   * @supported weapp, swan, tt, qq, jd, rn, alipay
   */
  flash?: keyof CameraProps.Flash

  /** 相机拍照，录制的分辨率。有效值为 360P、540P、720P、1080P、max
   * @default "720P"
   * @supported alipay
   */
  outputDimension?: '360P'|'540P'|'720P'|'1080P'|'max'

  /** 指定期望的相机帧数据尺寸
   * @default "medium"
   * @supported weapp, tt, alipay
   */
  frameSize?: keyof CameraProps.FrameSize

  /** 摄像头在非正常终止时触发，
   * 如退出后台等情况
   * @supported weapp, swan, tt, qq, jd, rn, alipay
   */
  onStop?: CommonEventFunction

  /** 用户不允许使用摄像头时触发
   * @supported weapp, swan, tt, qq, jd, rn, alipay
   */
  onError?: CommonEventFunction

  /** 相机初始化完成时触发
   * @supported weapp, tt, rn
   */
  onInitDone?: CommonEventFunction<CameraProps.onInitDoneEventDetail>

  /** 相机初始化完成时触发
   * @supported alipay
   */
  onReady?: CommonEventFunction<CameraProps.onInitDoneEventDetail>

  /** 在成功识别到一维码时触发，
   * 仅在 mode="scanCode" 时生效
   * @supported weapp, tt, qq, rn, alipay
   */
  onScanCode?: CommonEventFunction<CameraProps.onScanCodeEventDetail>
}
declare namespace CameraProps {
  /** mode 的合法值 */
  interface Mode {
    /** 相机模式 */
    normal

    /** 扫码模式 */
    scanCode
  }

  /** resolution 的合法值 */
  interface Resolution {
    /** 低 */
    low

    /** 中 */
    medium

    /** 高 */
    high
  }

  /** device-position 的合法值 */
  interface DevicePosition {
    /** 前置 */
    front

    /** 后置 */
    back
  }

  /** flash 的合法值 */
  interface Flash {
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
  interface FrameSize {
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

  interface onScanCodeEventDetail {
    /** 字符集 */
    charSet: string

    /** 原始数据
     * @supported weapp
     */
    rawData: string

    /** 码类型 */
    type: string

    /** 识别结果 */
    result: string

    /** 识别结果(完整)
     * @supported alipay
     */
    fullResult: string
  }
}

/** 系统相机
 * @classification media
 * @supported weapp, rn, tt
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/camera.html
 */
declare const Camera: ComponentType<CameraProps>
export { Camera, CameraProps }
