export class NativeDataCache {
  private cache = new Map<string, any>()

  keys (): string[] {
    return Array.from(this.cache.keys())
  }

  set (key: string, value: any) {
    this.cache.set(key, value)
  }

  get (key: string) {
    return this.cache.get(key)
  }

  delete (key: string): boolean {
    return this.cache.delete(key)
  }

  has (key: string): boolean {
    return this.cache.has(key)
  }
}

/**
 * 系统数据更新监听器
 */
export interface NativeDataChangeListener {
  /**
   * 更新
   * @param methodName    要更新的方法名
   * @param methodArgs    要更新的方法参数，如果是空参，直接传[]
   */
  change: (methodName: string, methodArgs: any[]) => void
  /**
   * 注册
   * @param methodName    要注册的方法名列表
   */
  register: (methodNames: string[]) => void
  /**
   * 解注册
   * @param methodName    要解注册的方法名列表
   */
  unregister:(methodNames: string[]) => void

}

/**
 * 同步数据缓存ProxyHandler
 */
export class SyncCacheProxyHandler {
  private readonly nativeApi: any
  private readonly listener: NativeDataChangeListener
  private readonly cache: NativeDataCache
  private enableMethodNames: Set<string> = new Set<string>()

  constructor (nativeApi: any) {
    this.nativeApi = nativeApi
    this.cache = new NativeDataCache()
    // 绑定类的this到self变量
    const self = this
    // 监听Native数据变化
    this.listener = {
      register: (methodNames: string[]) => {
        methodNames.forEach((name: string) => {
          self.enableMethodNames.add(name)
        })
      },
      unregister: (methodNames: string[]) => {
        methodNames.forEach((name: string) => {
          self.enableMethodNames.delete(name)
        })
      },
      change: (methodName: string, methodArgs: any[]) => {
        if (self.enableMethodNames.has(methodName)) {
          self.updateNativeData(self.cache, methodName, methodArgs)
        }
      }
    }
    this.nativeApi.registerNativeListener(this.listener)
  }

  /**
   * 更新Native数据
   * @param cache         缓存数据
   * @param methodName    要更新的方法名
   * @param methodArgs    要更新的方法参数
   */
  private updateNativeData (cache: NativeDataCache, methodName: string, methodArgs: any[]) {
    const cacheKey = this.generateCacheKey(methodName, methodArgs)
    // 删除该key对应的数据
    cache.delete(cacheKey)
    // 获取到methodName对应的方法
    const fun = (this.nativeApi as any)[methodName] as (...args: any[]) => any
    // 方法存在，可以安全调用，并传入参数
    if (typeof fun === 'function') {
      const result = fun(...methodArgs)
      // 结果存入缓存
      if (result) {
        this.cache.set(cacheKey, result)
      }
    }
  }

  /**
   * 生成cache的存储key
   * @param methodName    方法名
   * @param methodArgs    方法参数
   */
  private generateCacheKey (methodName: string, methodArgs: any[]): string {
    return `${methodName}_${JSON.stringify(methodArgs)}`
  }

  get (target: any, propKey: string | symbol, receiver: any) {
    const origMethod = Reflect.get(target, propKey, receiver)
    const methodName = `${String(propKey)}`
    if (typeof origMethod === 'function' && this.enableMethodNames.has(methodName)) {
      return (...args: any[]) => {
        const cacheKey = this.generateCacheKey(`${String(propKey)}`, args)
        if (this.cache.has(cacheKey)) {
          return this.cache.get(cacheKey)
        } else {
          const result = origMethod.apply(target, args)
          if (result) {
            // 有效值才存入，null或者undefined存入cache没有意义
            this.cache.set(cacheKey, result)
          }
          return result
        }
      }
    }
    return origMethod
  }
}
