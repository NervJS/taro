import Nerv from 'nervjs'

class RadioGroup extends Nerv.Component {
  constructor () {
    super(...arguments)
    // this.state = {
    //   value: []
    // }
    this.radioValue = []
    this.toggleChange = this.toggleChange.bind(this)
  }

  toggleChange (e, i) {
    let checkValue
    let _value = this.radioValue.map((item, idx) => {
      if (e.target.value === item.value) {
        checkValue = item.value
        return {
          name: item.name,
          value: item.value,
          checked: !item.checked
        }
      }
      return item
    })
    this.radioValue = _value
    const { onChange } = this.props
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: {
        value: checkValue
      }
    })
    onChange(e)
  }

  render () {
    // 给 children 绑定事件

    const children = Nerv.Children.toArray(this.props.children).map(
      (item, i) => {
        let _key = item.props.for
        const chd = Nerv.Children.toArray(item.props.children).map(ch => {
          if (ch.name === 'Radio') {
            if (ch.props.checked) {
              this.radioValue[i] = {
                name: ch.props.name,
                value: ch.props.value,
                checked: true
              }
            } else {
              this.radioValue[i] = {
                name: ch.props.name,
                value: ch.props.value,
                checked: false
              }
            }
            return Nerv.cloneElement(ch, {
              onChange: e => this.toggleChange(e, i),
              for: _key
            })
          }
          return ch
        })
        return Nerv.cloneElement(item, '', chd)
      }
    )

    return children
  }
}

export default RadioGroup
