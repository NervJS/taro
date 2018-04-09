import Nerv from 'nervjs'

class Label extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const key = this.props.for

    return <label for={key}>{this.props.children}</label>
  }
}

export default Label
