import {Component, createElement} from 'nervjs'
import hoistStatics from 'hoist-non-react-statics'
import {observer} from './observer'
import {isStateless} from './utils'
import * as PropTypes from './propTypes'

const injectorContextTypes = {
  mobxStores: PropTypes.objectOrObservableObject
}
Object.seal(injectorContextTypes)

const proxiedInjectorProps = {
  contextTypes: {
    get: function () {
      return injectorContextTypes
    },
    set: function (_) {
      console.warn(
        'Mobx Injector: you are trying to attach `contextTypes` on an component decorated with `inject` (or `observer`) HOC. Please specify the contextTypes on the wrapped component instead. It is accessible through the `wrappedComponent`'
      )
    },
    configurable: true,
    enumerable: false
  },
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
function createStoreInjector (grabStoresFn, component, injectNames) {
  let displayName =
    'inject-' +
    (component.displayName ||
      component.name ||
      (component.constructor && component.constructor.name) ||
      'Unknown')
  if (injectNames) displayName += '-with-' + injectNames

  class Injector extends Component {
    static displayName = displayName;

    storeRef = instance => {
      this.wrappedInstance = instance
    };

    render () {
      // Optimization: it might be more efficient to apply the mapper function *outside* the render method
      // (if the mapper is a function), that could avoid expensive(?) re-rendering of the injector component
      // See this test: 'using a custom injector is not too reactive' in inject.js
      let newProps = {}
      for (let key in this.props) {
        if (this.props.hasOwnProperty(key)) {
          newProps[key] = this.props[key]
        }
      }
      var additionalProps =
        grabStoresFn(this.context.mobxStores || {}, newProps, this.context) ||
        {}
      for (let key in additionalProps) {
        newProps[key] = additionalProps[key]
      }

      if (!isStateless(component)) {
        newProps.ref = this.storeRef
      }

      return createElement(component, newProps)
    }
  }

  // Static fields from component should be visible on the generated Injector
  hoistStatics(Injector, component)

  Injector.wrappedComponent = component
  Object.defineProperties(Injector, proxiedInjectorProps)

  return Injector
}

function grabStoresByName (storeNames) {
  return function (baseStores, nextProps) {
    storeNames.forEach(function (storeName) {
      if (
        storeName in nextProps // prefer props over stores
      ) {
        return
      }
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

/**
 * higher order component that injects stores to a child.
 * takes either a varargs list of strings, which are stores read from the context,
 * or a function that manually maps the available stores from the context to props:
 * storesToProps(mobxStores, props, context) => newProps
 */
export default function inject (/* fn(stores, nextProps) or ...storeNames */) {
  let grabStoresFn
  if (typeof arguments[0] === 'function') {
    grabStoresFn = arguments[0]
    return function (componentClass) {
      let injected = createStoreInjector(grabStoresFn, componentClass)
      injected.isMobxInjector = false
      injected = observer(injected)
      injected.isMobxInjector = true
      return injected
    }
  } else {
    const storeNames = []
    for (let i = 0; i < arguments.length; i++) storeNames[i] = arguments[i]
    grabStoresFn = grabStoresByName(storeNames)
    return function (componentClass) {
      return createStoreInjector(
        grabStoresFn,
        componentClass,
        storeNames.join('-')
      )
    }
  }
}
