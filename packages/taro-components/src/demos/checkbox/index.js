import Nerv from 'nervjs'
import * as Taro from '../../components/index'

export default class Radio extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    function handleChange (e) {
      console.log('checkbox', e)
    }

    return (
      <Taro.View className='page'>
        <Taro.View className='page__header'>
          <Taro.View className='page__title'>
            <Taro.View>
              <Taro.Text>Checkbox</Taro.Text>
            </Taro.View>
          </Taro.View>
        </Taro.View>
        <Taro.View>
          <Taro.Checkbox
            key='checkbox1'
            name='checkbox'
            color='#09bb07'
            checked
            onChange={handleChange}
          />
          <Taro.Checkbox key='checkbox2' onChange={handleChange} />
        </Taro.View>
      </Taro.View>
    )
  }
}
