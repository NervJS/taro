import { cancelAnimationFrame, now, requestAnimationFrame } from '@tarojs/runtime'

interface ITimeoutID {
  id: number
}

export function cancelTimeout (timeoutID: ITimeoutID) {
  cancelAnimationFrame(timeoutID.id)
}

export function requestTimeout (callback: () => void, delay = 0) {
  const start = now()

  const timeoutID: ITimeoutID = {
    id: requestAnimationFrame(tick) as number
  }

  function tick () {
    if (now() - start >= delay) {
      // eslint-disable-next-line no-useless-call
      callback.call(null)
    } else {
      timeoutID.id = requestAnimationFrame(tick) as number
    }
  }

  return timeoutID
}
