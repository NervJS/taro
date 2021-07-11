import contact from '@system.contact'
import sms from '@system.sms'

export function getContactPick (opts = {}) {
  const { success, fail, complete } = opts
  const res = { errMsg: 'getContactPick:ok' }
  return new Promise((resolve, reject) => {
    contact.pick({
      success (data) {
        res.result = data
        success && success(data)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function getContactList (opts = {}) {
  const { success, fail, complete } = opts
  const res = { errMsg: 'getContactList:ok' }
  return new Promise((resolve, reject) => {
    contact.list({
      success (data) {
        res.result = data
        success && success(data)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function sendSms (opts = {}) {
  const { address, content, success, fail, complete } = opts
  const res = { errMsg: 'sendSms:ok' }
  return new Promise((resolve, reject) => {
    sms.send({
      address,
      content,
      success (data) {
        res.result = data
        success && success(data)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export function readSmsSafely (opts = {}) {
  const { timeout, success, fail, complete } = opts
  const res = { errMsg: 'sendSms:ok' }
  return new Promise((resolve, reject) => {
    sms.readSafely({
      timeout,
      success (data) {
        res.result = data
        success && success(data)
        resolve(res)
      },
      fail (data, code) {
        res.errMsg = data
        res.code = code
        fail && fail(res)
        complete && complete(res)
        reject(res)
      }
    })
  })
}

export default {
  getContactPick,
  getContactList,
  sendSms
}
