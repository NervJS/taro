import { updateComponent } from './lifecycle'
import { filterProps } from './create-component'
import nextTick from './next-tick'

class Manager {
  map = {}
  observers = {}

  set (props = {}, compid, previd) {
    if (!compid) return

    if (previd) {
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

          const extraProps = (component.$scope && component.$scope.data && component.$scope.data.extraProps) || null
          const nextProps = filterProps(ComponentClass.defaultProps, props, component.props, extraProps)
          // 这里原来是提前修改了 props, 实际更新又是nextTick异步的，这样可以会导致很多问题
          // 很难保证如果开发者无意中多次并发更新，props可能提前于生命周期被获取到
          component.nextProps = nextProps
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
