const nextTick = (fn, ...args) => {
  fn = typeof fn === 'function' ? fn.bind(null, ...args) : fn
  const timerFunc = tt.nextTick ? tt.nextTick : setTimeout
  timerFunc(fn)
}

export default nextTick
