/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import './polyfill/reflect-metadata'
export { TaroNode } from './dom/node'
export { TaroText } from './dom/text'
export { TaroElement } from './dom/element'
export { TaroRootElement } from './dom/root'
export { FormElement } from './dom/form'
export { TaroEvent, createEvent } from './dom/event'
export { createDocument, document } from './bom/document'
export { window } from './bom/window'
export { navigator } from './bom/navigator'
export { default as container } from './container'
export { default as processPluginHooks } from './container/plugin-hooks'
export { default as SERVICE_IDENTIFIER } from './constants/identifiers'
export { connectReactPage, createReactApp, createNativeComponentConfig } from './dsl/react'
export { connectVuePage, createVueApp } from './dsl/vue'
export { createVue3App } from './dsl/vue3'
export * from './dsl/instance'
export { createPageConfig, injectPageInstance, createComponentConfig, createRecursiveComponentConfig, stringify } from './dsl/common'
export { Current, getCurrentInstance } from './current'
export { Style } from './dom/style'
export * from './dsl/hooks'
export { options } from './options'
export { nextTick } from './next-tick'
export { hydrate } from './hydrate'
export * from './emitter/emitter'
export { raf as requestAnimationFrame, caf as cancelAnimationFrame, now } from './bom/raf'
export { getComputedStyle } from './bom/getComputedStyle'
export * from './interface'
