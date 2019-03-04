import { updateComponent } from './lifecycle'
import { filterProps } from './create-component'

class Manager {
  map = {}
  observers = {}

  set (props = {}, compid) {
    const { observers } = this
    if (!this.map[compid]) {
      Object.defineProperty(this.map, compid, {
        get () {
          return this[`__${compid}`]
        },
        set (props) {
          this[`__${compid}`] = props

          const component = observers[compid] && observers[compid].component
          const ComponentClass = observers[compid] && observers[compid].ComponentClass
          if (!component || !ComponentClass || !component.__isReady) return

          if (component.unmounting) {
            delete observers[compid]
            return
          }

          const nextProps = filterProps(ComponentClass.properties, ComponentClass.defaultProps, props, component.props)
          component.props = nextProps
          component._unsafeCallUpdate = true
          updateComponent(component)
          component._unsafeCallUpdate = false
        }
      })
    }
    this.map[compid] = props
  }

  delete (compid) {
    this.map[compid] = {}
  }
}

export default new Manager()
