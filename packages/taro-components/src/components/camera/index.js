import Nerv from 'nervjs'

class Camera extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  componentDidMount () {
    console.error('h5 暂不支持 Camera 组件')
  }

  render () {
    return <div />
  }
}

export default Camera
