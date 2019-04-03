export function timeoutInterceptor (chain) {
  const requestParams = chain.requestParams
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      timeout = null
      reject(new Error('网络链接超时,请稍后再试！'))
    }, (requestParams && requestParams.timeout) || 60000)

    chain.proceed(requestParams)
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
}

export function logInterceptor (chain) {
  const requestParams = chain.requestParams
  const { method, data, url } = requestParams
  console.log(`http ${method || 'GET'} --> ${url} data: `, data)
  return chain.proceed(requestParams)
    .then(res => {
      console.log(`http <-- ${url} result:`, res)
      return res
    })
}
