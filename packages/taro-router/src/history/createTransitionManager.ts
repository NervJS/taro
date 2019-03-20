import warning from 'warning'
import { History, Location, Action } from '../utils/types';

type Prompt = boolean | string | History.TransitionPromptHook
type Listener = (...args: any[]) => void
type Callback = (ok: boolean) => void

const createTransitionManager = () => {
  let prompt: Prompt | null = null

  const setPrompt = (nextPrompt: Prompt) => {
    warning(prompt == null, 'A history supports only one prompt at a time')

    prompt = nextPrompt

    return () => {
      if (prompt === nextPrompt) prompt = null
    }
  }

  const confirmTransitionTo = (
    location: Location,
    action: Action,
    getUserConfirmation,
    callback: Callback
  ) => {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt !== null) {
      const result =
        typeof prompt === 'function' ? prompt(location, action) : prompt

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback)
        } else {
          warning(
            false,
            'A history needs a getUserConfirmation function in order to use a prompt message'
          )

          callback(true)
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false)
      }
    } else {
      callback(true)
    }
  }

  let listeners: Listener[] = []

  const appendListener = fn => {
    let isActive = true

    const listener = (...args) => {
      if (isActive) fn(...args)
    }

    listeners.push(listener)

    return () => {
      isActive = false
      listeners = listeners.filter(item => item !== listener)
    }
  }

  const notifyListeners = (...args) => {
    listeners.forEach(listener => listener(...args))
  }

  return {
    setPrompt,
    confirmTransitionTo,
    appendListener,
    notifyListeners
  }
}

export default createTransitionManager
