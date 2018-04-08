import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/camera/index.md'
export default class Camera extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  onError (e) {
    console.log(e)
  }

  onStop (e) {
    console.log(e)
  }

  render () {
    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.Text>Camera</Taro.Text>
            </Taro.View>
            <Taro.View className='page__desc'>
              <Taro.Text>拍照</Taro.Text>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.Camera devicePosition='back' binderror={this.onError} bindstop={this.onStop} />
          </Taro.View>
        </Taro.View>
        <Taro.View className='markdown'>
          <Doc />
        </Taro.View>
      </Taro.View>
    )
  }
}
