export const formatTime = (time: number): string => {
  if (time === null) return ''
  const sec = Math.round(time / 1000 % 60)
  const min = Math.floor((time - sec) / 1000 / 60)
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
}

export const calcDist = (x: number, y: number): number => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export const normalizeNumber = (number: number): number => {
  return Math.max(-1, Math.min(number, 1))
}
