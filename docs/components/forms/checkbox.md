---
title: Checkbox
sidebar_label: Checkbox
---

### CheckboxGroup
##### 多项选择器，内部由多个 checkbox 组成

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
| ✔ | x | name | String |   | 表单组件中加上 name 来作为 key |
| ✔ | ✔ | onChange | EventHandle |   | `<CheckboxGroup/>`中选中项发生改变是触发 change 事件，detail = value:[选中的 Checkbox 的 value 的数组] |

>其他相关属性请看各小程序官方文档

[微信小程序 CheckboxGroup](https://developers.weixin.qq.com/miniprogram/dev/component/checkbox-group.html)。

[百度小程序 CheckboxGroup](https://smartprogram.baidu.com/docs/develop/component/formlist/#checkbox)。

[支付宝小程序 CheckboxGroup](https://docs.alipay.com/mini/component/checkbox)。

[字节跳动小程序 CheckboxGroup](https://developer.toutiao.com/docs/comp/checkbox.html)。

### Checkbox
##### 多选项目。

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
|   | ✔ | value      | String      |   | `<Checkbox/>`标识，选中时触发`<CheckboxGroup/>`的 change 事件，并携带 `<Checkbox/>` 的 value |
| ✔ | ✔ | checked    | Boolean     | false  | 当前是否选中   |
| ✔ | ✔ | disabled   | Boolean     | false  | 是否禁用   |
| ✔ | ✔ | color      | Color       |   | checkbox 的颜色，同 css 的 color       |
| ✔ | ✔ | onChange | EventHandle |  | 选中项发生变化时触发 change 事件，小程序无此 API   |

>其他相关属性请看各小程序官方文档

[微信小程序 Checkbox](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)。

[百度小程序 Checkbox](https://smartprogram.baidu.com/docs/develop/component/formlist/#checkbox)。

[支付宝小程序 Checkbox](https://docs.alipay.com/mini/component/checkbox)。

[字节跳动小程序 Checkbox](https://developer.toutiao.com/docs/comp/checkbox.html)。

###### 示例：

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Checkbox } from '@tarojs/components'

export default class PageCheckbox extends Component {
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
      <View className='page-body'>
        <View className='page-section'>
          <Text>默认样式</Text>
          <Checkbox value='选中' checked>选中</Checkbox>
          <Checkbox style='margin-left: 20rpx' value='未选中'>未选中</Checkbox>
        </View>
        <View className='page-section'>
          <Text>推荐展示样式</Text>
          {this.state.list.map((item, i) => {
            return (
              <Label className='checkbox-list__label' for={i} key={i}>
                <Checkbox className='checkbox-list__checkbox' value={item.value} checked={item.checked}>{item.text}</Checkbox>
              </Label>
            )
          })}
        </View>
      </View>
    )
  }
}
```
