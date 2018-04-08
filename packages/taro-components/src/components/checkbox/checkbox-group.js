import Nerv from 'nervjs'

class CheckboxGroup extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      value: []
    }
    this.toggleChange = this.toggleChange.bind(this)
  }

  toggleChange (e, i) {
    this.state.value[i] = {
      name: e.target.value,
      value: e.target.textContent,
      checked: e.target.checked
    }
    const { onChange } = this.props
    onChange({ detail: { value: this.state.value } })
  }

  render () {
    const { name = '' } = this.props
    // 给 children 绑定事件
    const children = Nerv.Children.toArray(this.props.children).map(
      (item, i) => {
        let _key = item.props.for
        return Nerv.Children.toArray(item.props.children).map(ch => {
          if (ch.name === 'Checkbox') {
            if (ch.props.checked) {
              this.state.value[i] = {
                name: ch.props.value,
                value: ch.props.children.props.children,
                checked: true
              }
            } else {
              this.state.value[i] = {
                name: ch.props.value,
                value: ch.props.children.props.children,
                checked: false
              }
            }

            return Nerv.cloneElement(ch, {
              onChange: e => this.toggleChange(e, i),
              for: _key,
              name: name
            })
          }
          return ch
        })
      }
    )

    return children
  }
}

export default CheckboxGroup
