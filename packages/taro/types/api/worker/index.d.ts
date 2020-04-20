declare namespace Taro {
  /**
   * @since 1.9.90
   *
   * 在使用 createWorker 前，请查阅 [多线程](https://developers.weixin.qq.com/miniprogram/dev/framework/workers.html) 文档了解基础知识和配置方法。
   *
   * 创建一个 Worker 线程，并返回 Worker 实例，目前限制最多只能创建一个 Worker，创建下一个 Worker 前请调用 Worker.terminate。
   *
   * `scriptPath` 为 worker 的入口文件路径，需填写绝对路径。
   *
   * **示例代码：**
   *
   ```javascript
   const worker = Taro.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
         worker.onMessage(function (res) {
     console.log(res)
   })
         worker.postMessage({
     msg: 'hello worker'
   })
         worker.terminate()
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/worker/wx.createWorker.html
   */
  function createWorker(scriptPath: any): Worker

  namespace Worker {
    namespace onMessage {
      type Param = (res: ParamParam) => any
      type ParamParam = {
        /**
         * Worker 线程向当前线程发送的消息
         */
        message: any
      }
    }
  }
  class Worker {
    /**
     * 向 Worker 线程发送的消息。
     *
     * **postMessage(message) 说明：**
     *
     * 向 Worker 线程发送消息，`message` 参数为需要发送的消息，必须是一个可序列化的 JavaScript 对象。
     */
    postMessage(Object: any): any
    /**
     * 监听 Worker 线程向当前线程发送的消息
     */
    onMessage(callback: Worker.onMessage.Param): any
    /**
     * 结束当前 Worker 线程，仅限在主线程 Worker 实例上调用。
     *
     * **terminate() 说明：**
     *
     * 结束当前 worker 线程，仅限在主线程 Worker 对象上调用。
     */
    terminate(): any
  }
}
