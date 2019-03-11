import Nerv from 'nervjs'

class MovableView extends Nerv.Component {
  componentDidMount () {
    console.error('H5 暂不支持 MovableView 组件！')
  }

  render () {
    const { ...reset } = this.props
    return <div {...reset}>{this.props.children}</div>
  }
}

class MovableArea extends Nerv.Component {
  componentDidMount () {
    console.error('H5 暂不支持 MovableArea 组件！')
  }

  render () {
    const { ...reset } = this.props
    return <div {...reset}>{this.props.children}</div>
  }
}

export { MovableArea, MovableView }
