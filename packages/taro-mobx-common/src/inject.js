import { getStore } from './store'

const proxiedInjectorProps = {
  isMobxInjector: {
    value: true,
    writable: true,
    configurable: true,
    enumerable: true
  }
}

/**
 * Store Injection
 */
function createStoreInjector (grabStoresFn, component, injectNames, { Component, createElement }) {
  let displayName =
        'inject-' +
        (component.displayName ||
            component.name ||
            (component.constructor && component.constructor.name) ||
            'Unknown')
  if (injectNames) displayName += '-with-' + injectNames

  class Injector extends Component {
    static displayName = displayName
    render () {
      let newProps = {}
      for (let key in this.props) {
        if (this.props.hasOwnProperty(key)) {
          newProps[key] = this.props[key]
        }
      }
      const additionalProps = grabStoresFn(getStore() || {}, newProps, this.context) || {}
      for (let key in additionalProps) {
        newProps[key] = additionalProps[key]
      }
      return createElement(component, newProps)
    }
  }

  Object.defineProperties(Injector, proxiedInjectorProps)

  return Injector
}

function grabStoresByName (storeNames) {
  return function (baseStores, nextProps) {
    storeNames.forEach(function (storeName) {
      if (!(storeName in baseStores)) {
        throw new Error(
          "MobX injector: Store '" +
                        storeName +
                        "' is not available! Make sure it is provided by some Provider"
        )
      }
      nextProps[storeName] = baseStores[storeName]
    })
    return nextProps
  }
}

export function inject (/* fn(stores, nextProps) or ...storeNames, { Component, createElement } */) {
  let grabStoresFn
  let platformSpecialParams = arguments[arguments.length - 1]
  if (typeof arguments[0] === 'function') {
    grabStoresFn = arguments[0]
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, componentClass, null, platformSpecialParams)
    }
  } else {
    const storeNames = []
    for (let i = 0; i < arguments.length - 1; i++) storeNames[i] = arguments[i]
    grabStoresFn = grabStoresByName(storeNames)
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, componentClass, storeNames.join('-'), platformSpecialParams)
    }
  }
}
