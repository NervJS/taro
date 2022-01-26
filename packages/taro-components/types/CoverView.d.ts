import { ComponentType } from 'react'
import { ViewProps } from './View'

interface CoverViewProps extends ViewProps {
  /** 设置顶部滚动偏移量，仅在设置了 overflow-y: scroll 成为滚动元素后生效
   * @supported weapp
   */
  scrollTop?: number

  /**
   * 适用于地图组件 map 的自定义气泡 customCallout
   * @supported weapp
   */
  markerId?: string

  /**
   * @supported weapp
   */
  slot?: string
}

/** 覆盖在原生组件之上的文本视图。可覆盖的原生组件包括 map、video、canvas、camera、live-player、live-pusher 只支持嵌套 cover-view、cover-image，可在 cover-view 中使用 button。
 * @classification viewContainer
 * @supported weapp, swan, alipay, h5
 * @example_react
 * ```tsx
 * // js
 * class App extends Components {
 *   render () {
 *     return (
 *       <View className='container'>
 *         <Video id='myVideo' src='src'>
 *           <CoverView className='controls'>
 *             <CoverView className='play' onClick='play'>
 *               <CoverImage className='img' src='src' />
 *             </CoverView>
 *           </CoverView>
 *         </Video>
 *       </View>
 *     )
 *   }
 * }
 * // css
 * .container {
 *   position: relative;
 * }
 * .controls {
 *   position: absolute;
 *   top: 50%;
 *   left: 50%;
 *   width: 300px;
 *   height: 225px;
 *   transform: translate(-50%, -50%);
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class="container">
 *     <video id='myvideo' src='https://ugccsy.qq.com/uwMROfz2r5zBIaQXGdGnC2dfDma3J1MItM3912IN4IRQvkRM/o31507f7lcd.mp4?sdtfrom=v1010&guid=aa18cf106b7fdb7e40f2d20b206f2b4f&vkey=63B0FCCC7FC3ADC342C166D86571AE02772258CD9B515B065DC68DF3919D8C288AE831D570ED5E8FE0FF3E81E170D04FF11F874BFDDACF7AAA2C0CFF2ACB39FB1A94DAD1AB859BDA53E4DD6DBCDC1217CEF789A9AC079924E2BBC599EED7A1FFDD60A727F2EB7E7B6472CE63DD4B683C9199DFC78A6A6C4D9891E05467C4B64E'>
 *     </video>
 *     <cover-view class='controls'>
 *       <cover-view class='play' `@tap='play'>
 *         <cover-image class='img' src='https://img10.360buyimg.com/ling/s345x208_jfs/t1/133501/7/9865/382161/5f5ee31fEbdd6a418/0cdc0156ffff3c23.png' />
 *       </cover-view>
 *     </cover-view>
 *   </view>
 * </template>
 * 
 * <style>
 * .container {
 *   position: relative;
 * }
 * .controls {
 *   position: absolute;
 *   top: 50%;
 *   left: 50%;
 *   width: 300px;
 *   height: 225px;
 *   transform: translate(-50%, -50%);
 * }
 * </style>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html
 */
declare const CoverView: ComponentType<CoverViewProps>

export { CoverView, CoverViewProps }
