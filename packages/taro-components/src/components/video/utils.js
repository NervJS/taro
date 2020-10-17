export const formatTime = time => {
  if (time === null) return ''
  const sec = Math.round(time % 60)
  const min = Math.round((time - sec) / 60)
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
}

export const calcDist = (x, y) => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export const normalizeNumber = number => {
  return Math.max(-1, Math.min(number, 1))
}

export const throttle = (fn, threshhold) => {
  let lastTime = 0
  return function () {
    const now = Date.now()
    if (now - lastTime > threshhold) {
      fn.apply(this, arguments)
      lastTime = now
    }
  }
}
