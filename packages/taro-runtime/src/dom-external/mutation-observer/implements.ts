import { MutationRecordType } from './record'

import type { TaroNode } from '../../dom/node'
import type { MutationRecord } from './record'

export type MutationCallback = (mutations: MutationRecord[]) => any

/**
 * @see https://dom.spec.whatwg.org/#dictdef-mutationobserverinit
 */
export interface MutationObserverInit {
  attributeFilter?: string[]
  attributeOldValue?: boolean
  attributes?: boolean
  characterData?: boolean
  characterDataOldValue?: boolean
  childList?: boolean
  subtree?: boolean
}

const observers: MutationObserverImpl[] = []

/**
 * The MutationObserver provides the ability
 * to watch for changes being made to the DOM tree.
 * It will invoke a specified callback function
 * when DOM changes occur.
 * @see https://dom.spec.whatwg.org/#mutationobserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
export class MutationObserverImpl {
  public callback: MutationCallback
  public target: TaroNode | null
  public options: MutationObserverInit
  public records: MutationRecord[] = []

  constructor (callback: MutationCallback) {
    this.callback = callback
  }

  /**
   * Configures the MutationObserver
   * to begin receiving notifications
   * through its callback function
   * when DOM changes matching the given options occur.
   *
   * Options matching is to be implemented.
   */
  observe (target: TaroNode, options?: MutationObserverInit): void {
    this.disconnect()
    this.target = target
    this.options = options || {}

    observers.push(this)
  }

  /**
   * Stop the MutationObserver instance
   * from receiving further notifications
   * until and unless observe() is called again.
   */
  disconnect (): void {
    this.target = null

    const index = observers.indexOf(this)
    if (index >= 0) {
      observers.splice(index, 1)
    }
  }

  /**
   * Removes all pending notifications
   * from the MutationObserver's notification queue
   * and returns them in a new Array of MutationRecord objects.
   */
  takeRecords (): MutationRecord[] {
    return this.records.splice(0, this.records.length)
  }
}

/** Match two TaroNodes by sid. */
const sidMatches = (
  observerTarget: TaroNode | null,
  target: TaroNode | null
): boolean => {
  return !!observerTarget && observerTarget.sid === target?.sid
}

const isConcerned = (record: MutationRecord, options: MutationObserverInit) => {
  const { characterData, characterDataOldValue, attributes, attributeOldValue, childList } = options
  switch (record.type) {
    case MutationRecordType.CHARACTER_DATA:
      if (characterData) {
        if (!characterDataOldValue) record.oldValue = null
        return true
      }
      return false
    case MutationRecordType.ATTRIBUTES:
      if (attributes) {
        if (!attributeOldValue) record.oldValue = null
        return true
      }
      return false
    case MutationRecordType.CHILD_LIST:
      if (childList) {
        return true
      }
      return false
  }
}

let pendingMuatations = false

function logMutation (observer: MutationObserverImpl, record: MutationRecord) {
  observer.records.push(record)
  if (!pendingMuatations) {
    pendingMuatations = true
    Promise
      .resolve()
      .then(() => {
        pendingMuatations = false
        observers.forEach(observer => {
          return observer.callback(observer.takeRecords())
        })
      })
  }
}

export function recordMutation (record: MutationRecord) {
  observers.forEach(observer => {
    const { options } = observer
    for (let t: TaroNode | null = record.target; t; t = t.parentNode) {
      if (sidMatches(observer.target, t) && isConcerned(record, options)) {
        logMutation(observer, record)
        break
      }
      if (!options.subtree) break
    }
  })
}
