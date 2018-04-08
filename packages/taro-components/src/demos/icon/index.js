import Nerv from 'nervjs'
import * as Taro from '../../components/index'
import Doc from '../../components/icon/index.md'
export default class Icon extends Nerv.Component {
  constructor () {
    super(...arguments)
  }
  render () {
    const iconSize = [20, 30, 40, 50, 60, 70]
    const iconTypes = [
      'success',
      'success_no_circle',
      'info',
      'warn',
      'waiting',
      'cancel',
      'download',
      'search',
      'clear'
    ]
    const iconColors = [
      'red',
      'orange',
      'yellow',
      'green',
      'rgb(0,255,255)',
      'blue',
      'purple'
    ]
    return (
      <Taro.View>
        <Taro.View className='page'>
          <Taro.View className='page__header'>
            <Taro.View className='page__title'>
              <Taro.Text>icon</Taro.Text>
            </Taro.View>
            <Taro.View className='page__desc'>
              <Taro.Text>图标</Taro.Text>
            </Taro.View>
          </Taro.View>
          <Taro.View className='page__con'>
            <Taro.View className='page__con__list'>
              {iconTypes.map(type => <Taro.Icon type={type} />)}
            </Taro.View>
            <Taro.ScrollView
              className='page__con__list'
              scroll-x
              scroll-with-animation
              scroll-left='20'
            >
              {iconSize.map(size => <Taro.Icon size={size} type='success' />)}
            </Taro.ScrollView>
            <Taro.View className='page__con__list'>
              {iconColors.map(color => (
                <Taro.Icon color={color} type='success' />
              ))}
            </Taro.View>
          </Taro.View>
        </Taro.View>
        <Taro.View className='markdown'>
          <Doc />
        </Taro.View>
      </Taro.View>
    )
  }
}
