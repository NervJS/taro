declare namespace Taro {
  /** 创建音视频处理容器，最终可将容器中的轨道合成一个视频
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/wx.createMediaContainer.html
   */
  function createMediaContainer(): MediaContainer

  /** 创建音视频处理容器，最终可将容器中的轨道合成一个视频
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

  /** 可通过 [MediaContainer.extractDataSource](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaContainer.extractDataSource.html) 返回。
   * [MediaTrack](https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html) 音频或视频轨道，可以对轨道进行一些操作
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/media/video-processing/MediaTrack.html
   */
  interface MediaTrack {
    /** 轨道长度
     * @readonly
     */
    duration: number
    /** 轨道类型
     * @readonly
     */
    kind: keyof MediaTrack.kind
    /** 音量，音频轨道下有效，可写 */
    volume: number
  }
  namespace MediaTrack {
    interface kind {
      /** 音频轨道 */
      audio
      /** 视频轨道 */
      video
    }
  }
}
