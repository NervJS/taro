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

export function generateDisplayName (sourceComponent, injectNames) {
  let displayName =
        'inject-' +
        (sourceComponent.displayName ||
          sourceComponent.name ||
            (sourceComponent.constructor && sourceComponent.constructor.name) ||
            'Unknown')
    if (injectNames) {
      displayName += '-with-' + injectNames
    }
    return displayName
}

export function mapStoreToProps (grabStoresFn, props) {
  let newProps = {}
  for (let key in props) {
    if (props.hasOwnProperty(key)) {
      newProps[key] = props[key]
    }
  }
  const additionalProps = grabStoresFn(getStore() || {}, newProps) || {}
  for (let key in additionalProps) {
    newProps[key] = additionalProps[key]
  }
  return newProps
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