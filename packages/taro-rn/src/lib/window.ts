import { ScaledSize, Dimensions, EmitterSubscription } from 'react-native'
import { createCallbackManager } from '../utils'

let listener: EmitterSubscription

export const callbackManager = createCallbackManager()

export const resizeListener = ({ window }: { window: ScaledSize }) => {
  callbackManager.trigger({
    windowWidth: window.width,
    windowHeight: window.height
  })
}

export const addListener = () => {
  listener = Dimensions.addEventListener('change', resizeListener)
}

export const removeListener = () => {
  listener?.remove()
}