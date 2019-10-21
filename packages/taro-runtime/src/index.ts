export { createDocument, document } from './bom/document'
export { window } from './bom/window'
export { navigator } from './bom/navigator'
export { TaroEvent, createEvent } from './dom/event'
// eslint-disable-next-line @typescript-eslint/camelcase
export { Current as internal_do_not_use_current } from './current'
export { connectReactPage, createReactApp } from './dsl/react'
export { createPageConfig, injectPageInstance } from './dsl/common'
export { connectVuePage } from './dsl/vue'
