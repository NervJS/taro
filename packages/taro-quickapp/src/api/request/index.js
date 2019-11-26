import fetch from '@system.fetch'
import quickRequest from '@system.request'

export function request (options = {}) {
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

    let { header, data = '' } = options

    // headers
    if (typeof header !== 'object') header = {}

    if (!header['content-type'] && !header['Content-Type']) {
      header['Content-Type'] = 'application/json'
    }

    // method
    const methodUpper =
      typeof method === 'string' ? method.toUpperCase() : 'GET'

    // data
    if (methodUpper === 'POST' && typeof data === 'object') {
      let contentType =
        header && (header['Content-Type'] || header['content-type'])
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

export function uploadFile (options = {}) {
  return new Promise((resolve, reject) => {
    const {
      url = '',
      filePath,
      name = 'file',
      formData = {},
      success,
      fail,
      complete
    } = options
    let { header, method = 'POST', files = [], data = [] } = options
    if (typeof header !== 'object') header = {}
    if (files.length === 0) {
      files.push({
        name,
        uri: filePath
      })
    }
    if (data.length === 0) {
      data.push(formData)
    }
    const methodUpper = typeof method === 'string' ? method.toUpperCase() : 'POST'

    const obj = {
      url,
      header,
      method: methodUpper,
      files,
      data,
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

    quickRequest.upload(obj)
  })
}

export function downloadFile (options = {}) {
  return new Promise((resolve, reject) => {
    const {
      url = '',
      description = '',
      filename,
      success,
      fail,
      complete
    } = options
    let { header } = options
    if (typeof header !== 'object') header = {}

    let obj = {
      url,
      header,
      description,
      data,
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

    if (filename) obj.filename = filename

    quickRequest.download(obj)
  })
}

export default {
  request,
  uploadFile,
  downloadFile
}
