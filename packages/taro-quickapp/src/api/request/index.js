import fetch from '@system.fetch'

export default function request (options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof options === 'string') {
      options = {
        url: options
      }
    }

    const {
      url = '',
      method,
      dataType = 'json',
      success,
      fail,
      complete
    } = options

    let {
      header,
      data = ''
    } = options

    // headers
    if (typeof header !== 'object') header = {}

    if (!header['content-type'] && !header['Content-Type']) {
      header['Content-Type'] = 'application/json'
    }

    // method
    const methodUpper = typeof method === 'string' ? method.toUpperCase() : 'GET'

    // data
    if (methodUpper === 'POST' && typeof data === 'object') {
      let contentType = header && (header['Content-Type'] || header['content-type'])
      if (contentType === 'application/json') {
        data = JSON.stringify(data)
      }
    }

    // params
    const obj = {
      url,
      data,
      header,
      method: methodUpper,
      success (res) {
        let data = res.data

        if (dataType === 'json') data = JSON.parse(res.data)

        const reponse = {
          data,
          statusCode: res.code,
          header: res.headers
        }
        typeof success === 'function' && success(reponse)
        typeof complete === 'function' && complete(reponse)
        resolve(reponse)
      },
      fail (err, code) {
        const reason = {
          err,
          code
        }
        typeof fail === 'function' && fail(reason)
        typeof complete === 'function' && complete(reason)
        reject(reason)
      }
    }

    fetch.fetch(obj)
  })
}
