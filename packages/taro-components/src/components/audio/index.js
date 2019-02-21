import 'weui'
import Nerv from 'nervjs'
import './style/index.scss'

class Audio extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  componentDidMount () {
    this.bindevent()
  }

  bindevent () {
    this.audio.addEventListener('timeupdate', (e) => {
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        value: {
          duration: e.srcElement.duration,
          currentTime: e.srcElement.currentTime
        }
      })
      this.props.onTimeUpdate && this.props.onTimeUpdate(e)
    })

    this.audio.addEventListener('ended', (e) => {
      this.props.onEnded && this.props.onEnded(e)
    })

    this.audio.addEventListener('play', (e) => {
      this.props.onPlay && this.props.onPlay(e)
    })

    this.audio.addEventListener('pause', (e) => {
      this.props.onPause && this.props.onPause(e)
    })

    // 1网络错误, 2解码错误, 3解码错误，4 不合适资源
    this.audio.addEventListener('error', (e) => {
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        value: {errMsg: e.srcElement.error.code}
      })
      this.props.onError && this.props.onError(e)
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
      muted,
      className
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
        className={className}
        ref={(audio) => { this.audio = audio }}>
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
