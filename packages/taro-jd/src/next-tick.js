const nextTick = (fn, ...args) => {
  fn = typeof fn === 'function' ? fn.bind(null, ...args) : fn
  const timerFunc = jd.nextTick ? jd.nextTick : setTimeout
  timerFunc(fn)
}

export default nextTick
