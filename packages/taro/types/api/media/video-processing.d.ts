/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import Taro from '../../index'

declare module '../../index' {
  /** 创建音视频处理容器，最终可将容器中的轨道合成一个视频
   *
   * > 可通过 [Taro.createMediaContainer](./createMediaContainer) 创建
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.html
   */
  interface MediaContainer {
    /** 将音频或视频轨道添加到容器
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.addTrack.html
     */
    addTrack(
      /** 要添加的音频或视频轨道 */
      track: MediaTrack,
    ): void
    /** 将容器销毁，释放资源
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.destroy.html
     */
    destroy(): void
    /** 将容器内的轨道合并并导出视频文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.export.html
     */
    export(): void
    /** 将传入的视频源分离轨道。不会自动将轨道添加到待合成的容器里。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.extractDataSource.html
     */
    extractDataSource(option: MediaContainer.ExtractDataSourceOption): void
    /** 将音频或视频轨道从容器中移除
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.removeTrack.html
     */
    removeTrack(
      /** 要移除的音频或视频轨道 */
      track: MediaTrack,
    ): void
  }

  namespace MediaContainer {
    interface ExtractDataSourceOption {
      /** 视频源地址，只支持本地文件 */
      source: string
    }
  }

  /** 可通过 [MediaContainer.extractDataSource](/docs/apis/media/video-processing/MediaContainer#extractdatasource) 返回。
   * [MediaTrack](/docs/apis/media/video-processing/MediaTrack) 音频或视频轨道，可以对轨道进行一些操作
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html
   */
  interface MediaTrack {
    /** 轨道类型
     * @readonly
     */
    kind: keyof MediaTrack.Kind
    /** 轨道长度
     * @readonly
     */
    duration: number
    /** 音量，音频轨道下有效，可写 */
    volume: number
  }
  namespace MediaTrack {
    interface Kind {
      /** 音频轨道 */
      audio
      /** 视频轨道 */
      video
    }
  }

  interface TaroStatic {
    /** 创建音视频处理容器，最终可将容器中的轨道合成一个视频
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/wx.createMediaContainer.html
     */
    createMediaContainer(): MediaContainer
  }
}
