import prompt from '@system.prompt'
import { generateUnSupportApi } from '../utils'

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

export function setNavigationBarTitle (options = {}) {
  const { title = '', success, complete, fail } = options
  const res = { errMsg: 'setNavigationBarTitle: ok' }

  return new Promise((resolve, reject) => {
    try {
      this.$page.setTitleBar({text: title})
      success && success(res)
      complete && complete(res)
      resolve(res)
    } catch (data) {
      res.errMsg = 'setNavigationBarTitle: error'
      res.data = data
      fail && fail(res)
      reject(res)
    }
  })
}

export function setNavigationBarColor (options = {}) {
  const { frontColor = '', backgroundColor = '', success, complete, fail } = options
  const res = { errMsg: 'setNavigationBarColor: ok' }

  return new Promise((resolve, reject) => {
    try {
      this.$page.setTitleBar({textColor: frontColor, backgroundColor})
      success && success(res)
      complete && complete(res)
      resolve(res)
    } catch (data) {
      res.errMsg = 'setNavigationBarColor: error'
      res.data = data
      fail && fail(res)
      reject(res)
    }
  })
}

let unSupportApis = ['hideToast', 'showLoading', 'hideLoading', 'showNavigationBarLoading', 'hideNavigationBarLoading']
unSupportApis = generateUnSupportApi(
  '快应用暂不支持Toast等隐藏方法',
  unSupportApis
)

const toast = {
  showToast,
  showModal,
  showActionSheet,
  setNavigationBarTitle,
  setNavigationBarColor
}

Object.assign(toast, unSupportApis)

export default toast
