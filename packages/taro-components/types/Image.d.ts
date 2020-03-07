import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

interface ImageProps extends StandardProps {
  /** 图片资源地址
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  src: string

  /** 图片裁剪、缩放的模式
   * @default "scaleToFill"
   * @supported weapp, h5, rn, swan, alipay, tt
   * @rn 部分支持 scaleToFill, aspectFit, aspectFill, widthFix
   */
  mode?: keyof ImageProps.mode

	/** 默认不解析 webP 格式，只支持网络资源
   * @default false
   * @supported weapp
	 */
	webp?: boolean

  /** 图片懒加载。只针对 page 与 scroll-view 下的 image 有效
   * @default false
   * @supported weapp, swan, alipay, tt
   */
  lazyLoad?: boolean

  /** 开启长按图片显示识别小程序码菜单
   * @default false
   * @supported weapp
   */
  showMenuByLongpress?: boolean

  /** 当错误发生时，发布到 AppService 的事件名，事件对象
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  onError?: CommonEventFunction<ImageProps.onErrorEventDetail>

  /** 当图片载入完毕时，发布到 AppService 的事件名，事件对象
   * @supported weapp, h5, rn, swan, alipay, tt
   */
  onLoad?: CommonEventFunction<ImageProps.onLoadEventDetail>
}

declare namespace ImageProps {
  /** mode 的合法值 */
  interface mode {
    /** 缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素 */
    scaleToFill
    /** 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。 */
    aspectFit
    /** 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 */
    aspectFill
    /** 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变 */
    widthFix
    /** 裁剪模式，不缩放图片，只显示图片的顶部区域 */
    top
    /** 裁剪模式，不缩放图片，只显示图片的底部区域 */
    bottom
    /** 裁剪模式，不缩放图片，只显示图片的中间区域 */
    center
    /** 裁剪模式，不缩放图片，只显示图片的左边区域 */
    left
    /** 裁剪模式，不缩放图片，只显示图片的右边区域 */
    right
    /** 裁剪模式，不缩放图片，只显示图片的左上边区域 */
    'top left'
    /** 裁剪模式，不缩放图片，只显示图片的右上边区域 */
    'top right'
    /** 裁剪模式，不缩放图片，只显示图片的左下边区域 */
    'bottom left'
    /** 裁剪模式，不缩放图片，只显示图片的右下边区域 */
    'bottom right'
  }
  interface onErrorEventDetail {
    /** 错误信息 */
    errMsg: string
  }
  interface onLoadEventDetail {
    /** 图片高度 */
    height: number | string
    /** 图片宽度 */
    width: number | string
  }
}

/** 图片。支持 JPG、PNG、SVG、WEBP、GIF 等格式以及云文件ID。
 * 
 * **Note:** 为实现小程序的 `mode` 特性，在 H5 组件中使用一个 `div` 容器来对内部的 `img` 进行展示区域的裁剪，因此请勿使用元素选择器来重置 `img` 的样式！
 * @classification media
 * @supported weapp, h5, rn, swan, alipay, tt
 * @example
 * ```tsx
 * export default class PageView extends Component {
 *   constructor() {
 *     super(...arguments)
 *   }
 * 
 *   render() {
 *     return (
 *       <View className='components-page'>
 *         <Image
 *           style='width: 300px;height: 100px;background: #fff;'
 *           src='nerv_logo.png'
 *         />
 *         <Image
 *           style='width: 300px;height: 100px;background: #fff;'
 *           src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
 *         />
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/image.html
 */
declare const Image: ComponentType<ImageProps>

export { Image, ImageProps }
