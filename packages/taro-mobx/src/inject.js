import { getStore } from '@tarojs/mobx-common'

const proxiedInjectorProps = {
  isMobxInjector: {
    value: true,
    writable: true,
    configurable: true,
    enumerable: true
  }
}

function mapStoreToProps(grabStoresFn, props) {
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

function createStoreInjector (grabStoresFn, injectNames, Component) {
  let displayName =
        'inject-' +
        (Component.displayName ||
          Component.name ||
            (Component.constructor && Component.constructor.name) ||
            'Unknown')
  if (injectNames) displayName += '-with-' + injectNames

  class Injector extends Component {
    static displayName = displayName
    constructor (props) {
      super(Object.assign(...arguments, mapStoreToProps(grabStoresFn, props)))
    }

    componentWillMount () {
      Object.assign(this.props, mapStoreToProps(grabStoresFn, this.props))
      if (typeof super.componentWillMount === 'function') {
        super.componentWillMount()
      }
    }
  }

  Object.defineProperties(Injector, proxiedInjectorProps)

  return Injector
}

function grabStoresByName (storeNames) {
  return function (baseStores, nextProps) {
    storeNames.forEach(function (storeName) {
      if (
        storeName in nextProps // prefer props over stores
      ) { return }
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

export default function inject (/* fn(stores, nextProps) or ...storeNames */) {
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
