export function throttle (fn, ms = 250, scope?) {
  let last, deferTimer
  return function () {
    const context = scope || this

    const now = +new Date()
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    if (last && now < last + ms) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        fn.apply(context, args)
      }, ms)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

export function debounce (fn, ms = 250) {
  let timer: NodeJS.Timeout

  return function (...arrs) {
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn(...arrs)
    }, ms)
  }
}

export * from './style'
export * from './url'
