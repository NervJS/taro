import Taro from '../../index'

declare module '../../index' {
  namespace Worker {
    type OnMessageCallback = (
      result: OnMessageCallbackResult,
    ) => void
    interface OnMessageCallbackResult {
      /** 主线程/Worker 线程向当前线程发送的消息 */
      message: TaroGeneral.IAnyObject
    }
  }
  interface Worker {
    /** 监听主线程/Worker 线程向当前线程发送的消息的事件。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.onMessage.html
     */
    onMessage(
      /** 主线程/Worker 线程向当前线程发送的消息的事件的回调函数 */
      callback: Worker.OnMessageCallback,
    ): void
    /** 监听 worker 线程被系统回收事件（当 iOS 系统资源紧张时，worker 线程存在被系统回收的可能，开发者可监听此事件并重新创建一个 worker）
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.onProcessKilled.html
     */
    onProcessKilled(
      /** worker 线程被系统回收事件的回调函数 */
      callback: Worker.OnMessageCallback,
    ): void
    /** 向主线程/Worker 线程发送的消息。
     * @supported weapp
     * @example
     * worker 线程中
     *
     * ```tsx
     * worker.postMessage({
     *   msg: 'hello from worker'
     * })
     * ```
     *
     * 主线程中
     *
     * ```tsx
     * const worker = Taro.createWorker('workers/request/index.js')
     * worker.postMessage({
     *   msg: 'hello from main'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.postMessage.html
     */
    postMessage(
      /** 需要发送的消息，必须是一个可序列化的 JavaScript key-value 形式的对象。 */
      message: TaroGeneral.IAnyObject,
    ): void
    /** 结束当前 Worker 线程。仅限在主线程 worker 对象上调用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/worker/Worker.terminate.html
     */
    terminate(): void
  }

  interface TaroStatic {
    /** 创建一个 Worker 线程。目前限制最多只能创建一个 Worker，创建下一个 Worker 前请先调用 [Worker.terminate](/docs/apis/worker/#terminate)
     * @supported weapp
     * @example
     * ```tsx
     * const worker = Taro.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
     *   worker.onMessage(function (res) {
     *   console.log(res)
     * })
     * worker.postMessage({
     *   msg: 'hello worker'
     * })
     * worker.terminate()
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/worker/wx.createWorker.html
     */
    createWorker(
      /** worker 入口文件的**绝对路径** */
      scriptPath: string,
    ): Worker
  }
}
