// hook
// dom-external
import './dom-external'

export { hooks } from '@tarojs/shared'
// bom
export { document } from './bom/document'
export { getComputedStyle } from './bom/getComputedStyle'
export { History } from './bom/history'
export { Location } from './bom/location'
export { nav as navigator } from './bom/navigator'
export { caf as cancelAnimationFrame, now, raf as requestAnimationFrame } from './bom/raf'
export { parseUrl, URL } from './bom/URL'
export { URLSearchParams } from './bom/URLSearchParams'
export { history, location, window } from './bom/window'
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
export { Current, getCurrentInstance } from './current'
export { eventSource } from './dom/event-source'
export {
  addLeadingSlash,
  createComponentConfig,
  createPageConfig,
  createRecursiveComponentConfig,
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
export { incrementId } from './utils'
// typings
export * from './dsl/instance'
export * from './interface'
