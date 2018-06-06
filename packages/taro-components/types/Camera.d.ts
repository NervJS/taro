import { ComponentType } from 'react'
import { StandardProps, BaseEventFunction } from './common'

interface CameraProps extends StandardProps {
  
  /**
   * 前置或后置，值为front, back
   *
   * 默认值：`front`
   */
  devicePosition: 'front' | 'back', 
  
  /**
   * 闪光灯，值为auto, on, off  
   *
   * 默认值：`auto`
   */
  flash: 'auto' | 'on' | 'off',
  onStop: BaseEventFunction,
  
  /**
   * 用户不允许使用摄像头时触发
   */
  onError: BaseEventFunction
}

declare const Camera: ComponentType<CameraProps>

export { Camera }
