import 'weui'
import Nerv from 'nervjs'

export default class Block extends Nerv.Component {
  render () {
    return <div>{this.props.children}</div>
  }
}
