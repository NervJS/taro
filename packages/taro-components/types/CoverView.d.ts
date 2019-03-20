import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export interface CoverViewProps extends StandardProps {
  /**
   * 设置顶部滚动偏移量，仅在设置了 overflow-y: scroll 成为滚动元素后生效
   */
  scrollTop?: number,

  /**
   * 指定按下去的样式类。当 `hover-class="none"` 时，没有点击态效果
   *
   * 默认值：`none`
   */
  hoverClass?: string,

  /**
   * 指定是否阻止本节点的祖先节点出现点击态
   *
   * 默认值：`fasle`
   */
  hoverStopPropagation?: boolean,

  /**
   * 按住后多久出现点击态，单位毫秒
   *
   * 默认值：`50`
   */
  hoverStartTime?: number,

  /**
   * 手指松开后点击态保留时间，单位毫秒
   *
   * 默认值：`400`
   */
  hoverStayTime?: number,
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
