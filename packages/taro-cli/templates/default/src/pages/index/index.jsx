<%if (locals.typescript) {-%>
import Taro, { Component, Config } from '@tarojs/taro'
<%} else { -%>
import Taro, { Component } from '@tarojs/taro'
<%}-%>
import { View, Text } from '@tarojs/components'
import './<%= pageName %>.<%= cssExt %>'

export default class <%= _.capitalize(pageName) %> extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

<%if (locals.typescript) {-%>
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
<%}-%>
  config<%if (locals.typescript) {%>: Config<%}%> = {
    navigationBarTitleText: '首页'
  }

  render () {
    return (
      <View className='<%= pageName %>'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
