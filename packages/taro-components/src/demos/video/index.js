import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/video/index.md'

export default class Audio extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  onPause (e) {
    console.log(e)
  }

  onended (e) {
    console.log(e)
  }

  ontimeupdate (e) {
    // console.log(e)
  }

  onerror (e) {
    console.log(e)
  }

  onPlay (e) {
    console.log(e)
  }

  render () {
    const videoOpts = {
      src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      controls: true,
      autoplay: false,
      poster: 'http://misc.aotu.io/booxood/mobile-video/cover_900x500.jpg',
      initialTime: 30,
      id: 'video',
      loop: false,
      muted: false
    }

    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.Text>Video</Taro.Text>
            </Taro.View>
            <Taro.View className='page__desc'>
              <Taro.Text>视频</Taro.Text>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.Video
              {...videoOpts}
              bindpause={this.onPause}
              bindended={this.onended}
              bindtimeupdate={this.ontimeupdate}
              binderror={this.onerror}
              bindplay={this.onPlay}
            />
          </Taro.View>
        </Taro.View>
        <Taro.View className='markdown'>
          <Doc />
        </Taro.View>
      </Taro.View>
    )
  }
}
