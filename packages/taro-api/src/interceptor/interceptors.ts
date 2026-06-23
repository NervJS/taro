import { isFunction, isUndefined } from '@tarojs/shared'

import type Chain from './chain'

export function timeoutInterceptor (chain: Chain) {
  const requestParams = chain.requestParams
  let p: Promise<void>
  const res = new Promise<void>((resolve, reject) => {
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      clearTimeout(timeout)
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
  // @ts-ignore
  if (!isUndefined(p) && isFunction(p.abort)) res.abort = p.abort

  return res
}

export function logInterceptor (chain: Chain) {
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
  // @ts-ignore
  if (isFunction(p.abort)) res.abort = p.abort

  return res
}
