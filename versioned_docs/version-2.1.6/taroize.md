---
title: 微信小程序转 Taro
---

> 自 `v1.2.0` 开始支持此功能

Taro 可以将你的原生微信小程序应用转换为 Taro 代码，进而你可以通过 `taro build` 的命令将 Taro 代码转换为对应平台的代码，或者对转换后的 Taro 代码用 React 的方式进行二次开发。

微信原生小程序转 Taro 的操作非常简单，首先必须安装使用 `npm i -g @tarojs/cli` 安装 Taro 命令行工具，其次在命令行中定位到小程序项目的根目录，根目录中运行：

```bash
$ taro convert
```

即可完成转换。转换后的代码保存在根目录下的 `taroConvert` 文件夹下。你需要定位到 `taroConvert` 目录执行 `npm install` 命令之后就可以使用 `taro build` 命令编译到对应平台的代码。

## 二次开发

假设已有一个转换后文件如下：

```javascript
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './index.scss'

var app = Taro.getApp()

@withWeapp('Page')
class _C extends Taro.Component {
  state = {}

  componentWillMount(e) {
    var orderId = e.id
    this.data.orderId = orderId
  }

  componentDidShow() {
    var that = this
    Taro.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/detail',
      data: {
        token: Taro.getStorageSync('token'),
        id: that.data.orderId
      },
      success: res => {
        Taro.hideLoading()
        if (res.data.code != 0) {
          Taro.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return
        }
        that.setData({
          orderDetail: res.data.data,
          logisticsTraces: res.data.data.logisticsTraces.reverse()
        })
      }
    })
  }

  config = {
    navigationBarTitleText: '物流详情'
  }

  render() {
    const {
      orderDetail: orderDetail,
      logisticsTraces: logisticsTraces
    } = this.state
    return (
      <View className="container">
        <View className="top-sec">
          <View className="a-row">
            <View className="label">物流单号</View>
            <View className="text">{orderDetail.logistics.trackingNumber}</View>
          </View>
          <View className="a-row">
            <View className="label">物流公司</View>
            <View className="text">{orderDetail.logistics.shipperName}</View>
          </View>
        </View>
        <View className="sec-wrap">
          <View className="details-info">
            <View className="line-box" />
            {logisticsTraces.map((item, index) => {
              return (
                <View className="a-row" key={index}>
                  <View className="dot">
                    <View
                      className="active-dot"
                      hidden={index == 0 ? false : true}
                    >
                      <View className="yuan-red" />
                    </View>
                    <View
                      className="default-dot"
                      hidden={index == 0 ? true : false}
                    />
                  </View>
                  <View className="info">
                    <View className="date-box">{item.AcceptTime}</View>
                    <View className="text">{item.AcceptStation}</View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}

export default _C
```

它看起来就像普通的 Taro 组件，最重要的区别就在于 `@withWeapp()` 这个装饰器，你可以将它理解为转换代码的运行时，`@withWeapp()` 会增加一些原来 Taro 没有方法和属性，例如：

### `this.setData`

转换后的 `this.setData` 的 API 相当于小程序的 `this.setData` 的 polyfill，他和 `this.setState` 最大的区别就在于，`this.setData` 之后 `data` 的数据是同步更新，而渲染是异步更新，而 `setState` 两者都是异步的。

### `this.data` 和 `this.properties`

`this.data` 和 `this.properties` 相当于 Taro 的 `this.state` 和 `this.props` 的 alias，当它们的数据更新时，对应的 `state` 和 `props` 也会同步更新。

### 生命周期

Taro 会将原始文件的生命周期钩子函数转换为 Taro 的生命周期，完整对应关系如下：

| Page.onLoad | componentWillMount |
| --: | --: |
| onShow | componentDidShow |
| onHide | componentDidHide |
| onReady | componentDidMount |
| onUnload | componentWillUnmount |
| onError | componentDidCatchError |
| App.onLaunch | componentWillMount |
| Component.created | componentWillMount |
| attached | componentDidMount |
| ready | componentDidMount  |
| detached | componentWillUnmount |
| moved |  保留 |

## 常见问题

### 在小程序 IDE 显示 `_createData` 错误

