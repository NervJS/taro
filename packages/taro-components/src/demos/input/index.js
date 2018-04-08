import Nerv from 'nervjs'
import * as Taro from '../../components/index'

export default class Input extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  handleChange (e) {
    console.log('change', e)
  }
  handleFocus (e) {
    console.log('focus', e)
  }
  handleBlur (e) {
    console.log('blur', e)
  }
  render () {
    return (
      <Taro.View className='page'>
        <Taro.View className='page__header'>
          <Taro.View className='page__title'>
            <Taro.View>
              <Taro.Text>Input</Taro.Text>
            </Taro.View>
          </Taro.View>
        </Taro.View>
        <Taro.View className='weui-cells weui-cells_form'>
          <Taro.View className='weui-cell'>
            <Taro.View className='weui-cell__hd'>
              <Taro.Text className='weui-label'>text</Taro.Text>
            </Taro.View>
            <Taro.View className='weui-cell__bd'>
              <Taro.Input
                placeholder='text'
                type='text'
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
            </Taro.View>
          </Taro.View>
          <Taro.View className='weui-cell'>
            <Taro.View className='weui-cell__hd'>
              <Taro.Text className='weui-label'>password</Taro.Text>
            </Taro.View>
            <Taro.View className='weui-cell__bd'>
              <Taro.Input
                placeholder='password'
                type='text'
                password
                onChange={this.handleChange}
              />
            </Taro.View>
          </Taro.View>
          <Taro.View className='weui-cell'>
            <Taro.View className='weui-cell__hd'>
              <Taro.Text className='weui-label'>disabled</Taro.Text>
            </Taro.View>
            <Taro.View className='weui-cell__bd'>
              <Taro.Input
                placeholder='disabled'
                type='text'
                disabled
                onChange={this.handleChange}
              />
            </Taro.View>
          </Taro.View>
        </Taro.View>
      </Taro.View>
    )
  }
}
