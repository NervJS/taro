import Nerv from 'nervjs'

class Navigator extends Nerv.Component {
  componentDidMount () {
    console.error('H5 暂不支持 Navigator 组件！请直接用 a 标签代替')
  }

  render () {
    const { ...reset } = this.props
    return <div {...reset}>{this.props.children}</div>
  }
}

export default Navigator
