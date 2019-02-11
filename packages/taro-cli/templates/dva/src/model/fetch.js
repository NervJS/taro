/* eslint-disable no-const-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
import Taro from '@tarojs/taro'
// 延迟处理
export const delay = time => new Promise(resolve => setTimeout(resolve, time))

// url转换
// eslint-disable-next-line func-names
const tranUrlFun = function (urlAddress = '', params) {
  let url = urlAddress
  Object.keys(params).forEach((e) => {
    const text = url.replace(`{${e}}`, () => {
      // eslint-disable-next-line no-shadow
      const text = params[e]
      // eslint-disable-next-line no-param-reassign
      delete params[e]
      return text
    })
    url = text === urlAddress ? url : text
  })
  return url
}

export const setValue = function setValue (state, { payload }) {
  return { ...state, ...payload }
}

export const getUrl = function getUrl (devTool, urlAddress) {
  if (urlAddress.indexOf('http') !== -1) {
    return urlAddress
  }
  return devTool.isDev
    ? devTool.dev + urlAddress
    : devTool.prod + urlAddress
}

export default function getFetchData (fetchConfig) {
  const {
    netTool,
    converData,
    onGLNetStart,
    onGLNetFinall,
    onGLNetError,
    onGLNetCatch,
    onGLTimeOut,
    extendAttr,
    GLParams,
    GLTimeOut
  } = fetchConfig
  return {
    namespace: 'fetch',
    state: {
      isShow: true, // true显示loading
      isNetError: false, // 是否网络出错
      isNetData: {} // 出错的单条网络数据
    },
    reducers: {
      setValue (state, { payload }) {
        return { ...state, ...payload }
      }
    },
    effects: {
      // TODO: 在上线之前需要修改url到真实地址
      * send ({ payload }, {
        call, select, race, take, put
      }) {
        try {
          // 这里保存最后需要合并的数据
          let ret = {}
          const keys = payload
          for (let i = 0; i < keys.length; i++) {
            const obj = keys[i]
            const keyName = obj.target
            // eslint-disable-next-line prefer-destructuring
            const url = obj.url
            const params = GLParams
              ? { ...obj.params, ...GLParams }
              : typeof obj.params === 'function' ? obj.params(ret[keyName]) : obj.params
            const timeOut = obj.timeOut || (GLTimeOut || 100000)
            const tranData = obj.tranData
            const tranUrl = obj.transUrl
            const method = obj.method || 'POST'
            const isOnlyNet = obj.isOnlyNet || false
            const onError = obj.onError
            const onCallBack = obj.onCallBack
            const converType = obj.converType
            const mock = obj.mock
            if (mock) {
              const oldState = yield select(state => ({ ...state[keyName] }))
              const netData = onGLNetStart && onGLNetStart({ info: obj })
              ret[keyName] = { ...oldState, ...netData }
            } else if (url) {
              const devTool = yield select(({ devTool }) => ({ ...devTool }))
              let urlAddress = url
              urlAddress = tranUrl ? tranUrlFun(url, params) : urlAddress
              let token = Taro.getStorageSync('token')
              token = token || ''
              const { retData, timeout, cancel } = yield race(
                {
                  retData: call(netTool[method], getUrl(devTool, urlAddress), params, token),
                  timeout: call(delay, timeOut || 10000),
                  cancel: take('CANCEL_FETCH')
                }
              )
              if (
                (retData.code && retData.code !== 200) ||
                (retData.status && retData.status !== 200)
              ) {
                console.log('接口数据异常', {
                  '接口返回结果:': retData,
                  '接口请求地址:': devTool.url + url,
                  '请求参数': params,
                  '请求token': token
                })
                if (onError) {
                  onError && onError({
                    ...obj, ...extendAttr, retData, params, timeOut, urlAddress
                  })
                } else {
                  onGLNetError && onGLNetError({
                    ...obj, ...extendAttr, retData, params, timeOut, urlAddress
                  })
                }
                ret = {}
                break
              }
              if (cancel) {
                break
              }
              if (!timeout) {
                const netData = onGLNetStart && onGLNetStart({ retData, info: obj, ...extendAttr })
                if (netData) {
                  if (!isOnlyNet) {
                    const oldState = yield select(state => ({ ...state[keyName] }))
                    if (tranData) {
                      ret[keyName] = { ...oldState, ...ret[keyName], ...(tranData ? tranData(netData, { ...oldState, ...ret[keyName] }) : netData) }
                    } else {
                      ret[keyName] = { ...oldState, ...ret[keyName], ...(converType ? converData[converType](netData, converType) : netData) }
                    }
                    onCallBack && onCallBack({
                      ...obj, retData: { ...ret[keyName] }, ...extendAttr, params, timeOut, urlAddress
                    })
                  } else {
                    const oldState = yield select(state => ({ ...state[keyName] }))
                    if (tranData) {
                      ret[keyName] = { ...oldState, ...ret[keyName], ...(tranData ? tranData(netData) : netData) }
                    } else {
                      ret[keyName] = { ...oldState, ...ret[keyName], ...(converType ? converData[converType](netData, converType) : netData) }
                    }
                    onCallBack &&
                      onCallBack({
                        ...obj, retData: converType ? converData[converType](netData, converType) : netData, ...extendAttr, params, timeOut, urlAddress
                      })
                  }
                } else {
                  yield put({ type: 'setValue', payload: { isShow: true, isNetError: true, isNetErrorData: obj } })
                  if (onError) {
                    onError && onError({
                      ...obj, ...extendAttr, retData, params, timeOut, urlAddress
                    })
                  } else {
                    onGLNetError && onGLNetError({
                      ...obj, ...extendAttr, retData, params, timeOut, urlAddress
                    })
                  }
                }
                onGLNetFinall && onGLNetFinall({
                  ...obj, ...extendAttr, retData, params, timeOut, urlAddress
                })
              } else {
                onGLTimeOut && onGLTimeOut({
                  ...obj, ...extendAttr, retData, params, timeOut, urlAddress
                })
              }
            }
          }
          const retKeys = Object.keys(ret)
          if (retKeys.length > 0) {
            yield put({ type: 'setValue', payload: { isShow: true, netError: false } })
            for (let i = 0; i < retKeys.length; i++) {
              const obj = keys[i]
              const onEnd = obj.onEnd
              const retKeyName = retKeys[i]
              const retObj = ret[retKeyName]
              yield put({ type: `${retKeyName}/setValue`, payload: { isShow: true } })
              yield put({ type: `${retKeyName}/setValue`, payload: { ...retObj, isShow: false } })
              onEnd && onEnd()
            }
            yield put({ type: 'setValue', payload: { isShow: false } })
          }
        } catch (error) {
          // console.log('抛出异常', error)
          onGLNetCatch && onGLNetCatch({ error, ...extendAttr })
        }
      }
    }
  }
}
