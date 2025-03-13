import ConfigurationConstant from '@ohos.app.ability.ConfigurationConstant'
import deviceInfo from '@ohos.deviceInfo'
import display from '@ohos.display'
import telephony from '@ohos.telephony.call'
import window from '@ohos.window'
import app from '@system.app'

import { TurboModule } from '../TurboModule'

export class NativePackageManagerTurboModule extends TurboModule {
  public static readonly NAME = 'NativePackageManager'

  cacheModule: Record<string, any> = {
    '@ohos.app.ability.ConfigurationConstant': ConfigurationConstant,
    '@ohos.deviceInfo': deviceInfo,
    '@ohos.display': display,
    '@ohos.window': window,
    '@ohos.telephony.call': telephony,
    '@system.app': app,
  }

  async loadLibrary(name: string, options: unknown[][]) {
    if (!this.cacheModule[name]) {
      this.cacheModule[name] = await import(name)
    }

    const module = this.cacheModule[name]
    return options.reduce((acc, [key, ...args]) => {
      if (!acc) return acc

      if (typeof key === 'string') {
        if (typeof acc[key] === 'function') {
          return acc[key](...args)
        } else if (typeof acc[key] === 'object') {
          return acc[key]
        }
      }
    }, module)
  }

  loadLibrarySync(name: string, options: unknown[][]) {
    const module = this.cacheModule[name]
    return options.reduce((acc, [key, ...args]) => {
      if (!acc) return acc

      if (typeof key === 'string') {
        if (typeof acc[key] === 'function') {
          return acc[key](...args)
        } else if (typeof acc[key] === 'object') {
          return acc[key]
        }
      }
    }, module)
  }
}
