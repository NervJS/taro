import { Reaction } from 'mobx'
import { isMiniPlatform } from './utils'
import { errorsReporter } from './reporter'
import { isUsingStaticRendering } from './staticRendering'

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
  const originComponentWillMount = target.componentWillMount
  const originComponentWillReact = target.componentWillReact
  target.componentWillMount = function () {
    const initialName = this.displayName || this.name
    this._reaction = new Reaction(`${initialName}_${Date.now()}`, () => {
      this.forceUpdate()
      originComponentWillReact && originComponentWillReact.call(this)
    })
    originComponentWillMount && originComponentWillMount.call(this)
  }

  const originComponentWillUnmount = target.componentWillUnmount
  target.componentWillUnmount = function () {
    this._reaction.dispose()
    originComponentWillUnmount && originComponentWillUnmount.call(this)
  }

  const renderMethod = isMiniPlatform() ? '_createData' : 'render'
  const originRender = target[renderMethod]
  target[renderMethod] = function (...args) {
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
