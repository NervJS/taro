import { Reaction } from 'mobx'
import { errorsReporter, isUsingStaticRendering } from '@tarojs/mobx-common'

export function observer (component) {
  if (isUsingStaticRendering()) {
    return component
  }

  if (component.isMobxInjector === true) {
    console.warn(
      "Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"
    )
  }

  const target = component.prototype
  const originConstructor = target._constructor
  target._constructor = function () {
    if (this.$scope) {
      const initialName = this.displayName || this.name
      this._reaction = new Reaction(`${initialName}_${Date.now()}`, () => {
        this.componentWillReact && this.componentWillReact()
        this.forceUpdate()
      })
    }
    originConstructor && originConstructor.call(this, this.props)
  }

  const originComponentWillUnmount = target.componentWillUnmount
  target.componentWillUnmount = function () {
    this._reaction.dispose()
    originComponentWillUnmount && originComponentWillUnmount.call(this)
  }

  const originRender = target._createData
  target._createData = function (...args) {
    let result
    let exception
    if (this._reaction instanceof Reaction) {
      this._reaction.track(() => {
        try {
          result = originRender.call(this, null, null, args[2])
        } catch (e) {
          exception = e
        }
      })
    } else {
      result = originRender.call(this, null, null, args[2])
    }
    if (exception) {
      errorsReporter.emit(exception)
      throw exception
    }
    return result
  }

  return component
}
