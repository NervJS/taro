import { getStore } from './store'

function mapStoreToProps (grabStoresFn, props) {
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

function createStoreInjector (grabStoresFn, injectNames, componentClass) {
  let displayName =
        'inject-' +
        (componentClass.displayName ||
          componentClass.name ||
            (componentClass.constructor && componentClass.constructor.name) ||
            'Unknown')
  if (injectNames) {
    displayName += '-with-' + injectNames
  }

  Object.defineProperties(componentClass, {
    isMobxInjector: {
      value: true,
      writable: true,
      configurable: true,
      enumerable: true
    },
    displayName: {
      value: displayName,
      writable: true,
      configurable: true,
      enumerable: true
    }
  })

  const target = componentClass.prototype || componentClass
  const originCreateData = target._createData
  target._createData = function () {
    Object.assign(this.props, mapStoreToProps(grabStoresFn, this.props))
    return originCreateData.call(this)
  }
  return componentClass
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

export function inject (/* fn(stores, nextProps) or ...storeNames */) {
  let grabStoresFn
  if (typeof arguments[0] === 'function') {
    grabStoresFn = arguments[0]
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, null, componentClass)
    }
  } else {
    const storeNames = []
    for (let i = 0; i < arguments.length; i++) storeNames[i] = arguments[i]
    grabStoresFn = grabStoresByName(storeNames)
    return function (componentClass) {
      return createStoreInjector(grabStoresFn, storeNames.join('-'), componentClass)
    }
  }
}
