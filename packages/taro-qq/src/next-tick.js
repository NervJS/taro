const nextTick = (fn, ...args) => {
  fn = typeof fn === 'function' ? fn.bind(null, ...args) : fn
  const timerFunc = qq.nextTick ? qq.nextTick : setTimeout
  timerFunc(fn)
}

export default nextTick
