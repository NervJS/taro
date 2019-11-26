import { Emitter } from './emitter'

export let contextUid = 0

export function createContext (defaultValue) {
  const contextId = '__context_' + contextUid++ + '__'
  const context = {
    emitter: null,
    _id: contextId,
    _defaultValue: defaultValue
  }
  function Provider (newValue) {
    const emitter = context.emitter
    if (!emitter) {
      context.emitter = new Emitter(defaultValue)
    } else {
      emitter.set(newValue)
    }
  }
  return {
    Provider: Provider,
    context
  }
}
