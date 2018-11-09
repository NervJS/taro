const nextTick = (fn, ...args) => {
  fn = typeof fn === 'function' ? fn.bind(null, ...args) : fn
  const timerFunc = swan.nextTick ? swan.nextTick : setTimeout
  timerFunc(fn)
}

export default nextTick
