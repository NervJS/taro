import 'weui'
import Nerv from 'nervjs'

class CheckboxGroup extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      value: []
    }
    this.uniqueName = Date.now().toString(36)
    this.toggleChange = this.toggleChange.bind(this)
  }

  toggleChange (e, i) {
    this.state.value[i] = {
      name: e.target.textContent,
      value: e.target.value,
      checked: e.target.checked
    }
    const resp = []
    this.state.value.forEach(v => {
      if (v.checked) {
        resp.push(v.value)
      }
    })
    const { onChange } = this.props
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: {
        value: resp
      }
    })
    onChange && onChange(e)
  }

  render () {
    const { name = this.uniqueName } = this.props
    // 给 children 绑定事件
    const children = Nerv.Children.toArray(this.props.children).map(
      (item, i) => {
        let _key = item.props.for
        const chd = Nerv.Children.toArray(item.props.children).map(ch => {
          if (ch && ch.name === 'Checkbox') {
            if (ch.props.checked) {
              this.state.value[i] = {
                name: ch.props.name,
                value: ch.props.value,
                checked: true
              }
            } else {
              this.state.value[i] = {
                name: ch.props.name,
                value: ch.props.value,
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

        return Nerv.cloneElement(item, '', chd)
      }
    )

    return children
  }
}

export default CheckboxGroup
