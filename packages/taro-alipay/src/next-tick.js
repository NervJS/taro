const nextTick = (fn, ...args) => {
  fn = typeof fn === 'function' ? fn.bind(null, ...args) : fn
  const timerFunc = my.nextTick ? my.nextTick : setTimeout
  timerFunc(fn)
}

export default nextTick
