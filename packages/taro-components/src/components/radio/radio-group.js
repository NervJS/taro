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
    let checkValue
    let _value = this.radioValue.map((item, idx) => {
      let curValue = item.value
      if (isNumber(item.value)) curValue = item.value.toString()
      if (e.target.value === curValue) {
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
              for: _key,
              name: name
            })
          }
          return ch
        })
        return Nerv.cloneElement(item, { for: _key }, chd)
      }
    )

    function isChildOf (child, parent) {
      // console.log('参数child=' + child + '-' + child.nodeName, '参数parent=' + parent + '-' + parent.nodeName)
      if (child && parent) {
        if (child === parent) return true
        var myParentNode = child.parentNode // 定义临时变量，并初始化为child参数的父节点
        while (myParentNode) {
          // console.log('myParentNode=' + myParentNode + '-' + myParentNode.nodeName)
          if (myParentNode === parent) {
            // 如果myParentNode等于parent参数，则证明child参数是parent参数的后代
            return true
          } else {
            // 找myParentNode的上一代
            myParentNode = myParentNode.parentNode
          }
        }
      }
      // 遍历结束后，都没有返回true，则说明child参数找不到它的祖先parent参数
      return false
    }
    /* TODO 规避Nerv数组diff问题 */
    return (<div className='weui-cells_radiogroup'
      {...omit(this.props, [
        'onChange'
      ])}
      onClick={e => {
        let index = -1
        const cs = (e && e.currentTarget && e.currentTarget.children) || []
        for (let i = 0; i < cs.length; i++) {
          if (isChildOf(e.toElement, cs[i])) index = i
        }
        if (index > -1) {
          this.props.onChange(e, index)
        }
      }}>{children}
    </div>)
  }
}

export default RadioGroup
