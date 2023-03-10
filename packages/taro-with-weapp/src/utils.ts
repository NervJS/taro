/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

/**
 * Simple bind, faster than native
 */
export function bind (fn /*: Function */, ctx /*: Object */) /*: Function */ {
  if (!fn) return false

  function boundFn (a) {
    const l /*: number */ = arguments.length
    return l ? (l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a)) : fn.call(ctx)
  }

  // record original fn length
  boundFn._length = fn.length
  return boundFn
}

export function isEqual (obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export function noop (..._: unknown[]) {
  //
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

export function safeGet (obj, propsArg, defaultValue?) {
  if (!obj) {
    return defaultValue
  }
  let props, prop
  if (Array.isArray(propsArg)) {
    props = propsArg.slice(0)
  }
  if (typeof propsArg === 'string') {
    props = propsArg.replace(/\[(.+?)\]/g, '.$1')
    props = props.split('.')
  }
  if (typeof propsArg === 'symbol') {
    props = [propsArg]
  }
  if (!Array.isArray(props)) {
    throw new Error('props arg must be an array, a string or a symbol')
  }
  while (props.length) {
    prop = props.shift()
    if (!obj) {
      return defaultValue
    }
    obj = obj[prop]
    if (obj === undefined) {
      return defaultValue
    }
  }
  return obj
}

export function safeSet (obj, props, value) {
  if (typeof props === 'string') {
    props = props.replace(/\[(.+?)\]/g, '.$1')
    props = props.split('.')
  }
  if (typeof props === 'symbol') {
    props = [props]
  }
  const lastProp = props.pop()
  if (!lastProp) {
    return false
  }
  let thisProp
  while ((thisProp = props.shift())) {
    if (typeof obj[thisProp] === 'undefined') {
      obj[thisProp] = {}
    }

    // 直接按路径修改 this.state 可能会导致 nextProps 也被修改
    // 因此按路径寻找时，每一层都复制一遍
    if (Array.isArray(obj[thisProp])) {
      obj[thisProp] = [...obj[thisProp]]
    } else if (typeof obj[thisProp] === 'object') {
      obj[thisProp] = { ...obj[thisProp] }
    }

    obj = obj[thisProp]
    if (!obj || typeof obj !== 'object') {
      return false
    }
  }
  obj[lastProp] = value
  return true
}

export function report (msg) {
  console.warn('[Taro Convert Warning] ' + msg)
}

export const nonsupport = new Map([
  ['onError', '不支持 App 的 onError 生命周期方法。'],
  ['onPageNotFound', '不支持 App 的 onPageNotFound 生命周期方法。'],
  ['onUnhandledRejection', '不支持 App 的 onUnhandledRejection 生命周期方法。'],
  ['onThemeChange', '不支持 App 的 onThemeChange 生命周期方法。'],
  ['moved', '不支持自定义组件的 moved 生命周期。'],
  ['externalClasses', '不支持自定义组件的 externalClasses 功能。'],
  ['relations', '不支持自定义组件的 relations 功能。'],
  ['options', '不支持自定义组件的 options 功能。'],
  ['definitionFilter', '不支持自定义组件的 definitionFilter 功能。'],
  ['selectComponent', 'selectComponent 方法产生不到目标效果，请使用 React 的 ref 进行重构。'],
  ['selectAllComponents', 'selectAllComponents 方法产生不到目标效果，请使用 React 的 ref 进行重构。'],
  ['selectOwnerComponent', 'selectOwnerComponent 方法产生不到目标效果，请使用 React 语法重构。'],
  ['groupSetData', 'groupSetData 方法产生不到目标效果，请使用 React 语法重构。']
])

export function flattenBehaviors (behavior, behaviorMap: Map<string, any[]>) {
  if (typeof behavior === 'string') {
    return report(`不支持使用内置 Behavior: [${behavior}]`)
  }
  const subBehaviors = behavior.behaviors
  if (subBehaviors?.length) {
    subBehaviors.forEach(subBehavior => flattenBehaviors(subBehavior, behaviorMap))
  }

  Object.keys(behavior).forEach(key => {
    // 不支持的属性
    if (nonsupport.has(key)) {
      const advise = nonsupport.get(key)
      return report(advise)
    }

    if (behaviorMap.has(key)) {
      const list = behaviorMap.get(key)!
      const value = behavior[key]
      list.push(value)
    }
  })
}
