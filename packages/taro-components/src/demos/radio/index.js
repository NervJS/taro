import Nerv from 'nervjs'
import * as Taro from '../../components/index'

export default class Radio extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    function handleChange (e) {
      console.log('radio', e)
    }

    return (
      <Taro.View className='page'>
        <Taro.View className='page__header'>
          <Taro.View className='page__title'>
            <Taro.View>
              <Taro.Text>Radio</Taro.Text>
            </Taro.View>
          </Taro.View>
        </Taro.View>
        <Taro.View>
          <Taro.Radio key='radio1' name='radio' checked onChange={handleChange} />
          <Taro.Radio key='radio2' name='radio' onChange={handleChange} />
        </Taro.View>
      </Taro.View>
    )
  }
}
