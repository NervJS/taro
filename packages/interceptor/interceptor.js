function timeoutInterceptor(chain) {
  let requestParams = chain.requestParams;
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      timeout = undefined;
      reject({message: '网络链接超时,请稍后再试！'});
    }, requestParams && requestParams.timeout || 10000);
    chain.proceed(requestParams).then((res) => {
      if(!timeout)
        return;
      clearTimeout(timeout);
      resolve(res)
    })
  })
}

function logInterceptor(chain) {
  let requestParams = chain.requestParams;
  let {method, data, url} = requestParams;
  console.log(`http ${method} --> ${url} data: `, data);
  return chain.proceed(requestParams)
    .then((res) => {
      console.log(`http <-- ${url} result:`, res);
      return res
    })
}

export default {
  timeoutInterceptor,
  logInterceptor
}
