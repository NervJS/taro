##### Swiper
##### 滑块视图容器。

| 是否支持 | 属性                    | 类型        | 默认值            | 说明                                                         |
| -------- | ----------------------- | ----------- | ----------------- | ------------------------------------------------------------ |
| √        | indicatorDots           | Boolean     | false             | 是否显示面板指示点                                           |
| √        | indicatorColor          | String      | rgba(0, 0, 0, .3) | 指示点颜色                                                   |
| √        | indicatorActiveColor    | String      | 000               | 当前选中的指示点颜色                                         |
| √        | autoplay                | Boolean     | false             | 是否自动切换                                                 |
| √        | interval                | Number      | 5000              | 自动切换时间间隔                                             |
| √        | duration                | Number      | 500               | 滑动动画时长                                                 |
| √        | current                 | Number      | 0                 | 当前所在滑块的 index                                         |
| √        | onChange              | EventHandle |                   | current 改变时会触发 change 事件                             |
| √        | circular                | Boolean     | false             | 是否采用衔接滑动                                             |
| ×        | skipHiddenItemLayout | Boolean     | false             | 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息 |
| ×        | displayMultipleItems  | Number      | 1                 | 同时显示的滑块数量                                           |
| ×        | vertical                | Boolean     | false             | 滑动方向是否为纵向                                           |
| ×        | onAnimationfinish     | EventHandle |                   | 动画结束时会触发 animationfinish 事件                        |

###### 示例：
```
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class PageView extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      autoplay: false,
      indicatorDots: true,
      interval: '5000',
      duration: '500'
    }
  }

   hideIndication (e) {
     this.setState({
       indicatorDots: !this.state.indicatorDots
     })
  }

  isAutoPlay() {
    this.setState({
      autoplay: !this.state.autoplay
    })
  }

  setInterval (e) {
    this.setState({
      interval: e.detail.value
    })
  }

  setDuration (e) {
    this.setState({
      duration: e.detail.value
    })
  }

  render () {
    return (
     <Swiper autoplay={this.state.autoplay}
             indicatorDots={this.state.indicatorDots}
             slideMult='10'
             duration={this.state.duration}
             interval={this.state.interval}
             indicatorColor='#999'
             indicatorActiveColor='#333'
             current='0'
             circular={true}
             preMargin='20'>
       <SwiperItem>
         <View className='content' style='height:100%;background-color:rgb(26,173,25);'>A</View>
       </SwiperItem>
       <SwiperItem>
         <View className='content' style='height:100%;background-color:rgb(39,130,215);'>B</View>
       </SwiperItem>
       <SwiperItem>
         <View className='content' style='height:100%;background-color:rgb(241,241,241);color: #333;'>C</View>
       </SwiperItem>
     </Swiper>
     <View className="switch-list__text">指示点</View>
     <Switch checked onChange={this.hideIndication}/>
     <View className="switch-list__text">自动播放</View>
     <Switch onChange={this.isAutoPlay}/>
     <Text>幻灯片切换时长(ms)</Text>
     <Slider step="1" value="50" showValue min="500" max="2000" onChange={this.setDuration}/>
     <Text>自动播放间隔时长(ms)</Text>
     <Slider step="1" value="100" showValue min="2000" max="10000" onChange={this.setInterval}/>
    )
  }
}

```