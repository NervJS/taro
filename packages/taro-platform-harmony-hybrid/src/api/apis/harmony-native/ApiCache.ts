
export function syncApiCache(cacheTime: number = 500) : MethodDecorator {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const origMethod = descriptor.value;
    let lastCall = 0;
    let lastResult: any;

    descriptor.value = function (...args: any[]) {
      const now = Date.now();
      if(now - lastCall < cacheTime) {
        lastCall = now
        console.log(`${String(_propertyKey)} 命中缓存 }`)
        return lastResult
      }
      lastResult = origMethod.apply(this, args);
      console.log(`${String(_propertyKey)} 没有命中，走jsbridge }`)
      lastCall = now;
      return lastResult
    }
  }

}
