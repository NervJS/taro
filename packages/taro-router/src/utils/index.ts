export const tryToCall = (func, ctx: any = null, ...args) => {
  if (!func) return
  if (ctx) {
    return func.apply(ctx, args)
  } else {
    return func(...args)
  }
}
