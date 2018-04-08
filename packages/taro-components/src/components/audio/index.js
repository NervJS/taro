import Nerv from 'nervjs'
import './style/index.scss'

class Audio extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  componentDidMount () {
    this.initVideo()
  }

  initVideo () {
    // 绑定事件
    this.bindevent()
  }

  bindevent () {
    this.radio.addEventListener('timeupdate', (e) => {
      this.props.bindtimeupdate(e)
    })

    this.radio.addEventListener('ended', (e) => {
      this.props.bindended(e)
    })

    this.radio.addEventListener('play', (e) => {
      this.props.bindplay(e)
    })

    this.radio.addEventListener('pause', (e) => {
      this.props.bindpause(e)
    })

    // 网络错误
    this.radio.addEventListener('stalled', (data) => {
      let e = {}
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        errMsg: 2
      })
      this.props.bindended(e)
    })

    // 获取资源被用户禁止
    this.radio.addEventListener('abort', (data) => {
      let e = {}
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        errMsg: 1
      })
      this.props.bindended(e)
    })

    // 解码错误
    this.radio.addEventListener('error', (data) => {
      let e = {}
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        errMsg: 3
      })
      this.props.bindended(e)
    })

    // 不合适资源
    this.radio.addEventListener('error', (data) => {
      let e = {}
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        errMsg: 4
      })
      this.props.bindended(e)
    })
  }

  render () {
    let {
      src,
      controls,
      autoplay,
      initialTime,
      id,
      loop,
      muted
    } = this.props
    return (
      <audio
        id={id}
        src={src}
        controls={controls}
        autoplay={autoplay}
        start={initialTime}
        loop={loop}
        muted={muted}
        ref={(radio) => { this.radio = radio }}>
        暂时不支持播放该视频
      </audio>
    )
  }
}

// 默认配置
Audio.defaultProps = {
  autoplay: false,
  controls: true,
  loop: false,
  muted: false
}

export default Audio
