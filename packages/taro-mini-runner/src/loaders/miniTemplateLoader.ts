import * as sax from 'sax'
import { isUrlRequest, urlToRequest } from 'loader-utils'

export default function miniTemplateLoader (source) {
  this.cacheable && this.cacheable()
  const parser = sax.parser(false, { lowercase: true })
  const requests: Set<string> = new Set()
  const callback = this.async()
  const loadModule = request =>
    new Promise((resolve, reject) => {
      this.addDependency(request)
      this.loadModule(request, (err, src) => {
        if (err) {
          reject(err)
        } else {
          resolve(src)
        }
      })
    })

  parser.onattribute = ({ name, value }) => {
    if (value && name === 'src' && isUrlRequest(value)) {
      const request = urlToRequest(value)
      requests.add(request)
    }
  }
  parser.onend = async () => {
    try {
      const requestsArray = Array.from(requests)
      if (requestsArray.length) {
        for (let i = 0; i < requestsArray.length; i++) {
          await loadModule(requestsArray[i])
        }
      }
      callback(null, source)
    } catch (error) {
      callback(error, source)
    }
  }
  parser.write(source).close()
}
