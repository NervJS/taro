import {Component, PureComponent, findDOMNode as baseFindDOMNode} from 'nervjs'
import hoistStatics from 'hoist-non-react-statics'
import {createAtom, Reaction, _allowStateChanges, $mobx} from 'mobx'
import inject from './inject'
import EventEmitter from './utils'

const mobxAdminProperty = $mobx || '$mobx'

/**
 * dev tool support
 */
let isDevtoolsEnabled = false

let isUsingStaticRendering = false

let warnedAboutObserverInjectDeprecation = false

// WeakMap<Node, Object>;
export const componentByNodeRegistry =
    typeof WeakMap !== 'undefined' ? new WeakMap() : undefined
export const renderReporter = new EventEmitter()

function createSymbol (name) {
  if (typeof Symbol === 'function') {
    return Symbol(name)
  }
  return `$mobxReactProp$${name}${Math.random()}`
}

const skipRenderKey = createSymbol('skipRender')
const isForcingUpdateKey = createSymbol('isForcingUpdate')

/**
 * Helper to set `prop` to `this` as non-enumerable (hidden prop)
 * @param target
 * @param prop
 * @param value
 */
function setHiddenProp (target, prop, value) {
  if (!Object.hasOwnProperty(target, prop)) {
    Object.defineProperty(target, prop, {
      enumerable: false,
      configurable: true,
      writeable: true,
      value
    })
  } else {
    target[prop] = value
  }
}

function findDOMNode (component) {
  if (baseFindDOMNode) {
    try {
      return baseFindDOMNode(component)
    } catch (e) {
      return null
    }
  }
  return null
}

function reportRendering (component) {
  const node = findDOMNode(component)
  if (node && componentByNodeRegistry) {
    componentByNodeRegistry.set(node, component)
  }

  renderReporter.emit({
    event: 'render',
    renderTime: component.__$mobRenderEnd - component.__$mobRenderStart,
    totalTime: Date.now() - component.__$mobRenderStart,
    component: component,
    node: node
  })
}

export function trackComponents () {
  if (typeof WeakMap === 'undefined') {
    throw new Error(
      '[mobx-react] tracking components is not supported in this browser.'
    )
  }
  if (!isDevtoolsEnabled) isDevtoolsEnabled = true
}

export function useStaticRendering (useStaticRendering) {
  isUsingStaticRendering = useStaticRendering
}

/**
 * Errors reporter
 */

export const errorsReporter = new EventEmitter()

/**
 * Utilities
 */

function patch (target, funcName, runMixinFirst = false) {
  const base = target[funcName]
  const mixinFunc = reactiveMixin[funcName]
  const f = !base
    ? mixinFunc
    : runMixinFirst === true
      ? function () {
        mixinFunc.apply(this, arguments)
        base.apply(this, arguments)
      }
      : function () {
        base.apply(this, arguments)
        mixinFunc.apply(this, arguments)
      }

  // MWE: ideally we freeze here to protect against accidental overwrites in component instances, see #195
  // ...but that breaks react-hot-loader, see #231...
  target[funcName] = f
}

function shallowEqual (objA, objB) {
  // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (is(objA, objB)) return true
  if (
    typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null
  ) {
    return false
  }
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) ||
            !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false
    }
  }
  return true
}

function is (x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y
  } else {
    /* eslint-disable */
        return x !== x && y !== y
    }
}

