import { Emiter } from './emiter'

export let contextUid = 0

export function createContext (defaultValue) {
  const contextId = '__context_' + contextUid++ + '__'
  const context = {
    emiter: null,
    _id: contextId,
    _defaultValue: defaultValue
  }
  function Provider (newValue) {
    const emiter = context.emiter
    if (!emiter) {
      context.emiter = new Emiter(defaultValue)
    } else {
      emiter.set(newValue)
    }
  }
  return {
    Provider: Provider,
    context
  }
}
