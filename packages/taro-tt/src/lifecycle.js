import {
  internal_safe_get as safeGet,
  internal_safe_set as safeSet,
  commitAttachRef,
  Current,
  invokeEffects
} from '@tarojs/taro'
import { componentTrigger } from './create-component'
import { shakeFnFromObject, isEmptyObject, diffObjToPath, isFunction, isUndefined, isArray } from './util'
import PropTypes from 'prop-types'
import { enqueueRender } from './render-queue'

const isDEV = typeof process === 'undefined' ||
  !process.env ||
  process.env.NODE_ENV !== 'production'

function hasNewLifecycle (component) {
  const { constructor: { getDerivedStateFromProps }, getSnapshotBeforeUpdate } = component
  return isFunction(getDerivedStateFromProps) || isFunction(getSnapshotBeforeUpdate)
}

function callGetDerivedStateFromProps (component, props, state) {
  const { getDerivedStateFromProps } = component.constructor
  let newState
  if (isFunction(getDerivedStateFromProps)) {
    const partialState = getDerivedStateFromProps(props, state)
    if (!isUndefined(partialState)) {
      newState = Object.assign({}, state, partialState)
    } else {
      console.warn('getDerivedStateFromProps 没有返回任何内容，这个生命周期必须返回 null 或一个新对象。')
    }
  }
  return newState
}

function callGetSnapshotBeforeUpdate (component, props, state) {
  const { getSnapshotBeforeUpdate } = component
  let snapshot
  if (isFunction(getSnapshotBeforeUpdate)) {
    snapshot = getSnapshotBeforeUpdate.call(component, props, state)
  }
  return snapshot
}

export function updateComponent (component) {
  const { props, __propTypes } = component
  if (isDEV && __propTypes) {
    let componentName = component.constructor.name
    if (isUndefined(componentName)) {
      const names = component.constructor.toString().match(/^function\s*([^\s(]+)/)
      componentName = isArray(names) ? names[0] : 'Component'
    }
    PropTypes.checkPropTypes(__propTypes, props, 'prop', componentName)
  }
  const prevProps = component.prevProps || props
  component.props = prevProps
  if (component.__mounted && component._unsafeCallUpdate === true && !hasNewLifecycle(component) && component.componentWillReceiveProps) {
    component._disable = true
    component.componentWillReceiveProps(props)
    component._disable = false
  }
  let state = component.getState()

  const prevState = component.prevState || state

  const stateFromProps = callGetDerivedStateFromProps(component, props, state)

  if (!isUndefined(stateFromProps)) {
    state = stateFromProps
  }

  let skip = false
  if (component.__mounted) {
    if (typeof component.shouldComponentUpdate === 'function' &&
      !component._isForceUpdate &&
      component.shouldComponentUpdate(props, state) === false) {
      skip = true
    } else if (!hasNewLifecycle(component) && isFunction(component.componentWillUpdate)) {
      component.componentWillUpdate(props, state)
    }
  }

  component.props = props
  component.state = state
  component._dirty = false
  component._isForceUpdate = false
  if (!skip) {
    doUpdate(component, prevProps, prevState)
  }
  component.prevProps = component.props
  component.prevState = component.state
}

function injectContextType (component) {
  const ctxType = component.constructor.contextType
  if (ctxType) {
    const context = ctxType.context
    const emiter = context.emiter
    if (emiter === null) {
      component.context = context._defaultValue
      return
    }
    if (!component._hasContext) {
      component._hasContext = true
      emiter.on(_ => enqueueRender(component))
    }
    component.context = emiter.value
  }
}

export function mountComponent (component) {
  const { props } = component
  // 在willMount前执行构造函数的副本
  if (!component.__componentWillMountTriggered) {
    component._constructor && component._constructor(props)
  }

  const newState = callGetDerivedStateFromProps(component, props, component.state)

  if (!isUndefined(newState)) {
    component.state = newState
  }

  component._dirty = false
  component._disable = false
  component._isForceUpdate = false
  if (!component.__componentWillMountTriggered) {
    component.__componentWillMountTriggered = true
    if (!hasNewLifecycle(component)) {
      componentTrigger(component, 'componentWillMount')
    }
  }
  doUpdate(component, props, component.state)
  component.prevProps = component.props
  component.prevState = component.state
}

function doUpdate (component, prevProps, prevState) {
  const { state, props = {} } = component
  let data = state || {}
  if (component._createData) {
    if (component.__isReady) {
      injectContextType(component)
      Current.current = component
      Current.index = 0
      invokeEffects(component, true)
    }
    data = component._createData(state, props) || data
    if (component.__isReady) {
      Current.current = null
    }
  }

  data = Object.assign({}, props, data)
  if (component.$usedState && component.$usedState.length) {
    const _data = {}
    component.$usedState.forEach(key => {
      let val = safeGet(data, key)
      if (typeof val === 'undefined') {
        return
      }
      if (typeof val === 'object') {
        if (isEmptyObject(val)) return safeSet(_data, key, val)

        val = shakeFnFromObject(val)
        // 避免筛选完 Fn 后产生了空对象还去渲染
        if (!isEmptyObject(val)) safeSet(_data, key, val)
      } else {
        safeSet(_data, key, val)
      }
    })
    data = _data
  }
  data['$taroCompReady'] = true
  const dataDiff = diffObjToPath(data, component.$scope.data)
  const __mounted = component.__mounted
  let snapshot
  if (__mounted) {
    snapshot = callGetSnapshotBeforeUpdate(component, prevProps, prevState)
  }

  // 每次 setData 都独立生成一个 callback 数组
  let cbs = []
  if (component._pendingCallbacks && component._pendingCallbacks.length) {
    cbs = component._pendingCallbacks
    component._pendingCallbacks = []
  }

  const cb = function () {
    if (component.__mounted) {
      invokeEffects(component)
      if (component['$$refs'] && component['$$refs'].length > 0) {
        component['$$refs'].forEach(ref => {
          // 只有 component 类型能做判断。因为 querySelector 每次调用都一定返回 nodeRefs，无法得知 dom 类型的挂载状态。
          if (ref.type !== 'component') return

          component.$scope.selectComponent(`#${ref.id}`, function (target) {
            target = target ? (target.$component || target) : null

            const prevRef = ref.target
            if (target !== prevRef) {
              commitAttachRef(ref, target, component, component.refs)
              ref.target = target
            }
          })
        })
      }

      if (component['$$hasLoopRef']) {
        Current.current = component
        component._disableEffect = true
        component._createData(component.state, component.props, true)
        component._disableEffect = false
        Current.current = null
      }

      if (typeof component.componentDidUpdate === 'function') {
        component.componentDidUpdate(prevProps, prevState, snapshot)
      }
    }

    if (cbs.length) {
      let i = cbs.length
      while (--i >= 0) {
        typeof cbs[i] === 'function' && cbs[i].call(component)
      }
    }
    if (!component.__mounted) {
      component.__mounted = true
      componentTrigger(component, 'componentDidMount')
    }
  }

  if (Object.keys(dataDiff).length === 0) {
    cb()
  } else {
    component.$scope.setData(dataDiff, cb)
  }
}
