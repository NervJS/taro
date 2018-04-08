import Nerv from 'nervjs'
import './style/index.scss'

class Video extends Nerv.Component {
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
    this.video.addEventListener('timeupdate', (e) => {
      this.props.bindtimeupdate(e)
    })

    this.video.addEventListener('ended', (e) => {
      this.props.bindended(e)
    })

    this.video.addEventListener('play', (e) => {
      this.props.bindplay(e)
    })

    this.video.addEventListener('pause', (e) => {
      this.props.bindpause(e)
    })

    // 网络错误
    this.video.addEventListener('stalled', (data) => {
      let e = {}
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        errMsg: 2
      })
      this.props.bindended(e)
    })

    // 获取资源被用户禁止
    this.video.addEventListener('abort', (data) => {
      let e = {}
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        errMsg: 1
      })
      this.props.bindended(e)
    })

    // 解码错误
    this.video.addEventListener('error', (data) => {
      let e = {}
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        errMsg: 3
      })
      this.props.bindended(e)
    })

    // 不合适资源
    this.video.addEventListener('error', (data) => {
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
      poster,
      initialTime,
      id,
      loop,
      muted
    } = this.props
    if (!controls) {
      poster = ''
    }
    return (
      <video
        id={id}
        src={src}
        controls={controls}
        autoplay={autoplay}
        poster={poster}
        start={initialTime}
        loop={loop}
        muted={muted}
        ref={(video) => { this.video = video }}>
        暂时不支持播放该视频
      </video>
    )
  }
}

// 默认配置
Video.defaultProps = {
  autoplay: false,
  controls: true,
  loop: false,
  muted: false
}

export default Video
