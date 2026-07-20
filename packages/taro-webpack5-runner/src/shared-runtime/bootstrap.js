/**
 * 方案二 · bootstrap —— 决定同步激活还是异步拉子包
 * 小程序只支持 require.async(注册过的分包路径)，不支持 import().then。
 * 'shared-async/index' 由 webpack config 配成 promise-external，编译成 require.async(相对路径)。
 */
function ensureAsync (shared) {
  if (shared.__reactAlreadyReal) {
    // 方案一：framework/reconciler 真身已在全局 → 无需异步
    return
  }
  require('shared-async/index').then(function () {
    if (typeof shared.__activateAsync === 'function') {
      shared.__activateAsync()
    } else {
      console.error('[taro-shared] shared-async loaded but __activateAsync missing')
    }
  }).catch(function (e) {
    console.error('[taro-shared] require.async shared-async failed >>>', (e && e.errMsg) || (e && e.message) || e)
  })
}

module.exports = { ensureAsync: ensureAsync }
