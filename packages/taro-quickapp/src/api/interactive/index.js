import prompt from '@system.prompt'

import appGlobal from '../../global'

export function showToast (options = {}) {
  const { title = '', duration = 1500, success, complete, fail } = options
  const res = { errMsg: 'showToast:ok' }

  return new Promise((resolve, reject) => {
    try {
      prompt.showToast({
        message: title,
        duration
      })
      success && success(res)
      complete && complete(res)
      resolve(res)
    } catch (data) {
      res.errMsg = 'showToast: error'
      res.data = data
      fail && fail(res)
      reject(res)
    }
  })
}

export function showModal (options = {}) {
  const {
    title = '',
    content = '',
    showCancel = true,
    cancelText = '取消',
    cancelColor = '#000000',
    confirmText = '确定',
    confirmColor = '#3CC51F',
    success,
    fail,
    complete
  } = options

  const res = { errMsg: 'showModel:ok', confirm: false, cancel: false }

  const btnList = [{text: confirmText, color: confirmColor}]
  showCancel && btnList.push({text: cancelText, color: cancelColor})

  return new Promise((resolve, reject) => {
    prompt.showDialog({
      title: title,
      message: content,
      buttons: btnList,
      success: (data) => {
        if (showCancel) {
          res.confirm = data.index === 0
          res.cancel = data.index === 1
        } else {
          res.confirm = true
        }
        success && success(res)
        complete && complete(res)
        resolve(res)
      },
      cancel: () => {
        success && success(res)
        complete && complete(res)
        res.cancel = true
        resolve(res)
      },
      fail: (data, code) => {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        reject(res)
        console.log(`handling fail, code = ${code}`, data)
      }
    })
  })
}

export function showActionSheet (options = {}) {
  const {
    itemList,
    itemColor = '#000000',
    success,
    fail,
    complete
  } = options

  const res = { errMsg: 'showActionSheet:ok' }

  return new Promise((resolve, reject) => {
    if (!itemList) {
      console.warn('itemList必传')
      res.errMsg = 'itemList必传'
      reject(res)
      return
    }
    prompt.showContextMenu({
      itemList,
      itemColor,
      success: (data) => {
        res.tapIndex = data.index
        success && success(res)
        complete && complete(res)
        resolve(res)
      },
      cancel: () => {
        res.errMsg = 'cancelActionSheet: success'
        success && success(res)
        complete && complete(res)
        res.tapIndex = -1
        resolve(res)
      },
      fail: (data, code) => {
        res.errMsg = data
        res.code = code
        complete && complete(res)
        fail && fail(res)
        reject(res)
        console.log(`handling fail, code = ${code}`, data)
      }
    })
  })
}

function setNavigationBar (params, fnName) {
  const { success, complete, fail } = params
  const res = { errMsg: `${fnName}: ok` }
  return new Promise((resolve, reject) => {
    try {
      appGlobal.eventCenter.trigger('TaroEvent:setNavigationBar', params)
      success && success(res)
      complete && complete(res)
      resolve(res)
    } catch (data) {
      res.errMsg = `${fnName}: error`
      res.data = data
      fail && fail(res)
      reject(res)
    }
  })
}

export function setNavigationBarTitle (params) {
  setNavigationBar(params, 'setNavigationBarTitle')
}

export function setNavigationBarColor (params) {
  setNavigationBar(params, 'setNavigationBarColor')
}

export function startPullDownRefresh (options = {}) {
  const { success, complete, fail } = options
  const res = { errMsg: `startPullDownRefresh: ok` }
  return new Promise((resolve, reject) => {
    try {
      appGlobal.eventCenter.trigger('TaroPage:startPullDownRefresh')
      success && success(res)
      complete && complete(res)
      resolve(res)
    } catch (data) {
      res.errMsg = 'startPullDownRefresh: error'
      res.data = data
      fail && fail(res)
      reject(res)
    }
  })
}

export function stopPullDownRefresh (options = {}) {
  const { success, complete, fail } = options
  const res = { errMsg: `stopPullDownRefresh: ok` }
  return new Promise((resolve, reject) => {
    try {
      appGlobal.eventCenter.trigger('TaroPage:stopPullDownRefresh')
      success && success(res)
      complete && complete(res)
      resolve(res)
    } catch (data) {
      res.errMsg = 'stopPullDownRefresh: error'
      res.data = data
      fail && fail(res)
      reject(res)
    }
  })
}

export default {
  showToast,
  showModal,
  showActionSheet,
  setNavigationBarTitle,
  setNavigationBarColor,
  startPullDownRefresh,
  stopPullDownRefresh
}
