import type { TaroNode } from './node'

/**
 * A MutationRecord represents an individual DOM mutation.
 * It is the object that is passed to MutationObserver's callback.
 * @see https://dom.spec.whatwg.org/#interface-mutationrecord
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
*/
export interface MutationRecord {
  readonly target: TaroNode
  readonly addedNodes?: TaroNode[]
  readonly removedNodes?: TaroNode[]
  readonly previousSibling?: TaroNode | null
  readonly nextSibling?: TaroNode | null
  readonly attributeName?: string | null
  readonly attributeNamespace?: string | null
  readonly oldValue?: string | null

  // extended
  readonly type: MutationRecordType
  readonly value?: string | null
}

export const enum MutationRecordType {
  ATTRIBUTES = 0,
  CHARACTER_DATA = 1,
  CHILD_LIST = 2,
}
