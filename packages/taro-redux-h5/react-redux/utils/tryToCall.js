/**
 * 尝试调用函数
 * 
 * @param {function} func 调用的函数
 * @param {any} ctx 调用上下文
 * @param  {...any} args 函数调用参数
 * @returns {any} returnValue
 */
export const tryToCall = (func, ctx = null, ...args) => {
  if (!func) return
  if (ctx) {
    return func.apply(ctx, args)
  } else {
    return func(...args)
  }
}
