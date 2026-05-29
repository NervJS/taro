import { temporarilyNotSupport } from '../../../utils'

const createNotSupportedObject = (obj, methods) => {
  methods.forEach(method => {
    Object.defineProperty(obj, method, {
      get: () => temporarilyNotSupport(method)
    })
  })
  return obj
}

const easingMethods = [
  'bounce', 'ease', 'elastic', 'linear', 'quad', 'cubic', 'poly',
  'bezier', 'circle', 'sin', 'exp', 'in', 'out', 'inOut'
]

const workletMethods = [
  'cancelAnimation', 'derived', 'shared', 'decay', 'spring',
  'timing', 'delay', 'repeat', 'sequence', 'runOnJS', 'runOnUI'
]

const worklet = createNotSupportedObject({}, workletMethods)

worklet.Easing = createNotSupportedObject({}, easingMethods)

worklet.scrollViewContext = createNotSupportedObject({}, ['scrollTo'])

export {
  worklet
}
