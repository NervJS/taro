import { setStore } from './store'

export default function createProvider (Component, Children) {
  return class Provider extends Component {
    constructor (props) {
      super(props)
      setStore(props.store)
    }

    render () {
      return Children.only(this.props.children)
    }
  }
}
