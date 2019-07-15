import { Video } from 'expo-av'

const globalAny:any = global;

globalAny._taroVideoMap = {}

interface FullScreenObject {
  direction?: number
}

interface DanmuData {
  text: string,
  color?: string
}

class VideoContext {

  private videoRef: any

  constructor (videoRef) {
    this.videoRef = videoRef
  }

  /**
   * 退出全屏
   */
  async exitFullScreen () {
    try {
      await this.videoRef.dismissFullscreenPlayer()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 隐藏状态栏，仅在iOS全屏下有效
   * @todo
   */
  hideStatusBar () {

  }

  /**
   * 暂停视频
   */
  async pause () {
    try {
      await this.videoRef.pauseAsync()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 播放视频
   */
  async play () {
    try {
      await this.videoRef.playAsync()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 设置倍速播放
   * {number} @param rate - 倍率，支持 0.5/0.8/1.0/1.25/1.5，2.6.3 起支持 2.0 倍速
   */
  async playbackRate (rate: number) {
    try {
      await this.videoRef.setRateAsync(rate)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 进入全屏
   * @package {object} [object]
   * @package {number} [object.direction] - 设置全屏时视频的方向，不指定则根据宽高比自动判断。
   */
  async requestFullScreen (object: FullScreenObject) {
    try {
      await this.videoRef.presentFullscreenPlayer()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 跳转到指定位置
   * @param {number} position - 跳转到的位置，单位 s
   */
  async seek (position: number) {
    const millis = position * 1000
    try {
      await this.videoRef.setPositionAsync(millis)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 发送弹幕 ❌
   * @ todo
   * @deprecated 暂未实现
   * @param {DanmuData} data 弹幕内容
   * @param {string} data.text 弹幕文字
   * @param {string} data.color 弹幕颜色
   */
  sendDanmu (data: DanmuData) {

  }

  /**
   * 显示状态栏，仅在iOS全屏下有效
   * @todo
   */
  showStatusBar () {

  }

  /**
   * 停止视频
   */
  async stop () {
    try {
      await this.videoRef.stopAsync()
    } catch (e) {
      console.log(e)
    }
  }
}

/**
 * 创建 video 上下文 VideoContext 对象。
 * {string} @param - id video 组件的 id
 * {object} @param t - 在自定义组件下，当前组件实例的this，以操作组件内 video 组件
 */
export function createVideoContext (id: string, t: object) {
  const ref = globalAny._taroVideoMap[id]
  if (ref) {
    return new VideoContext(ref)
  } else {
    return undefined
  }
}
