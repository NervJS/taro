---
title: Label
sidebar_label: Label
---

##### 用来改进表单组件的可用性，使用 for 属性找到对应的 id，或者将控件放在该标签下，当点击时，就会触发对应的控件。for 优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。

> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| for | String | 绑定控件的 id |

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| for | ✔ | ✔ | x | ✔ | ✔ | ✔ |

```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 Label 组件
import { RadioGroup, Radio, Label } from '@tarojs/components'

class App extends Components {

  render () {
    return (
      <RadioGroup>
        <Label className='example-body__label' for='1' key='1'>
          <Radio value='USA'>USA</Radio>
        </Label>
        <Label className='example-body__label' for='2' key='2'>
          <Radio value='CHN' checked>
          CHN
          </Radio>
        </Label>
      </RadioGroup>
    )
  }
}
```
