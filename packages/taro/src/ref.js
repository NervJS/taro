export function createRef () {
  return {
    current: null
  }
}

/**
 * 赋值 ref
 * @param {Object} ref ref 对象/ref 函数/ref 字符串
 * @param {Object} target dom/component
 * @param {Object} component 组件实例
 * @param {Object} refs 字符串 ref 搜集器
 */
export function commitAttachRef (ref, target, component, refs, isInit = false) {
  if (isInit && !target) return

  if ('refName' in ref && ref['refName']) {
    refs[ref.refName] = target
  } else if ('fn' in ref && typeof ref['fn'] === 'function') {
    ref['fn'].call(component, target)
  } else if (ref['fn'] && typeof ref['fn'] === 'object' && 'current' in ref['fn']) {
    ref['fn'].current = target
  }
}

export function detachAllRef (component) {
  if (component['$$refs'] && component['$$refs'].length > 0) {
    component['$$refs'].forEach(ref => {
      if (typeof ref['fn'] === 'function') {
        ref['fn'].call(component, null)
      } else if (ref['fn'] && typeof ref['fn'] === 'object' && 'current' in ref['fn']) {
        ref['fn'].current = null
      }
      if ('target' in ref) delete ref['target']
    })
    component.refs = {}
  }
}

export class RefsArray extends Array {
  /**
   * @param {Array} initList
   */
  constructor (initList = []) {
    super(...initList)
    this.inited = false
  }
  pushRefs ($$refs) {
    if (this.inited) return
    $$refs.forEach(ref => this.pushRef(ref))
    this.inited = true
  }
  pushRef (ref) {
    const isExist = this.find(item => item.id === ref.id)
    !isExist && this.push(ref)
  }
}

export function handleLoopRef (getElementById) {
  return (component, id, type, handler) => {
    if (!component) return null

    const dom = getElementById(component, id, type)

    const handlerType = typeof handler
    if (handlerType !== 'function' && handlerType !== 'object') {
      return console.warn(`循环 Ref 只支持函数或 createRef()，当前类型为：${handlerType}`)
    }

    if (handlerType === 'object') {
      handler.current = dom
    } else if (handlerType === 'function') {
      handler.call(component.$component, dom)
    }
  }
}
