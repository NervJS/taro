export function timeLog<T extends object> (obj: T): T {
  return new Proxy(obj, {
    get (target, propKey, receiver) {
      const origMethod = Reflect.get(target, propKey, receiver)
      if (typeof origMethod !== 'function') {
        return origMethod
      }
      return function (...args: any[]) {
        const start = performance.now()
        const result = origMethod.apply(this, args)
        const end = performance.now()
        // eslint-disable-next-line no-console
        console.log(`执行${String(propKey)}()耗时: ${end - start}毫秒，参数列表: ${args.map(arg => JSON.stringify(arg)).join(', ')}`)
        return result
      }
    }
  })
}
