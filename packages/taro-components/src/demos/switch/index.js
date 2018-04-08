import Nerv from 'nervjs'
import * as Taro from '../../components/index'

export default class Switch extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    function handleChange (e) {
      console.log('switch', e)
    }
    return (
      <Taro.View className='page'>
        <Taro.View className='page__header'>
          <Taro.View className='page__title'>
            <Taro.Text>Switch</Taro.Text>
          </Taro.View>
        </Taro.View>
        <Taro.View>
          <Taro.Switch onChange={handleChange} />
          <Taro.Switch checked onChange={handleChange} />
        </Taro.View>
      </Taro.View>
    )
  }
}
