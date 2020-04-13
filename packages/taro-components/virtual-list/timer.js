let now

(function () {
  let loadTime
  if ((typeof performance !== 'undefined' && performance !== null) && performance.now) {
    now = function () {
      return performance.now()
    }
  } else if (Date.now) {
    now = function () {
      return Date.now() - loadTime
    }
    loadTime = Date.now()
  } else {
    now = function () {
      return new Date().getTime() - loadTime
    }
    loadTime = new Date().getTime()
  }
})()

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
