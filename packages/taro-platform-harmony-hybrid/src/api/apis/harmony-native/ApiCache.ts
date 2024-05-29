
export function syncApiCache (cacheTime: number = 500) : MethodDecorator {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const origMethod = descriptor.value
    let lastCall = 0
    let lastResult: any

    descriptor.value = function (...args: any[]) {
      const now = Date.now()
      if (now - lastCall < cacheTime) {
        lastCall = now
        return lastResult
      }
      lastResult = origMethod.apply(this, args)
      lastCall = now
      return lastResult
    }
  }
}
