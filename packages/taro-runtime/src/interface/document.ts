import type { createEvent } from '../dom/event'
import type { TaroDocument } from '../dom/document'
import type { TaroElement } from '../dom/element'

export interface GetDoc {
  (): TaroDocument
}

export interface TaroDocumentInstance extends TaroDocument {
  new (): TaroDocument
  documentElement: TaroElement
  head: TaroElement
  body: TaroElement
  createEvent: typeof createEvent
}
