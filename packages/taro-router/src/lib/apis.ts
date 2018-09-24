import h from './history'
import resolvePathname from 'resolve-pathname'

export interface NavigateOpts {
  url?: string;
  state?: number;
  isForward?: boolean;
  success?: Function;
  fail?: Function;
  complete?: Function;
}

const navigateTo = function (opts = {} as NavigateOpts) {
  const current = h.now()
  const currentUrl = current.url
  const url = resolvePathname(opts.url, currentUrl)
  h.push({ url })
}

const navigateBack = ({delta} = {delta: 1}) => {
  window.history.go(-1 * delta)
}

const redirectTo = function (opts = {} as NavigateOpts) {
  // const success = opts.success
  // const fail = opts.fail
  // const complete = opts.complete

  h.replace({
    url: opts.url
    /* TODO: success fail complete*/
  })
}

export {
  navigateTo,
  navigateBack,
  redirectTo
}
