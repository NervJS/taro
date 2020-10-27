---
title: Textarea
sidebar_label: Textarea
---

##### 多行输入框

> 属性及支持度

| H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :- | :- | :- | :- |
| √ | √ | value             | String      |  | 输入框的内容         |
| √ | √ | placeholder       | String      |  | 输入框为空时占位符|
|   | x | placeholderStyle | String      |  | 指定 placeholder 的样式  |
|   | x | placeholderClass | String      | textarea-placeholder | 指定 placeholder 的样式类|
| √ | √ | disabled          | Boolean     | false  | 是否禁用          |
| √ | √ | maxlength         | Number      | 140  | 最大输入长度，设置为 -1 的时候不限制最大长度   |
| √ | x | autoFocus        | Boolean     | false  | 自动聚焦，拉起键盘。                           |
|   | √ | focus             | Boolean     | false | 获取焦点   |
|   | √ | autoHeight             | Boolean     | false | 是否自动增高，设置 auto-height 时，style.height 不生效    |
|   | x | fixed             | Boolean     | false | 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true     |
|   | x | cursorSpacing    | Number      | 0 | 指定光标与键盘的距离，单位 px 。取 textarea 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离 |
|   | x | showConfirmBar  | Boolean     | true | 是否显示键盘上方带有”完成“按钮那一栏   |
|   | √ | selectionStart   | Number      | -1 | 光标起始位置，自动聚集时有效，需与 selection-end 搭配使用   |
|   | √ | selectionEnd     | Number      | -1 | 光标结束位置，自动聚集时有效，需与 selectionStart 搭配使用|
| √ | √ | onFocus         | EventHandle |  | event.detail = { value, height }，height 为键盘高度，在基础库 1.9.90 起支持  |
| √ | √ | onBlur          | EventHandle |  | 输入框失去焦点时触发， event.detail = {value, cursor}|
|   | √ | onLinechange    | EventHandle |  | 输入框行数变化时调用，  event.detail = {height: 0, heightRpx: 0, lineCount: 0} |
| √ | √ | onInput         | EventHandle |  | 当键盘输入时，触发 input 事件， bindinput 处理函数的返回值并不会反映到 textarea 上 |
|   | √ | onConfirm       | EventHandle |  | 点击完成时， 触发 confirm 事件， event.detail = {value: value}|


>其他相关属性请看各小程序官方文档

[微信小程序 Textarea](https://developers.weixin.qq.com/miniprogram/dev/component/textarea.html)。

[百度小程序 Textarea](https://smartprogram.baidu.com/docs/develop/component/formlist/#textarea)。

[支付宝小程序 Textarea](https://docs.alipay.com/mini/component/textarea)。

[字节跳动小程序 Textarea](https://developer.toutiao.com/docs/comp/textarea.html)。

###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Switch } from '@tarojs/components'

export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Text>输入区域高度自适应，不会出现滚动条</Text>
        <Textarea style='background:#fff;width:100%;min-height:80px;padding:0 30rpx;' autoHeight/>
        <Text>这是一个可以自动聚焦的 textarea</Text>
        <Textarea style='background:#fff;width:100%;height:80px;padding:0 30rpx;' autoFocus/>
      </View>
    )
  }
}
```
