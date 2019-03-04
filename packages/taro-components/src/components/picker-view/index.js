import Nerv from 'nervjs'

class PickerView extends Nerv.Component {
  componentDidMount () {
    console.error('H5 暂不支持 PickerView 组件！')
  }

  render () {
    const { ...reset } = this.props
    return <div {...reset}>{this.props.children}</div>
  }
}

export default PickerView
