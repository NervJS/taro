import { autorun } from 'mobx'

/**
 * Observer function / decorator
 */
export function observer (Component) {
  if (typeof Component !== 'function') {
    throw new Error("Please pass a valid component to 'observer'")
  }

  if (Component.isMobxInjector === true) {
    console.warn(
      "Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"
    )
  }

  let displayName =
        'inject-' +
        (Component.displayName ||
          Component.name ||
            (Component.constructor && Component.constructor.name) ||
            'Unknown')
  return class extends Component {
    static displayName = displayName
    componentWillMount () {
      this._autorunDispose = autorun(() => {
        this.forceUpdate()
        if (typeof this.componentWillReact === 'function') {
          this.componentWillReact()
        }
      })
      if (typeof super.componentWillMount === 'function') {
        super.componentWillMount()
      }
    }

    componentWillUnmount () {
      this._autorunDispose()
      if (typeof super.componentWillUnmount === 'function') {
        super.componentWillUnmount()
      }
    }
  }
}