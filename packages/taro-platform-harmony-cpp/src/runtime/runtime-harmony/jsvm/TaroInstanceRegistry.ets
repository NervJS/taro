import { TaroInstanceImpl } from './TaroInstance'

import type { TaroObject } from '@tarojs/runtime'
import type { TaroLogger } from './Logger'
import type { NapiBridge } from './NapiBridge'
import type { TaroContext } from './TaroContext'
import type { TaroInstance, TaroInstanceOptions } from './TaroInstance'

export class TaroInstanceRegistry {
  private instanceMap: Map<number, TaroInstanceImpl> = new Map()

  private logger: TaroLogger
  private napiBridge: NapiBridge
  private createTaroContext: (taroInstance: TaroInstance) => TaroContext

  constructor(
    logger: TaroLogger,
    napiBridge: NapiBridge,
    createTaroContext: (taroInstance: TaroInstance) => TaroContext,
  ) {
    this.logger = logger
    this.napiBridge = napiBridge
    this.createTaroContext = createTaroContext
  }

  public createInstance(options: TaroInstanceOptions): TaroInstance {
    const id = this.napiBridge.getNextTaroInstanceId()
    const instance = new TaroInstanceImpl(
      id,
      this.logger,
      this.napiBridge,
      !!options.enableBackgroundExecutor,
      this.createTaroContext,
    )
    instance.initialize()
    this.instanceMap.set(id, instance)
    return instance
  }

  public getInstance(id: number): TaroInstance | undefined {
    return this.instanceMap.get(id)
  }

  public deleteInstance(id: number): boolean {
    if (this.instanceMap.has(id)) {
      this.instanceMap.delete(id)
      return true
    }
    return false
  }

  public forEach(cb: (taroInstance: TaroInstanceImpl) => void) {
    this.instanceMap.forEach(cb)
  }

  private getDefaultProps(): TaroObject {
    return { concurrentRoot: true }
  }
}
