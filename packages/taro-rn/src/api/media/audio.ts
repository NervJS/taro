import { Audio } from 'expo-av'

/**
 * InnerAudioContext 实例，可通过 wx.createInnerAudioContext 接口获取实例。
 */
class InnerAudioContext {
  private src: string
  private startTime: number
  private autoplay: boolean
  private loop: boolean
  private obeyMuteSwitch: boolean
  private volume: number
  private duration: number
  private currentTime: number
  private paused: boolean
  private buffered: number

  constructor () {

  }
}

/**
 * 创建 audio 上下文 AudioContext 对象。
 * @param {string} id - audio 组件的 id
 * @param {object} t - 在自定义组件下，当前组件实例的this，以操作组件内 audio 组件
 */
export function createInnerAudioContext (id: string, t: object) {

}
