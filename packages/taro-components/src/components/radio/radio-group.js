import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import { isNumber } from '../../utils/parse-type'
class RadioGroup extends Nerv.Component {
  constructor () {
    super(...arguments)
    // this.state = {
    //   value: []
    // }
    this.uniqueName = Date.now().toString(36)
    this.radioValue = []
    this.toggleChange = this.toggleChange.bind(this)
  }

  toggleChange (e, i) {
    const val = e.target.value || e.target.querySelector('input[type=radio]').value
    let checkValue
    let _value = this.radioValue.map((item, idx) => {
      let curValue = item.value
      if (isNumber(item.value)) curValue = item.value.toString()
      if (val === curValue) {
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
    onChange && onChange(e)
  }

  render () {
    const { name = this.uniqueName } = this.props
    // 给 children 绑定事件
    const children = Nerv.Children.toArray(this.props.children).map(
      (item, i) => {
        let _key = item.props.for || i
        if (item.name === 'Radio') {
          this.radioValue[i] = {
            name: item.props.name,
            value: item.props.value,
            checked: !!item.props.checked
          }
          return Nerv.cloneElement(item, {
            onChange: e => this.toggleChange(e, i),
            for: _key,
            name: name
          })
        } else {
          const chd = Nerv.Children.toArray(item.props.children).map(ch => {
            if (ch.name === 'Radio') {
              this.radioValue[i] = {
                name: ch.props.name,
                value: ch.props.value,
                checked: !!ch.props.checked
              }
              return Nerv.cloneElement(ch, {
                onChange: e => this.toggleChange(e, i),
                for: _key,
                name: name
              })
            }
            return ch
          })
          return Nerv.cloneElement(item, { for: _key }, chd)
        }
      }
    )

    /* TODO 规避Nerv数组diff问题 */
    return (<div className='weui-cells_radiogroup'
      name={name}
      {...omit(this.props, [
        'name',
        'onChange'
      ])}>{children}
    </div>)
  }
}

export default RadioGroup
