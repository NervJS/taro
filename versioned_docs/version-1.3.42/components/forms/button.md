---
title: Button
sidebar_label: Button
---

##### 按钮

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
|  ✔ |  ✔ | type   | String  | default   | 按钮的样式类型  |
|  ✔ |  ✔ | size   | String  | default   | 按钮的大小 px |
|  ✔ |  ✔ | plain  | Boolean | false | 按钮是否镂空，背景色透明   |
|  ✔ |  ✔ | disabled  | Boolean | false | 是否禁用   |
|  ✔ |  ✔ | loading   | Boolean | false | 名称前是否带 loading 图标  |
|  ✔ | X (支持 hoverStyle 属性，但框架未支持 hoverClass) | hoverClass | String  | button-hover | 指定按钮按下去的样式类。当 hover-class='none' 时，没有点击态效果  |
|  ✔ |  ✔ | hoverStartTime    | Number  | 20    | 按住后多久出现点击态，单位毫秒   |
|  ✔ |  ✔ | hoverStayTime | Number  | 70    | 手指松开后点击态保留时间，单位毫秒   |
| X |  X | onGetUserInfo | Handler  |     | 微信小程序open-type='getUserInfo'时，用户点击该按钮，会返回获取到的用户信息，从返回参数的 detail 中获取到的值同 wx.getUserInfo   |

>其他相关属性请看各小程序官方文档

[微信小程序 Button](https://developers.weixin.qq.com/miniprogram/dev/component/button.html)。

[百度小程序 Button](https://smartprogram.baidu.com/docs/develop/component/formlist/#button)。

[支付宝小程序 Button](https://docs.alipay.com/mini/component/button)。

[字节跳动小程序 Button](https://developer.toutiao.com/docs/comp/button.html)。



###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

export default class PageButton extends Component {
  state = {
    btn: [
      {
        text: '页面主操作 Normal',
        size: 'default',
        type: 'primary'
      },
      {
        text: '页面主操作 Loading',
        size: 'default',
        type: 'primary',
        loading: true,
      },
      {
        text: '页面主操作 Disabled',
        size: 'default',
        type: 'primary',
        disabled: true,
      },
      {
        text: '页面次要操作 Normal',
        size: 'default',
        type: 'default'
      },
      {
        text: '页面次要操作 Disabled',
        size: 'default',
        type: 'default',
        disabled: true,
      },
      {
        text: '警告类操作 Normal',
        size: 'default',
        type: 'warn'
      },
      {
        text: '警告类操作 Disabled',
        size: 'default',
        type: 'warn',
        disabled: true,
      }
    ]
  }
  render () {
    return (
      <View className='container'>
        {this.state.btn.map(item => {
          return (
            <Button
              size={item.size ? item.size : ''}
              type={item.type ? item.type : ''}
              loading={item.loading ? item.loading : false}
              disabled={item.disabled ? item.disabled : false}
            >
              {item.text}
            </Button>
          )
        })}
        <Button className='btn-max-w' plain type='primary'>按钮</Button>
        <Button className='btn-max-w' plain type='primary' disabled>不可点击的按钮</Button>
        <Button className='btn-max-w' plain >按钮</Button>
        <Button className='btn-max-w' plain disabled >按钮</Button>
        <Button size='mini' type='primary'>按钮</Button>
        <Button size='mini' >按钮</Button>
        <Button size='mini' type='warn'>按钮</Button>
      </View>
    )
  }
}
```
