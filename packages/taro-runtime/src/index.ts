// hook
// dom-external
import './dom-external'
export { hooks } from '@tarojs/shared'
// bom
export { window } from './bom/window'
export { navigator } from './bom/navigator'
export { document } from './bom/document'
export { raf as requestAnimationFrame, caf as cancelAnimationFrame, now } from './bom/raf'
export { getComputedStyle } from './bom/getComputedStyle'
// dom
export { TaroNode } from './dom/node'
export { TaroText } from './dom/text'
export { TaroElement } from './dom/element'
export { TaroRootElement } from './dom/root'
export { FormElement } from './dom/form'
export { SVGElement } from './dom/svg'
export { TaroEvent, createEvent, eventHandler } from './dom/event'
export { Style } from './dom/style'
export { MutationObserver } from './dom-external/mutation-observer'
// others
export {
  addLeadingSlash,
  safeExecute,
  createPageConfig,
  injectPageInstance,
  createComponentConfig,
  createRecursiveComponentConfig,
  stringify,
  getPageInstance
} from './dsl/common'
export { Current, getCurrentInstance } from './current'
export { options } from './options'
export { nextTick } from './next-tick'
export { hydrate } from './hydrate'
export * from './emitter/emitter'
export { incrementId } from './utils'
export { eventSource } from './dom/event-source'
// typings
export * from './interface'
export * from './dsl/instance'
