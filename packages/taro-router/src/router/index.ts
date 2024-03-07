import { prependBasename } from '../history'

import type { MpaRouterConfig, SpaRouterConfig } from '../../types/router'

export class RouterConfig {
  private static __config: SpaRouterConfig | MpaRouterConfig

  static set config (e: SpaRouterConfig | MpaRouterConfig) {
    this.__config = e
  }

  static get config () {
    return this.__config
  }

  static get pages () {
    return this.config.pages || []
  }

  static get router () {
    return this.config.router || {}
  }

  static get mode () {
    return this.router.mode || 'hash'
  }

  static get customRoutes () { return this.router.customRoutes || {} }

  static isPage (url = '') {
    return this.pages.findIndex(e => prependBasename(e) === url) !== -1
  }
}
