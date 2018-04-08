import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/audio/index.md'

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
    console.log(e)
  }

  onerror (e) {
    console.log(e)
  }

  onPlay (e) {
    console.log(e)
  }

  render () {
    const opts = {
      src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
      controls: true,
      autoplay: false,
      initialTime: 30,
      id: 'video',
      loop: false,
      muted: true
    }

    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.Text>Audio</Taro.Text>
            </Taro.View>
            <Taro.View className='page__desc'>
              <Taro.Text>音频</Taro.Text>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.Audio
              {...opts}
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
