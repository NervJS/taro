/**
 * 剪贴板部分的api参考了Chameleon项目的实现：
 *
 * setClipboardData: https://github.com/chameleon-team/chameleon-api/tree/master/src/interfaces/setClipBoardData
 * getClipboardData: https://github.com/chameleon-team/chameleon-api/tree/master/src/interfaces/getClipBoardData
 */

import { setStorage, getStorage } from '../storage/index'

const CLIPBOARD_STORAGE_NAME = 'taro_clipboard'

document.addEventListener('copy', () => {
  setStorage({
    key: CLIPBOARD_STORAGE_NAME,
    data: window.getSelection().toString()
  }).catch(e => {
    console.error(e)
  })
})

/**
 * 成功回调
 * @callback SuccessCallback
 * @param {{ errMsg: string, data: string }}
 */

/**
 * 失败回调
 * @callback FailCallback
 * @param {{ errMsg: string }}
 */

/**
 * 完成回调
 * @callback CompleteCallback
 */

/**
 * 设置系统剪贴板的内容
 * @param {{ data: string, success: SuccessCallback, fail: FailCallback, complete: CompleteCallback }} object 参数
 * @returns {Promise<{ errMsg: string, data: string }>}
 */
export const setClipboardData = ({ data, success, fail, complete }) => {
  return new Promise((resolve, reject) => {
    setStorage({
      key: CLIPBOARD_STORAGE_NAME,
      data
    }).then(() => {
      if (document.execCommand('copy')) {
        const input = document.createElement('input')
        input.setAttribute('readonly', 'readonly')
        input.setAttribute('value', data)
        input.style.position = 'absolute'
        input.style.width = '100px'
        input.style.left = '-10000px'
        document.body.appendChild(input)
        input.focus()
        if (input.setSelectionRange) {
          input.setSelectionRange(0, input.value.length)
          document.execCommand('copy')
          document.body.removeChild(input)
        }
      }
      const res = {
        errMsg: 'setClipboardData:ok',
        data
      }
      success && success(res)
      complete && complete()
      resolve(res)
    }).catch(e => {
      const res = {
        errMsg: `setClipboardData:fail ${e.message}`
      }
      fail && fail(res)
      complete && complete()
      reject(res)
    })
  })
}

/**
 * 获取系统剪贴板的内容
 * @param {{ success: SuccessCallback, fail: FailCallback, complete: CompleteCallback  }} object 参数
 * @returns {Promise<{ errMsg: string, data: string }>}
 */
export const getClipboardData = ({ success, fail, complete } = {}) => {
  return new Promise((resolve, reject) => {
    getStorage({
      key: CLIPBOARD_STORAGE_NAME
    }).then(data => {
      const res = {
        errMsg: 'getClipboardData:ok',
        data
      }
      success && success(res)
      complete && complete()
      resolve(res)
    }).catch(e => {
      const res = {
        errMsg: `getClipboardData:fail ${e.message}`
      }
      fail && fail(res)
      complete && complete()
      reject(res)
    })
  })
}
