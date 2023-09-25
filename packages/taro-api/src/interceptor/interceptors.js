import { isFunction, isUndefined } from '../utils'

export function timeoutInterceptor (chain) {
  const requestParams = chain.requestParams
  let p
  const res = new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      timeout = null
      reject(new Error('网络链接超时,请稍后再试！'))
    }, (requestParams && requestParams.timeout) || 60000)

    p = chain.proceed(requestParams)
    p
      .then(res => {
        if (!timeout) return
        clearTimeout(timeout)
        resolve(res)
      })
      .catch(err => {
        timeout && clearTimeout(timeout)
        reject(err)
      })
  })
  if (!isUndefined(p) && isFunction(p.abort)) res.abort = p.abort

  return res
}

export function logInterceptor (chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams

  // eslint-disable-next-line no-console
  console.log(`http ${method || 'GET'} --> ${url} data: `, data)

  const p = chain.proceed(requestParams)
  const res = p
    .then(res => {
      // eslint-disable-next-line no-console
      console.log(`http <-- ${url} result:`, res)
      return res
    })
  if (isFunction(p.abort)) res.abort = p.abort

  return res
}