function makeComponentReactive(render) {
    if (isUsingStaticRendering === true) return render.call(this)

    function reactiveRender() {
        isRenderingPending = false
        let exception
        let rendering
        reaction.track(() => {
            if (isDevtoolsEnabled) {
                this.__$mobRenderStart = Date.now()
            }
            try {
                rendering = _allowStateChanges(false, baseRender)
            } catch (e) {
                exception = e
            }
            if (isDevtoolsEnabled) {
                this.__$mobRenderEnd = Date.now()
            }
        })
        if (exception) {
            errorsReporter.emit(exception)
            throw exception
        }
        return rendering
    }

    // Generate friendly name for debugging
    const initialName =
        this.displayName ||
        this.name ||
        (this.constructor &&
            (this.constructor.displayName || this.constructor.name)) ||
        '<component>'
    const rootNodeID =
        (this._reactInternalInstance && this._reactInternalInstance._rootNodeID) ||
        (this._reactInternalInstance && this._reactInternalInstance._debugID) ||
        (this._reactInternalFiber && this._reactInternalFiber._debugID)
        /**
         * If props are shallowly modified, react will render anyway,
         * so atom.reportChanged() should not result in yet another re-render
         */
    setHiddenProp(this, skipRenderKey, false)
        /**
         * forceUpdate will re-assign this.props. We don't want that to cause a loop,
         * so detect these changes
         */
    setHiddenProp(this, isForcingUpdateKey, false)

    // wire up reactive render
    const baseRender = render.bind(this)
    let isRenderingPending = false

    const reaction = new Reaction(`${initialName}#${rootNodeID}.render()`, () => {
        if (!isRenderingPending) {
            isRenderingPending = true
            if (typeof this.componentWillReact === 'function') {
                this.componentWillReact()
            }
            if (this.__$mobxIsUnmounted !== true) {
                let hasError = true
                try {
                    setHiddenProp(this, isForcingUpdateKey, true)
                    if (!this[skipRenderKey]) Component.prototype.forceUpdate.call(this)
                    hasError = false
                } finally {
                    setHiddenProp(this, isForcingUpdateKey, false)
                    if (hasError) reaction.dispose()
                }
            }
        }
    })
    reaction.reactComponent = this
    reactiveRender[mobxAdminProperty] = reaction
    this.render = reactiveRender
    return reactiveRender.call(this)
}

/**
 * ReactiveMixin
 */
