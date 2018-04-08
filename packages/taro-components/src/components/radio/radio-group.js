import Nerv from 'nervjs'

class RadioGroup extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      value: []
    }
    this.toggleChange = this.toggleChange.bind(this)
  }

  toggleChange (e, i) {
    let _value = this.state.value.map((item, idx) => {
      if (e.target.checked) {
        return {
          name: item.value,
          value: item.name,
          checked: !item.checked
        }
      }
    })
    this.state.value = _value
    const { onChange } = this.props
    onChange({ detail: { value: _value } })
  }

  getRandomID () {
    return (
      'radio' +
      Math.random()
        .toString(36)
        .substring(2, 15)
    )
  }

  render () {
    // let randomRadioId =
    // 'radio' +
    // Math.random()
    //   .toString(36)
    //   .substring(2, 15)
    const { name = '' } = this.props
    // 给 children 绑定事件

    const children = Nerv.Children.toArray(this.props.children).map(
      (item, i) => {
        let _key = item.props.for
        return Nerv.Children.toArray(item.props.children).map(ch => {
          if (ch.name === 'Radio') {
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

export default RadioGroup
