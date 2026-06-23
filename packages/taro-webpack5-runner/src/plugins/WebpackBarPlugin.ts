const WebpackBarPlugin = require('webpackbar')

/**
 * 避免因持久化缓存 IdleFileCachePlugin 再度触发 progress 事件，
 * 导致 webpackbar 在 100% 后又再渲染的问题
 */
export class TaroWebpackBarPlugin extends WebpackBarPlugin {
  private isFinish: boolean

  callReporters (fn, payload) {
    if (fn === 'start') {
      this.isFinish = false
    } else if (fn === 'done') {
      this.isFinish = true
    }
    super.callReporters(fn, payload)
  }

  updateProgress () {
    if (this.isFinish) return
    super.updateProgress(...arguments)
  }
}
