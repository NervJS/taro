---
title: Form
sidebar_label: Form
---

##### 表单，将组件内的用户输入的值提交。当点击 表单中 formType 为 submit 的 button 组件时，会将表单组件中的 value 值进行提交，需要在表单组件中加上 name 来作为 key

> 属性及支持度

| H5 | ReactNative | 属性值 | 类型 | 说明 |
| :-: | :-: | :-: |:-: | :-: |
|  | x | reportSubmit | Boolean | 是否返回 formId 用于发送模板消息 |
| ✔ | ✔ | onSubmit | EventHandle | 携带 form 中的数据触发 submit 事件，event.detail = {value : {'name': 'value'}} |
| ✔ | x | onReset | EventHandle | 表单重置时会触发 reset 事件 |

>其他相关属性请看各小程序官方文档

[微信小程序 Form](https://developers.weixin.qq.com/miniprogram/dev/component/form.html)。

[百度小程序 Form](https://smartprogram.baidu.com/docs/develop/component/formlist/#form)。

[支付宝小程序 Form](https://docs.alipay.com/mini/component/form)。

[字节跳动小程序 Form](https://developer.toutiao.com/docs/comp/form.html)。


###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
// 引入 Form 组件
import { View, Form, Switch } from '@tarojs/components'

class App extends Component {

  formSubmit = e => {
    console.log(e)
  }

  formReset = e => {
    console.log(e)
  }

  render () {
    return (
      <Form onSubmit={this.formSubmit} onReset={this.formReset} >
        <View className='example-body'>
          <Switch name='switch' className='form-switch'></Switch>
        </View>
      </Form>
    )
  }
}
```
