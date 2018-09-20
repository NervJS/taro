import prompt from '@system.prompt'
import {generateUnSupportApi} from "../utils"

export function showToast (options = {}) {

  const { title = '', duration = 1500 } = options

  prompt.showToast({
    message: title,
    duration: duration > 2000 ? 1 : 0
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
    confirmColor = '#3CC51F'
  } = options

  const res = { errMsg: 'showModel:ok', confirm: false, cancel: false }

  const btnList = [{text: confirmText, color: confirmColor}]
  showCancel && btnList.unshift({text: cancelText, color: cancelColor})

  return new Promise((resolve, reject) => {
    prompt.showDialog({
      title: title,
      message: content,
      buttons: btnList,
      success: (data) => {
        success && success(res)
        complete && complete(res)
        if (showCancel) {
          res.confirm = data.index === 1
          res.cancel = data.index === 0
        } else {
          res.confirm = true
        }
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
        reject(res)
        console.log(`handling fail, code = ${code}`, data)
      }
    })
  })
}

let unSupportApis = ['hideToast', 'showLoading', 'hideLoading']
unSupportApis = generateUnSupportApi(
  '快应用暂不支持storage的同步存取',
  unSupportApis
)

const toast = {
  showToast,
  showModal
}

Object.assign(toast, unSupportApis)

export default toast
