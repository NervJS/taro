import Nerv from 'nervjs'

class PickerViewColumn extends Nerv.Component {
  componentDidMount () {
    console.error('H5 暂不支持 PickerViewColumn 组件！')
  }

  render () {
    const { ...rest } = this.props
    return <div {...rest}>{this.props.children}</div>
  }
}

export default PickerViewColumn
