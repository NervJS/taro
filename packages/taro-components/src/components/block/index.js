import 'weui'
import Nerv from 'nervjs'

export default class Block extends Nerv.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <div>{this.props.children}</div>
  }
}
