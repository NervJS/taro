import type { ComponentConfig } from '@tarojs/shared/dist/template'

export const componentConfig: ComponentConfig = {
  includes: new Set(['view', 'catch-view', 'static-view', 'pure-view', 'scroll-view', 'image', 'static-image', 'text', 'static-text']),
  exclude: new Set(),
  thirdPartyComponents: new Map(),
  includeAll: false
}