const reactiveMixin = {
    componentWillUnmount: function() {
        if (isUsingStaticRendering === true) return
        this.render[mobxAdminProperty] && this.render[mobxAdminProperty].dispose()
        this.__$mobxIsUnmounted = true
        if (isDevtoolsEnabled) {
            const node = findDOMNode(this)
            if (node && componentByNodeRegistry) {
                componentByNodeRegistry.delete(node)
            }
            renderReporter.emit({
                event: 'destroy',
                component: this,
                node: node
            })
        }
    },

    componentDidMount: function() {
        if (isDevtoolsEnabled) {
            reportRendering(this)
        }
    },

    componentDidUpdate: function() {
        if (isDevtoolsEnabled) {
            reportRendering(this)
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (isUsingStaticRendering) {
            console.warn(
                '[mobx-react] It seems that a re-rendering of a React component is triggered while in static (server-side) mode. Please make sure components are rendered only once server-side.'
            )
        }
        if (this.state !== nextState) {
            return true
        }
        return !shallowEqual(this.props, nextProps)
    }
}

function makeObservableProp(target, propName) {
    const valueHolderKey = createSymbol(propName + ' value holder')
    const atomHolderKey = createSymbol(propName + ' atom holder')

    function getAtom() {
        if (!this[atomHolderKey]) {
            setHiddenProp(this, atomHolderKey, createAtom('reactive ' + propName))
        }
        return this[atomHolderKey]
    }
    Object.defineProperty(target, propName, {
        configurable: true,
        enumerable: true,
        get: function() {
            getAtom.call(this).reportObserved()
            return this[valueHolderKey]
        },
        set: function set(v) {
            if (!this[isForcingUpdateKey] && !shallowEqual(this[valueHolderKey], v)) {
                setHiddenProp(this, valueHolderKey, v)
                setHiddenProp(this, skipRenderKey, true)
                getAtom.call(this).reportChanged()
                setHiddenProp(this, skipRenderKey, false)
            } else {
                setHiddenProp(this, valueHolderKey, v)
            }
        }
    })
}

/**
 * Observer function / decorator
 */
export function observer(arg1, arg2) {
    if (typeof arg1 === 'string') {
        throw new Error('Store names should be provided as array')
    }
    if (Array.isArray(arg1)) {

        if (!warnedAboutObserverInjectDeprecation) {
            warnedAboutObserverInjectDeprecation = true
            console.warn(
                'Mobx observer: Using observer to inject stores is deprecated since 4.0. Use `@inject("store1", "store2") @observer ComponentClass` or `inject("store1", "store2")(observer(componentClass))` instead of `@observer(["store1", "store2"]) ComponentClass`'
            )
        }
        if (!arg2) {
            // invoked as decorator
            return componentClass => observer(arg1, componentClass)
        } else {
            return inject.apply(null, arg1)(observer(arg2))
        }
    }
    const componentClass = arg1

    if (componentClass.isMobxInjector === true) {
        console.warn(
            "Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"
        )
    }
    /* eslint-disable */
    if (componentClass.__proto__ === PureComponent) {
        console.warn(
            "Mobx observer: You are using 'observer' on React.PureComponent. These two achieve two opposite goals and should not be used together"
        )
    }

    // Stateless function component:
    // If it is function but doesn't seem to be a react class constructor,
    // wrap it to a react class automatically
    if (
        typeof componentClass === 'function' &&
        (!componentClass.prototype || !componentClass.prototype.render) &&
        !componentClass.isReactClass &&
        !Component.isPrototypeOf(componentClass)
    ) {
        const observerComponent = observer(
            class extends Component {
                static displayName = componentClass.displayName || componentClass.name;
                static contextTypes = componentClass.contextTypes;
                static propTypes = componentClass.propTypes;
                static defaultProps = componentClass.defaultProps;
                render() {
                    return componentClass.call(this, this.props, this.context)
                }
            }
        )
        hoistStatics(observerComponent, componentClass)
        return observerComponent
    }

    if (!componentClass) {
        throw new Error("Please pass a valid component to 'observer'")
    }

    const target = componentClass.prototype || componentClass
    mixinLifecycleEvents(target)
    componentClass.isMobXReactObserver = true
    makeObservableProp(target, 'props')
    makeObservableProp(target, 'state')
    const baseRender = target.render
    target.render = function() {
        return makeComponentReactive.call(this, baseRender)
    }
    return componentClass
}

function mixinLifecycleEvents(target) {
    ['componentDidMount', 'componentWillUnmount', 'componentDidUpdate'].forEach(
        function(funcName) {
            patch(target, funcName)
        }
    )
    if (!target.shouldComponentUpdate) {
        target.shouldComponentUpdate = reactiveMixin.shouldComponentUpdate
    } else {
        if (target.shouldComponentUpdate !== reactiveMixin.shouldComponentUpdate) {
            // TODO: make throw in next major
            console.warn(
                'Use `shouldComponentUpdate` in an `observer` based component breaks the behavior of `observer` and might lead to unexpected results. Manually implementing `sCU` should not be needed when using mobx-react.'
            )
        }
    }
}

export const Observer = observer(
    ({
        children,
        inject: observerInject,
        render
    }) => {
        const component = children || render
        if (typeof component === 'undefined') {
            return null
        }
        if (!observerInject) {
            return component()
        }
        // TODO: remove in next major
        console.warn(
            '<Observer inject=.../> is no longer supported. Please use inject on the enclosing component instead'
        )
        const InjectComponent = inject(observerInject)(component)
        return <InjectComponent / >
    }
)

Observer.displayName = 'Observer'

const ObserverPropsCheck = (
    props,
    key,
    componentName,
    location,
    propFullName
) => {
    const extraKey = key === 'children' ? 'render' : 'children'
    if (
        typeof props[key] === 'function' &&
        typeof props[extraKey] === 'function'
    ) {
        return new Error('Invalid prop,do not use children and render in the same time in`' +componentName)
    }

    if (
        typeof props[key] === 'function' ||
        typeof props[extraKey] === 'function'
    ) {
        return
    }
    return new Error('Invalid prop `' +propFullName +'` of type `' +typeof props[key] +'` supplied to' +' `' +componentName +'`, expected `function`.')
}

Observer.propTypes = {
    render: ObserverPropsCheck,
    children: ObserverPropsCheck
}
