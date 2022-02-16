import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Button, Navigator } from '@tarojs/components'

export default class Index extends Component {
  usePluginInterface () {
    const myPluginInterface = Taro.requirePlugin('myPlugin')
    myPluginInterface.sayHello()
    const answer = myPluginInterface.answer
    console.log('answer: ', answer)
  }

  render () {
    return (
      <View className='index'>
        {/** 测试插件组件 */}
        <avatar
          props={{
            mode: 'aspectFit',
            onAvatarClick: () => console.log('组件事件传递成功')
          }}
        />

        {/** 测试插件页面 */}
        <Navigator url='plugin://myPlugin/list'>
          <Button>跳转到插件页面</Button>
        </Navigator>

        {/** 使用插件接口 */}
        <Button onClick={this.usePluginInterface}>测试插件接口</Button>

        {/** hack：为了让 genericsImplementation 生效，因为目前没有收集插件中使用到的第三方组件 */}
        <mp-comp></mp-comp>
      </View>
    )
  }
}
