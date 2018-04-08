import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/button/index.md'
export default class Button extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  render () {
    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.Text>Button</Taro.Text>
            </Taro.View>
            <Taro.View className='page__desc'>
              <Taro.Text>按钮</Taro.Text>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.Button>Default</Taro.Button>
            <Taro.Button type='primary'>Primary</Taro.Button>
            <Taro.Button type='primary' disabled>
              Primary Disabled
            </Taro.Button>
            <Taro.Button type='primary' loading>
              Primary
            </Taro.Button>
            <Taro.Button type='warn'>Warn</Taro.Button>
            <Taro.Button type='warn' loading>
              Warn
            </Taro.Button>
            <Taro.Button type='default' plain>
              default
            </Taro.Button>
            <Taro.Button type='primary' plain>
              primary
            </Taro.Button>
            <Taro.Button size='mini'>Default</Taro.Button>
            <Taro.Button size='mini' type='primary'>
              Primary
            </Taro.Button>
            <Taro.Button size='mini' type='warn'>
              Warn
            </Taro.Button>
          </Taro.View>
        </Taro.View>
        <Taro.View className='markdown'>
          <Doc />
        </Taro.View>
      </Taro.View>
    )
  }
}
