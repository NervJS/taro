export function timeoutInterceptor(chain) {
  const requestParams = chain.requestParams
  let p
  const res = new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      timeout = null
      reject(new Error('网络链接超时,请稍后再试！'))
    }, (requestParams && requestParams.timeout) || 60000)
    p = chain.proceed(requestParams)
    p.then(res => {
      if (!timeout) return
      clearTimeout(timeout)
      resolve(res)
    }).catch(err => {
      timeout && clearTimeout(timeout)
      reject(err)
    })
  })
  if (typeof p.abort === 'function') res.abort = p.abort
  return res
}

export function logInterceptor(chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams
  console.log(`http ${method || 'GET'} --> ${url} data: `, data)
  const p = chain.proceed(requestParams)
  const res = p.then(res => {
    console.log(`http <-- ${url} result:`, res)
    return res
  })
  if (typeof p.abort === 'function') res.abort = p.abort
  return res
}
