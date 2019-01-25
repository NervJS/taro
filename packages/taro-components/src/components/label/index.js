import 'weui'
import Nerv from 'nervjs'

class Label extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const {...reset} = this.props
    return <label {...reset}>{this.props.children}</label>
  }
}

export default Label
