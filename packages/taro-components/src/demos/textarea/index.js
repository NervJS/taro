import Nerv from 'nervjs'
import * as Taro from '../../components/index'

export default class Textarea extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  render () {
    return (
      <Taro.View className='page'>
        <Taro.View className='page__header'>
          <Taro.View className='page__title'>
            <Taro.View>
              <Taro.Text>textarea</Taro.Text>
            </Taro.View>
          </Taro.View>
        </Taro.View>
        <Taro.View className='weui-cells weui-cells_form'>
          <Taro.View className='weui-cell'>
            <Taro.Textarea placeholder='请输入文本' rows='4' />
          </Taro.View>
        </Taro.View>
      </Taro.View>
    )
  }
}
