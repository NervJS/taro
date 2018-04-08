import Nerv from 'nervjs'

class Label extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const key = this.props.for

    const children = Nerv.Children.map(this.props.children, child => {
      return Nerv.cloneElement(child, {
        for: key
      })
    })
    return children
  }
}

export default Label
