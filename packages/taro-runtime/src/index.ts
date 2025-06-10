// hook
// dom-external
import './dom-external'

import env from './env'

export { hooks } from '@tarojs/shared'
// bom
export { taroDocumentProvider as document } from './bom/document'
export { taroGetComputedStyleProvider as getComputedStyle } from './bom/getComputedStyle'
export { History } from './bom/history'
export { Location } from './bom/location'
export { nav as navigator } from './bom/navigator'
export { caf as cancelAnimationFrame, now, raf as requestAnimationFrame } from './bom/raf'
export { parseUrl, TaroURLProvider as URL } from './bom/URL'
export { URLSearchParams } from './bom/URLSearchParams'
export { taroHistoryProvider as history, taroLocationProvider as location, taroWindowProvider as window } from './bom/window'
// dom
export { TaroElement } from './dom/element'
export { createEvent, eventHandler, TaroEvent } from './dom/event'
export { FormElement } from './dom/form'
export { TaroNode } from './dom/node'
export { TaroRootElement } from './dom/root'
export { Style } from './dom/style'
export { SVGElement } from './dom/svg'
export { TaroText } from './dom/text'
export { MutationObserver } from './dom-external/mutation-observer'
// others
export { env }
export * from './constants'
export { Current, getCurrentInstance } from './current'
export { eventSource } from './dom/event-source'
export {
  createComponentConfig,
  createPageConfig,
  createRecursiveComponentConfig,
  getOnHideEventKey,
  getOnReadyEventKey,
  getOnShowEventKey,
  getPageInstance,
  getPath,
  injectPageInstance,
  removePageInstance,
  safeExecute,
  stringify
} from './dsl/common'
export * from './emitter/emitter'
export { hydrate } from './hydrate'
export { nextTick } from './next-tick'
export { options } from './options'
export * from './perf'
export * from './utils'
// typings
export * from './dsl/instance'
export * from './interface'

// Polyfills
export * from './polyfill'
