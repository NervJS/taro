---
title: RichText
sidebar_label: RichText
---

##### 富文本

> 组件 支持度

| 微信小程序 | H5 | ReactNative | 属性名 | 类型 | 默认值 | 说明
| :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| ✔️ | √ | √ | nodes | Array / String | [] | 节点列表 / HTML String

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 RichText 组件
import { RichText } from '@tarojs/components'

class App extends Components {
	state = {
            nodes: [{
                name: 'div',
                attrs: {
                    class: 'div_class',
                    style: 'line-height: 60px; color: red;'
                },
            children: [{
                    type: 'text',
                    text: 'Hello World!'
                }]
            }]
        }
	render () {
		return (
			<RichText nodes={this.state.nodes} />
		)
	}
}
```
