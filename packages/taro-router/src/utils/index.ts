export const tryToCall = (func, ctx?, ...args) => {
  if (!func) return
  if (ctx) {
    return func.apply(ctx, args)
  } else {
    return func(...args)
  }
}
