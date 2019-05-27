import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface ImageProps extends StandardProps {

  /**
   * 图片资源地址
   */
  src: string,

  /**
   * 图片裁剪、缩放的模式
   *
   * 默认值：`scaleToFill`
   */
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' |
    'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' |
    'bottom left' | 'bottom right',

  /**
   * 图片懒加载。只针对page与scroll-view下的image有效
   *
   * 默认值：`false`
   */
  lazyLoad?: boolean,

  /**
   * 当错误发生时，发布到 AppService 的事件名，事件对象
   *
   * event.detail = {errMsg: 'something wrong'}
   */
  onError?: CommonEventFunction,

  /**
   * 当图片载入完毕时，发布到 AppService 的事件名，事件对象
   *
   * event.detail = {height:'图片高度px', width:'图片宽度px'}
   */
  onLoad?: CommonEventFunction
}

declare const Image: ComponentType<ImageProps>

export { Image }
