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

  const originComponentWillUnmount = target.componentWillUnmount
  target.componentWillUnmount = function () {
    this._reaction.dispose()
    originComponentWillUnmount && originComponentWillUnmount.call(this)
  }

  const originRender = target.render
  target.render = function (...args) {
    if (!this._reaction) {
      const initialName = this.displayName || this.name
      this._reaction = new Reaction(`${initialName}_${Date.now()}`, () => {
        this.componentWillReact && this.componentWillReact()
        this.forceUpdate()
      })
    }

    let result
    let exception
    this._reaction.track(() => {
      try {
        result = originRender.call(this, null, null, args[2])
      } catch (e) {
        exception = e
      }
    })
    if (exception) {
      errorsReporter.emit(exception)
      throw exception
    }
    return result
  }

  return component
}
