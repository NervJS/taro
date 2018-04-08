import Nerv from 'nervjs'
import * as Taro from '../components'
import Button from './button'
import Icon from './icon'
import ScrollView from './scroll-view'
import Swiper from './swiper'
import Form from './form'
import View from './view'
import Img from './img'
import Text from './text'
import Video from './video'
import Audio from './audio'
import Camera from './camera'
import Progress from './progress'
import RichText from './rich-text'

// 全局样式引入
import 'weui'
import './demo'
class Hello extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  sayHello () {
    alert('hello')
  }

  render () {
    return (
      <Taro.View>
        <Taro.View className='page__header'>
          <Taro.View onClick={this.sayHello}>
            <Taro.Image
              // mode='aspectfill'
              style='width: 100px;height: 100px;background: #fff;'
              src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
            />
          </Taro.View>
          <Taro.View className='page__title' hoverClass='hover'>
            <Taro.Text>Taro-Nerv-WeUI</Taro.Text>
          </Taro.View>
        </Taro.View>
        <View />
        <Img />
        <Text />
        <Icon />
        <Button />
        <ScrollView />
        <Swiper />
        <Form />
        <Progress />
        <RichText />
        <Camera />
        <Audio />
        <Video />
      </Taro.View>
    )
  }
}

Nerv.render(<Hello />, document.getElementById('app'))
