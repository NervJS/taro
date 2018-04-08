import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/text/index.md'
export default function () {
  return (
    <Taro.View>
      <Taro.View className='page'>
        <Taro.View className='page__header'>
          <Taro.View className='page__title'>
            <Taro.Text>text</Taro.Text>
          </Taro.View>
          <Taro.View className='page__desc'>
            <Taro.Text>文本</Taro.Text>
          </Taro.View>
        </Taro.View>
      </Taro.View>
      <Taro.View className='markdown'>
        <Doc />
      </Taro.View>
    </Taro.View>
  )
}
