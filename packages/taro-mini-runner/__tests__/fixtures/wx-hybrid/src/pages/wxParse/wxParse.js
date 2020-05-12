import React from 'react'
import { View } from '@tarojs/components'

// import ParseComponent from './wxParseComponent'

/**
 * 需要注意的是，在项目的 config/index.js 文件中，有 copy 模板与样式的操作
 */
export default class WxParsePage extends React.Component {
  config = {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'WxParse 使用示例',
    backgroundColor: '#eeeeee',
    backgroundTextStyle: 'light'
  }

  render () {
    return (
      <View>
        <wxparse html={`<div style="color: red">我是HTML代码</div>`} />
      </View>
    )
  }
}
