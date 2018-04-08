import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/progress/index.md'

export default class Progress extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.View>
                <Taro.Text>Progress</Taro.Text>
              </Taro.View>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.Progress percent={20} showInfo strokeWidth={4} active />
          </Taro.View>
        </Taro.View>
        <Taro.View className='markdown'>
          <Doc />
        </Taro.View>
      </Taro.View>
    )
  }
}
