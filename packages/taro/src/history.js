import eventEmitter from 'events'

function pushHashPath (path) {
  window.location.hash = path
}

function replaceHashPath (path) {
  const hashIndex = window.location.href.indexOf('#')

  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path)
}

function getHash () {
  const href = window.location.href
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

function encodePath (path) {
  path = path.replace(/\?$/, '')
  return path.charAt(0) === '/' ? path : `/${path}`
}

let counter = 0
function createLocation (path) {
  path = decodeURIComponent(path)
  const pathname = path.split('?')[0]

  const search = {}
  const searchIndex = path.indexOf('?')
  if (searchIndex !== -1) {
    const queryString = path.substring(searchIndex + 1)
    queryString.split('&').forEach(pair => {
      const temp = pair.split('=')
      search[temp[0]] = temp[1]
    })
  }
  return {
    pageId: counter++,
    path,
    pathname,
    search
  }
}

class History extends eventEmitter {
  constructor (props) {
    super(props)

    if (History.instance) return History.instance
    History.instance = this

    this.stack = []
    this.ignorePath = false

    const path = encodePath(getHash())
    this.stack.push(createLocation(path))
    window.history.replaceState(1, null, null)

    window.addEventListener('popstate', e => {
      const currentPath = encodePath(getHash())
      if (this.ignorePath === currentPath) {
        this.ignorePath = null
        return
      }

      if (e.state && e.state <= this.stack.length) {
        // back
        this.stack.pop()
        console.log('back', e.state)
      } else {
        // forward
        const path = encodePath(getHash())
        this.stack.push(createLocation(path))
        console.log('new')
      }
    }, false)

    window.addEventListener('hashchange', e => {
      window.history.replaceState(this.stack.length, '', '')
    }, false)

    this.listen = this.listen.bind(this)
  }

  listen (fn) {
    this.on('change', fn)
    return () => {
      this.removeListener('change', fn)
    }
  }

  push (opts) {
    const encodedPath = encodePath(opts.url)
    const currentPath = encodePath(getHash())

    if (encodedPath !== currentPath) {
      const location = createLocation(encodedPath)
      this.stack.push(location)
      this.emit('change', location, 'PUSH', opts)
      this.ignorePath = encodedPath
      pushHashPath(encodedPath)
    } else {
      console.warn('cannot PUSH the same path')
    }
  }

  replace (opts) {
    const encodedPath = encodePath(opts.url)
    const currentPath = encodePath(getHash())

    if (encodedPath !== currentPath) {
      const location = createLocation(encodedPath)
      this.stack.pop()
      this.stack.push(location)
      this.emit('change', location, 'REPLACE', opts)
      this.ignorePath = encodedPath
      replaceHashPath(encodedPath)
    } else {
      console.warn('cannot PUSH the same path')
    }
  }

  goBack (n) {
    if (typeof n !== 'number' || n < 1) {
      console.warn('goBack arg error')
      return
    }

    const len = this.stack.length

    if (len === 1) return

    if (n > len - 1) n = len - 1
    this.stack.splice(len - n, n)

    const backPage = this.stack[len - n - 1]
    const encodedPath = backPage.path
    this.emit('change', backPage, 'BACK', { n })
    this.ignorePath = encodedPath
    pushHashPath(encodedPath)
  }
}

const history = new History()

window.h = history

export default history

export {
  pushHashPath,
  replaceHashPath,
  getHash,
  encodePath,
  createLocation
}
