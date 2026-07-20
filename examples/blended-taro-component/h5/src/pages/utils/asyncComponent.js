
export default class AsyncComponent {
  async getRemoteScript (url = '') {      
    if (!url) return

    if (!window.SyncComponentCache) {
      window.SyncComponentCache = {}
    }
    let res
    if (!window.SyncComponentCache[url]) {
      window.SyncComponentCache[url] = await this.newScript(url)
    }
    res = await window.SyncComponentCache[url]
    return res
  }

  async getRemoteScripts ( urls = []) {
    // await Promise.all(dependencyUrls.map(url => this.getRemoteScript(url)))
    return Promise.all(urls.map(url => this.getRemoteScript(url)))
  }

  newScript = src => {
    return new Promise(resolve => {
      const scriptElem = document.createElement('script')
      if (typeof src === 'object') {
        for (let key in src) {
          if (Object.prototype.hasOwnProperty.call(src, key)) {
            scriptElem[key] = src[key]
          }
        }
        src = src.src
      } else {
        scriptElem.src = src
      }
      scriptElem.addEventListener('load', () => {
        resolve(true)
      })

      console.log('add into page:', scriptElem)
      document.body.appendChild(scriptElem)
    })
  }
}
