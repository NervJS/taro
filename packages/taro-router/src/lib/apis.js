import h from './history'
import resolvePathname from './resolvePathname'

const navigateTo = function (opts = {}) {
  const current = h.now()
  const currentUrl = current.url
  opts.url = resolvePathname(opts.url, currentUrl)
  h.push(opts)
}

const navigateBack = ({delta} = {delta: 1}) => {
  window.history.go(-1 * delta)
}

const redirectTo = function (opts = {}) {
  const success = opts.success
  const fail = opts.fail
  const complete = opts.complete

  h.replace({
    url: opts.url,
    success,
    fail,
    complete
  })
}

export {
  navigateTo,
  navigateBack,
  redirectTo
}
