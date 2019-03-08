import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface CoverViewProps extends StandardProps {

  /**
   * 设置顶部滚动偏移量，仅在设置了 overflow-y: scroll 成为滚动元素后生效
   */
  scrollTop?: number
}

export interface CoverImageProps extends StandardProps {

  /**
   * 图标路径，支持临时路径、网络地址（1.6.0起支持）。暂不支持base64格式。
   */
  src: string

  /**
   * 	图片加载成功时触发
   */
  onLoad?: CommonEventFunction,

  /**
   * 图片加载失败时触发
   */
  onError?: CommonEventFunction
}

declare const CoverView: ComponentType<CoverViewProps>

declare const CoverImage: ComponentType<CoverImageProps>

export { CoverView, CoverImage }
