import { Reaction, _allowStateChanges } from 'mobx'

export function observer (Component) {
  if (typeof Component !== 'function') {
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
  const originCreateData = target._createData
  target._createData = function () {
    let result
    let exception
    if (this._reaction && this._reaction instanceof Reaction) {
      this._reaction.track(() => {
        try {
          result = _allowStateChanges(false, originCreateData.bind(this))
        } catch (e) {
          exception = e
        }
      })
    } else {
      result = originCreateData.call(this)
    }
    if (exception) {
      throw exception
    }
    return result
  }

  return ObserverComponent
}
