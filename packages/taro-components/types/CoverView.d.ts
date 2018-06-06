import { ComponentType } from 'react'
import { StandardProps } from './common'

interface CoverViewProps extends StandardProps {

}

interface CoverImageProps extends StandardProps {
  
  /**
   * 图标路径，支持临时路径、网络地址（1.6.0起支持）。暂不支持base64格式。
   */
  src: string
}

declare const CoverView: ComponentType<CoverViewProps>

declare const CoverImage: ComponentType<CoverImageProps>

export { CoverView, CoverImage }
