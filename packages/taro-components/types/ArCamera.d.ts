import { ComponentType } from 'react'
import { StandardProps } from './common'
interface ArCameraProps extends StandardProps {
  /** AR 项目唯一标识，在 DuMixAR 内容开放平台上传生成 AR 项目后获取 AR Key
   * @supported swan
   */
  key?: string

  /** AR 相机类型，在 DuMixAR 内容开放平台上传生成 AR 项目后获取 AR Type：
   * 2D 跟踪类型：0
   * SLAM 类型：5
   * IMU 类型：8
   * @supported swan
   */
  type?: '0' | '5' | '8'

  /** 闪光灯，值为 auto、on、off
   * @supported swan
   * @default "off"
   */
  flash?: 'auto' | 'on' | 'off'

  /** 用户不允许使用摄像头或扫码失败时触发
   * @supported swan
   */
  onError?: CommonEventFunction

  /** AR 加载成功时触发
   * @supported swan
   */
  onLoad?: CommonEventFunction

  /** 开发者制作 AR 项目时可自定义按键，用户点击时会收到事件和数据，用户自定义事件格式参见代码示例 2：用户自定义事件
   * @supported swan
   */
  onMessage?: CommonEventFunction

  /** 扫描识图结束后触发
   * @supported swan
   */
  onScanCode?: CommonEventFunction
}

/** AR 相机
 * @classification media
 * @supported swan
 * @see https://smartprogram.baidu.com/docs/develop/component/media_ar-camera/
 */
declare const ArCamera: ComponentType<ArCameraProps>
export { ArCamera, ArCameraProps }
