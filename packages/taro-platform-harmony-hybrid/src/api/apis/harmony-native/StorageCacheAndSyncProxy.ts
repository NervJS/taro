
class ProxyHandler {
  private cacheMap: Map<any, any>
  // private readonly nativeApi: NativeApi
  // private readonly asyncToSyncProxy: any

  constructor () {
    // this.nativeApi = nativeApi
    this.cacheMap = new Map<string, any>()
    // this.asyncToSyncProxy = new Proxy(nativeApi, new AsyncToSyncProxy(this.nativeApi))
  }

  get (target, propKey, receiver) {
    const origMethod = Reflect.get(target, propKey, receiver)

    if (propKey === 'getStorageSync') {
      return (...args: any[]) => {
        const key = args[0].key
        if (this.cacheMap.has(key)) {
          return {errMsg:'ok', data: this.cacheMap.get(key)}
        } else {
          const res = Reflect.apply(target[propKey], target, args)
          if (res) {
            // @ts-ignore
            this.cacheMap.set(key, res?.data)
          }
          return res
        }
      }
    }

    if (propKey === 'setStorageSync') {
      return (...args: any[]) => {
        const key = args[0].key
        const data = args[0].data
        // 先更新js缓存，同异步原生，TODO 考虑失败的情况
        this.cacheMap.set(key, data)

        args[0].fail = ()=>{}
        args[0].success = ()=>{}
        Reflect.apply(target['setStorage'], target, args)
      }
    }
    if (propKey === 'removeStorageSync') {
      return (...args: any[]) => {
        const { key } = args[0]
        // 先更新缓存，再同步原生
        this.cacheMap.delete(key)

        args[0].fail = ()=>{}
        args[0].success = ()=>{}
        Reflect.apply(target['removeStorage'], target, args)
        // this.nativeApi['removeStorage']({key: key})
      }
    }

    if(propKey === 'getStorage') {
      return (...args: any[]) => {
        const key = args[0].key
        const success = args[0].success

        if (this.cacheMap.has(key)) {
          success({errMsg:'ok', data: this.cacheMap.get(key)})
        } else {
          args[0].success = (res)=>{
            this.cacheMap.set(key, res.data)
            success(res)
          }
          Reflect.apply(target[propKey], target, args)
        }
      }
    }
    if(propKey === 'setStorage') {
      return (...args: any[]) => {
        const key = args[0].key
        const data = args[0].data
        this.cacheMap.set(key, data)
        // 同步更新原生
        Reflect.apply(target[propKey], target, args)
      }
    }
    if (propKey === 'removeStorage') {
      return (...args: any[]) => {
        const { key } = args[0]
        // 先更新缓存，再同步原生
        this.cacheMap.delete(key)
        Reflect.apply(target[propKey], target, args)
      }
    }
    return origMethod;
  }
}

export function storageCacheAndSyncProxy(native: any): any {
  return new Proxy(native, new ProxyHandler())
}
