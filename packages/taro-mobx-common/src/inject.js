import { getStore } from './store'
import { errorsReporter } from './reporter'

function grabStoresByName (storeNames) {
  return function (baseStores, nextProps) {
    storeNames.forEach(function (storeName) {
      if (!(storeName in baseStores)) {
        const error = new Error(
          "MobX injector: Store '" + storeName + "' is not available! Make sure it is provided by some Provider"
        )
        errorsReporter.emit(error)
        throw error
      }
      nextProps[storeName] = baseStores[storeName]
    })
    return nextProps
  }
}

export function getInjectName (component, injectNames) {
  const componentName = component.displayName || component.name || 'Component'
  if (injectNames) {
    return `inject-with-${injectNames}(${componentName})`
  }
  return `inject(${componentName})`
}

export function mapStoreToProps (grabStoresFn, props) {
  return Object.assign({}, grabStoresFn(getStore() || {}, props || {}) || {})
}

export function inject (/* fn(stores, nextProps) or ...storeNames, createStoreInjector */) {
  let grabStoresFn
  let createStoreInjector = arguments[arguments.length - 1]
  if (typeof arguments[0] === 'function') {
    grabStoresFn = arguments[0]
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, null, componentClass)
    }
  } else {
    const storeNames = []
    for (let i = 0; i < arguments.length - 1; i++) {
      storeNames[i] = arguments[i]
    }
    grabStoresFn = grabStoresByName(storeNames)
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, storeNames.join('-'), componentClass)
    }
  }
}
