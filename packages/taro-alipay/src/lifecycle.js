import {
  internal_safe_get as safeGet,
  internal_safe_set as safeSet
} from '@tarojs/taro'
import { componentTrigger } from './create-component'
import { shakeFnFromObject, isEmptyObject, diffObjToPath } from './util'
import PropTypes from 'prop-types'

const isDEV = typeof process === 'undefined' ||
  !process.env ||
  process.env.NODE_ENV !== 'production'
const privatePropKeyName = '_triggerObserer'

export function updateComponent (component) {
  const { props, __propTypes } = component
  if (isDEV && __propTypes) {
    const componentName = component.constructor.name || component.constructor.toString().match(/^function\s*([^\s(]+)/)[1]
    PropTypes.checkPropTypes(__propTypes, props, 'prop', componentName)
  }
  const prevProps = component.prevProps || props
  component.props = prevProps
  if (component.__mounted && component._unsafeCallUpdate === true && component.componentWillReceiveProps) {
    component._disable = true
    component.componentWillReceiveProps(props)
    component._disable = false
  }
  // 在willMount前执行构造函数的副本
  if (!component.__mounted) {
    component._constructor && component._constructor(props)
  }
  let state = component.getState()

  const prevState = component.prevState || state

  let skip = false
  if (component.__mounted) {
    if (typeof component.shouldComponentUpdate === 'function' &&
      component.shouldComponentUpdate(props, state) === false) {
      skip = true
    } else if (typeof component.componentWillUpdate === 'function') {
      component.componentWillUpdate(props, state)
    }
  }
  component.props = props
  component.state = state
  component._dirty = false
  if (!component.__componentWillMountTriggered) {
    component.__componentWillMountTriggered = true
    componentTrigger(component, 'componentWillMount')
  }
  if (!skip) {
    doUpdate(component, prevProps, prevState)
  }
  component.prevProps = component.props
  component.prevState = component.state
}

function doUpdate (component, prevProps, prevState) {
  const { state, props = {} } = component
  let data = state || {}
  if (component._createData) {
    // 返回null或undefined则保持不变
    const isRunLoopRef = !component.__mounted
    data = component._createData(state, props, isRunLoopRef) || data
  }
  let privatePropKeyVal = component.$scope.data[privatePropKeyName] || false

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
  data[privatePropKeyName] = !privatePropKeyVal
  const dataDiff = diffObjToPath(data, component.$scope.data)

  // 每次 setData 都独立生成一个 callback 数组
  let cbs = []
  if (component._pendingCallbacks && component._pendingCallbacks.length) {
    cbs = component._pendingCallbacks
    component._pendingCallbacks = []
  }

  component.$scope.setData(dataDiff, function () {
    if (component.__mounted) {
      if (component['$$refs'] && component['$$refs'].length > 0) {
        component['$$refs'].forEach(ref => {
          if (ref.type !== 'component') return

          const _childs = component.$scope._childs || {}
          let target = _childs[ref.id] || null
          const prevRef = ref.target

          if (target !== prevRef) {
            if (ref.refName) component.refs[ref.refName] = target
            typeof ref.fn === 'function' && ref.fn.call(component, target)
            ref.target = target
          }
        })
      }

      if (component['$$hasLoopRef']) {
        component._createData(component.state, component.props, true)
      }

      if (typeof component.componentDidUpdate === 'function') {
        component.componentDidUpdate(prevProps, prevState)
      }
    }

    // 解决初始化时 onLoad 最先触发，但拿不到子组件 ref 的问题
    if (component.$componentType === 'PAGE' && component['$$hasLoopRef']) {
      component._createData(component.state, component.props, true)
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
      componentTrigger(component, 'componentDidShow')
    }
  })
}
