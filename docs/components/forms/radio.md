---
title: Radio
sidebar_label: Radio
---

### RadioGroup
##### 单项选择器，内部由多个 Radio 组成
> 属性及支持度

| 微信小程序 | H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| √ | √ | x | name | String |  | 表单组件中加上 name 来作为 key |
| √ | √ | x | onChange | EventHandle |  | `<RadioGroup/>` 中选中项发生改变时触发 change 事件，detail = value:[选中的 radio 的 value 的数组] |


>其他相关属性请看各小程序官方文档

[微信小程序 RadioGroup](https://developers.weixin.qq.com/miniprogram/dev/component/radio.html)。

[百度小程序 RadioGroup](https://smartprogram.baidu.com/docs/develop/component/formlist/#radio)。

[支付宝小程序 RadioGroup](https://docs.alipay.com/mini/component/radio)。

[字节跳动小程序 RadioGroup](https://developer.toutiao.com/docs/comp/radio.html)。


### Radio
##### 单选项目
> 属性及支持度

| 微信小程序 | H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| √ |   | √ | value      | String      | false  | `<Radio/>` 标识。当该 `<Radio/>` 选中时，`<RadioGroup/>` 的 change 事件会携带 `<Radio/>` 的 value |
| √ | √ | √ | checked    | Boolean     | false  | 当前是否选中    |
| √ | √ | √ | disabled   | Boolean     | false  | 是否禁用        |
| √ |   | √ | color      | Color       | false  | radio 的颜色，同 css 的 color   |
| √ | √ | √ | onChange   | EventHandle |        | 选中项发生变化时触发 change 事件   |

>其他相关属性请看各小程序官方文档

[微信小程序 Radio](https://developers.weixin.qq.com/miniprogram/dev/component/radio.html)。

[百度小程序 Radio](https://smartprogram.baidu.com/docs/develop/component/formlist/#radio)。

[支付宝小程序 Radio](https://docs.alipay.com/mini/component/radio)。

[字节跳动小程序 Radio](https://developer.toutiao.com/docs/comp/radio.html)。


###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Radio, RadioGroup } from '@tarojs/components'
import './radio.scss'

export default class PageRadio extends Component {
  state = {
    list: [
      {
        value: '美国',
        text: '美国',
        checked: false
      },
      {
        value: '中国',
        text: '中国',
        checked: true
      },
      {
        value: '巴西',
        text: '巴西',
        checked: false
      },
      {
        value: '日本',
        text: '日本',
        checked: false
      },
      {
        value: '英国',
        text: '英国',
        checked: false
      },
      {
        value: '法国',
        text: '法国',
        checked: false
      }
    ]
  }
  render () {
    return (
      <View className='container'>
        <Head title='Radio' />
        <View className='page-body'>
          <View className='page-section'>
            <Text>默认样式</Text>
            <Radio value='选中' checked>选中</Radio>
            <Radio style='margin-left: 20rpx' value='未选中'>未选中</Radio>
          </View>
          <View className='page-section'>
            <Text>推荐展示样式</Text>
            <View className='radio-list'>
              <RadioGroup>
                {this.state.list.map((item, i) => {
                  return (
                    <Label className='radio-list__label' for={i} key={i}>
                      <Radio className='radio-list__radio' value={item.value} checked={item.checked}>{item.text}</Radio>
                    </Label>
                  )
                })}
              </RadioGroup>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
```
