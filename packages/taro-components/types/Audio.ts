import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

/**
 * 音频。
 * 注意：1.6.0 版本开始，该组件不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
 * @deprecated
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/component/audio.html}
 */
export interface AudioProps extends StandardProps {

  /**
   * audio 组件的唯一标识符
   */
  id: string,

  /**
   * 要播放音频的资源地址
   */
  src: string,

  /**
   * 是否循环播放
   * 默认值：`false`
   */
  loop: boolean,

  /**
   * 是否显示默认控件
   */
  controls: boolean,

  /**
   * 默认控件上的音频封面的图片资源地址，如果 controls 属性值为 false 则设置 poster 无效
   */
  poster: string,

  /**
   * 默认控件上的音频名字，如果 controls 属性值为 false 则设置 name 无效
   * 默认值：`未知音频`
   */
  name: string,

  /**
   * 默认控件上的作者名字，如果 controls 属性值为 false 则设置 author 无效
   * 默认值：`未知作者`
   */
  author: string,

  /**
   * 当发生错误时触发 error 事件，detail = {errMsg: MediaError.code}
   */
  onError?: CommonEventFunction,

  /**
   * 当开始/继续播放时触发play事件
   */
  onPlay?: CommonEventFunction,

  /**
   * 当暂停播放时触发 pause 事件
   */
  onPause?: CommonEventFunction,

  /**
   * 当播放进度改变时触发 timeupdate 事件，detail = {currentTime, duration}
   */
  onTimeUpdate?: CommonEventFunction,

  /**
   * 当播放到末尾时触发 ended 事件
   */
  onEnded?: CommonEventFunction
}

declare const Audio: ComponentType<AudioProps>

export { Audio }