这个错误通常是由于原始代码的初始 `data` 中没有对应的数据，后来通过 `this.setData` 补充数据造成的。在 Taro 中推荐不管是 `state(data)` 还是 `properties(props)` 都要设置一个默认值。你可以在类构造器或修改原始代码提供一个默认值解决这个问题，这也应该是编写代码的最佳实践。

### 转换 `wxParse` 报错不存在文件

这是由于 `wxParse` 的源码使用了一个[不存在的 `template`](https://github.com/icindy/wxParse/issues/255) 声明造成的。你可以修改 `wxParse` 的源码文件 `wxParse.wxml` 134 行到 207 行：

```html
<!--循环模版-->
<template name="wxParse1">
  <!--<template is="wxParse1" data="{{item}}" />-->
  <!--判断是否是标签节点-->
  <block wx:if="{{item.node == 'element'}}">
    <block wx:if="{{item.tag == 'button'}}">
      <button type="default" size="mini">
        <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
          <template is="wxParse0" data="{{item}}" />
        </block>
      </button>
    </block>
    <!--li类型-->
    <block wx:elif="{{item.tag == 'li'}}">
      <view class="{{item.classStr}} wxParse-li" style="{{item.styleStr}}">
        <view class="{{item.classStr}} wxParse-li-inner">
          <view class="{{item.classStr}} wxParse-li-text">
            <view class="{{item.classStr}} wxParse-li-circle"></view>
          </view>
          <view class="{{item.classStr}} wxParse-li-text">
            <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
              <template is="wxParse0" data="{{item}}" />
            </block>
          </view>
        </view>
      </view>
    </block>

    <!--video类型-->
    <block wx:elif="{{item.tag == 'video'}}">
      <template is="wxParseVideo" data="{{item}}" />
    </block>

    <!--img类型-->
    <block wx:elif="{{item.tag == 'img'}}">
      <template is="wxParseImg" data="{{item}}" />
    </block>

    <!--a类型-->
    <block wx:elif="{{item.tag == 'a'}}">
      <view bindtap="wxParseTagATap" class="wxParse-inline {{item.classStr}} wxParse-{{item.tag}}" data-src="{{item.attr.href}}" style="{{item.styleStr}}">
        <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
          <template is="wxParse0" data="{{item}}" />
        </block>
      </view>
    </block>
    <block wx:elif="{{item.tag == 'table'}}">
      <view class="{{item.classStr}} wxParse-{{item.tag}}" style="{{item.styleStr}}">
        <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
          <template is="wxParse0" data="{{item}}" />
        </block>
      </view>
    </block>

    <block wx:elif="{{item.tag == 'br'}}">
      <template is="WxParseBr"></template>
    </block>
    <!--其他块级标签-->
    <block wx:elif="{{item.tagType == 'block'}}">
      <view class="{{item.classStr}} wxParse-{{item.tag}}" style="{{item.styleStr}}">
        <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
          <template is="wxParse0" data="{{item}}" />
        </block>
      </view>
    </block>

    <!--内联标签-->
    <view wx:else class="{{item.classStr}} wxParse-{{item.tag}} wxParse-{{item.tagType}}" style="{{item.styleStr}}">
      <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
        <template is="wxParse0" data="{{item}}" />
      </block>
    </view>

  </block>

  <!--判断是否是文本节点-->
  <block wx:elif="{{item.node == 'text'}}">
    <!--如果是，直接进行-->
    <template is="WxEmojiView" data="{{item}}" />
  </block>

</template>
```

把 `<template name="wxParse1">` 的模板内所有 `<template is="wxParse2" data="{{item}}" />` 修改为 `<template is="wxParse0" data="{{item}}" />` 再运行 `taro convert` 即可。这样修改之后还会取消原来 `wxParse` 只能处理 11 级 HTML 嵌套的问题，理论上内存不爆栈可以处理无限级 HTML 嵌套。

### 不支持 `relations` 和 `Behavior`

目前转换暂只支持转换 `Page`、`Component` 、`App` 三种构造器创造的小程序组件实例。 `relations` 和 `Behavior` 在其他许多小程序端中还没有对应的实现，我们认为实现这两个功能意义不大。

### 转换 wepy 文件不成功

目前只能支持转换使用原生微信小程序开发的应用。
