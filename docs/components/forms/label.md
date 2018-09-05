---
title: Label
sidebar_label: Label
---

##### 用来改进表单组件的可用性，使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。for优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。

> 属性及支持度

| 微信小程序 | H5 | ReactNative | 属性值 | 类型 | 说明 |
| :-: | :-: | :-: | :-: |:-: | :-: | :-: |
| √ | √ | x | for | String | 绑定控件的 id |


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
