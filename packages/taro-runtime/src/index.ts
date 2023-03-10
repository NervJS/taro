/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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
