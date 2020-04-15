import { now, requestAnimationFrame, cancelAnimationFrame } from '@tarojs/runtime'

export function cancelTimeout (timeoutID) {
  cancelAnimationFrame(timeoutID.id)
}

export function requestTimeout (callback, delay) {
  const start = now()

  function tick () {
    if (now() - start >= delay) {
      // eslint-disable-next-line no-useless-call
      callback.call(null)
    } else {
      timeoutID.id = requestAnimationFrame(tick)
    }
  }

  const timeoutID = {
    id: requestAnimationFrame(tick)
  }
  return timeoutID
}
