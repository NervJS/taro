import { updateComponent } from './lifecycle'
import { filterProps } from './create-component'
import nextTick from './next-tick'

class Manager {
  map = {}
  observers = {}

  set (props = {}, compid, previd) {
    if (!compid) return

    if (previd) {
      this.observers[compid] = this.observers[previd]
      this.delete(previd)
    }

    const { observers } = this
    if (!this.map[compid]) {
      Object.defineProperty(this.map, compid, {
        configurable: true,
        get () {
          return this[`__${compid}`]
        },
        set (props) {
          this[`__${compid}`] = props

          const component = observers[compid] && observers[compid].component
          const ComponentClass = observers[compid] && observers[compid].ComponentClass
          if (!component || !ComponentClass || !component.__isReady) return

          const nextProps = filterProps(ComponentClass.defaultProps, props, component.props)
          component.props = nextProps
          nextTick(() => {
            component._unsafeCallUpdate = true
            updateComponent(component)
            component._unsafeCallUpdate = false
          })
        }
      })
    }
    this.map[compid] = props
  }

  delete (compid) {
    delete this.map[compid]
    delete this.map[`__${compid}`]
    delete this.observers[compid]
  }
}

export default new Manager()
