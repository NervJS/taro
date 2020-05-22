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
        if (item.name === 'Checkbox') {
          return handleChecked.bind(this)(item, i, _key, name)
        } else {
          return Nerv.cloneElement(item, '', Nerv.Children.toArray(item.props.children).map(ch => {
            if (ch && ch.name === 'Checkbox') {
              return handleChecked.bind(this)(ch, i, _key, name)
            }
            return ch
          }))
        }
      }
    )

    return children
  }
}

function handleChecked (d, i, key, name) {
  if (d.props.checked) {
    this.state.value[i] = {
      name: d.props.name,
      value: d.props.value,
      checked: true
    }
  } else {
    this.state.value[i] = {
      name: d.props.name,
      value: d.props.value,
      checked: false
    }
  }

  return Nerv.cloneElement(d, {
    onChange: e => this.toggleChange(e, i),
    for: key,
    name: name
  })
}

export default CheckboxGroup
