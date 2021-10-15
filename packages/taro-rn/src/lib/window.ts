import { ScaledSize } from 'react-native'
import { createCallbackManager } from '../utils'

export const callbackManager = createCallbackManager()

export const resizeListener = ({ window }: { window: ScaledSize }) => {
  callbackManager.trigger({
    windowWidth: window.width,
    windowHeight: window.height
  })
}
