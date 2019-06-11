import { Reaction, _allowStateChanges } from 'mobx'
import { errorsReporter } from './reporter'

function isStateless (component, renderMedthod) {
  return !(component.prototype && component.prototype[renderMedthod])
}

export function observer (Component, renderMedthod) {
  if (typeof Component !== 'function' || isStateless(Component, renderMedthod)) {
    throw new Error("Please pass a valid component to 'observer'")
  }

  if (Component.isMobxInjector === true) {
    console.warn(
      "Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"
    )
  }

  class ObserverComponent extends Component {
    componentWillMount () {
      const initialName =
            this.displayName ||
            this.name ||
            (this.constructor && (this.constructor.displayName || this.constructor.name)) ||
            '<component>'
      this._reaction = new Reaction(`${initialName}_${Date.now()}`, () => {
        if (typeof this.componentWillReact === 'function') {
          this.componentWillReact()
        }
        this.forceUpdate()
      })
      if (typeof super.componentWillMount === 'function') {
        super.componentWillMount()
      }
    }

    componentWillUnmount () {
      this._reaction.dispose()
      if (typeof super.componentWillUnmount === 'function') {
        super.componentWillUnmount()
      }
    }
  }

  const target = ObserverComponent.prototype
  const originRender = target[renderMedthod]
  target[renderMedthod] = function (...args) {
    let result
    let exception
    if (this._reaction && this._reaction instanceof Reaction) {
      this._reaction.track(() => {
        try {
          result = _allowStateChanges(false, () => originRender.call(this, null, null, args[2]))
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

  return ObserverComponent
}
