import Nerv from 'nervjs'

class Canvas extends Nerv.Component {
  componentDidMount () {
    console.error('H5 暂不支持 Canvas 组件！,请直接用 H5 原生 canvas')
  }

  render () {
    const { ...reset } = this.props
    return <div {...reset}>{this.props.children}</div>
  }
}

export default Canvas
