import { objClone } from './util'
class Component {
  $components = {}
  $$components = {}
  $path = ''
  $name = ''
  $isComponent = true
  $props = {}
  defaultProps = {}
  nextProps = {}
  constructor(props) {
    this.state = {}
    this.state = (this._createData && this._createData()) || {}
    this.props = props || {}
  }

  _initData($root, $parent) {
    this.$app = getApp()
    this.$root = $root || this
    this.$parent = $parent || null
    this.defaultData = {}
    this.$data = $parent ? $parent.$data : {}

    let path = this.$path.split('$$').pop()
    this.$data[`$$${path}`] = this.$data[`$$${path}`] || {}
    this.$data = this.$data[`$$${path}`]
    for (let k in this.state) {
      this.$data[k] = this.state[k]
    }
    if (this.props) {
      for (let k in this.props) {
        this.$data[k] = this.props[k]
      }
    }

    Object.getOwnPropertyNames(this.$$components).forEach(name => {
      this.$$components[name]._initData(this.$root, this)
    })
  }
  _init(scope) {
    this.$scope = scope
    this.$app = getApp()
    Object.getOwnPropertyNames(this.$$components).forEach(name => {
      this.$$components[name]._init(this.$scope)
    })
  }
  // rewrite when compile
  _createData() {
    return this.state
  }

  setState(state) {
    this._setState(state, true)
  }

  _setState(state, update) {
    let newState = {}
    switch (typeof state) {
      case 'function':
        newState = state(this.state, this.props)
        break
      case 'object':
        newState = state
        break
      default:
        throw new Error('parameter error!')
    }
    if (this.shouldComponentUpdate(this.nextProps, newState)) {
      const state = Object.assign({}, this.state)
      delete state.__data
      this.state = Object.assign({}, state, newState)
      this.lastProps = objClone(this.props)
      this.props = Object.assign(this.props, this.nextProps)
      this._createData && this._createData()

      for (let k in this.$props) {
        const newChildProps = this.$props[k]()
        this.$$components[k].componentWillReceiveProps(newChildProps)
        this.$$components[k].nextProps = newChildProps
        this.$$components[k]._setState({}, false)
      }
      this.componentWillUpdate(this.lastProps, this.nextProps)
      Object.assign(this.$data, this.state, this.props)
      this._update(update)
    } else {
      this.state = Object.assign(this.state, newState)
      this._createData && this._createData()
      this.props = Object.assign(this.props, this.nextProps)
    }
  }
  _update(update) {
    let self = this
    this.$scope._setData(
      { ...this.$root.$data },
      (function(lastProps, props) {
        return function() {
          self.componentDidUpdate(lastProps, props)
        }
      })(this.lastProps, this.props),
      update
    )
  }

  // onLoad
  componentWillMount() {
    Object.getOwnPropertyNames(this.$$components).forEach(name => {
      this.$$components[name].componentWillMount()
    })
  }
  // onReady
  componentDidMount() {
    Object.getOwnPropertyNames(this.$$components).forEach(name => {
      this.$$components[name].componentDidMount()
    })
  }
  // onUnload
  componentDidUnmout() {
    Object.getOwnPropertyNames(this.$$components).forEach(name => {
      this.$$components[name].componentWillUnmout()
    })
  }
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return true
  }
  componentWillUpdate(lastProps, nextProps) {}
  componentDidUpdate(lastProps, nextProps) {}
  //  Not supported in component
  componentWillUnmout() {}
  onShow() {}
  onHide() {}
  onLaunch() {}
}

export default Component
