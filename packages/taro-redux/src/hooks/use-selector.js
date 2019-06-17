import { useReducer, useRef, useMemo, useEffect } from '@tarojs/taro'
import { useReduxContext } from './use-redux-context'
import Subscription from '../utils/subscription'
import invariant from '../utils/invariant'

const refEquality = (a, b) => a === b

/**
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector(state => state.counter)
 *   return <div>{counter}</div>
 * }
 */
export function useSelector (selector, equalityFn = refEquality) {
  invariant(selector, `You must pass a selector to useSelectors`)

  const { store, subscription: contextSub } = useReduxContext()
  const [, forceRender] = useReducer(s => s + 1, 0)

  const subscription = useMemo(() => new Subscription(store, contextSub), [
    store,
    contextSub
  ])

  const latestSubscriptionCallbackError = useRef()
  const latestSelector = useRef()
  const latestSelectedState = useRef()

  let selectedState

  try {
    if (
      selector !== latestSelector.current ||
      latestSubscriptionCallbackError.current
    ) {
      selectedState = selector(store.getState())
    } else {
      selectedState = latestSelectedState.current
    }
  } catch (err) {
    let errorMessage = `An error occured while selecting the store state: ${
      err.message
    }.`

    if (latestSubscriptionCallbackError.current) {
      errorMessage += `\nThe error may be correlated with this previous error:\n${
        latestSubscriptionCallbackError.current.stack
      }\n\nOriginal stack trace:`
    }

    throw new Error(errorMessage)
  }

  useEffect(() => {
    latestSelector.current = selector
    latestSelectedState.current = selectedState
    latestSubscriptionCallbackError.current = undefined
  })

  useEffect(
    () => {
      function checkForUpdates () {
        try {
          const newSelectedState = latestSelector.current(store.getState())

          if (equalityFn(newSelectedState, latestSelectedState.current)) {
            return
          }

          latestSelectedState.current = newSelectedState
        } catch (err) {
          // we ignore all errors here, since when the component
          // is re-rendered, the selectors are called again, and
          // will throw again, if neither props nor store state
          // changed
          latestSubscriptionCallbackError.current = err
        }

        forceRender({})
      }

      subscription.onStateChange = checkForUpdates
      subscription.trySubscribe()

      checkForUpdates()

      return () => subscription.tryUnsubscribe()
    },
    [store, subscription]
  )

  return selectedState
}
