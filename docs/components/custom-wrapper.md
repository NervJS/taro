---
title: CustomWrapper
sidebar_label: CustomWrapper
---

custom-wrapper 自定义组件包裹器
当数据更新层级较深时，可用此组件将需要更新的区域包裹起来，这样更新层级将大大减少

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="百度小程序" src={require('@site/static/img/platform/swan.png').default} className="icon_platform" width="25px"/> <img title="支付宝小程序" src={require('@site/static/img/platform/alipay.png').default} className="icon_platform" width="25px"/> <img title="字节跳动小程序" src={require('@site/static/img/platform/tt.png').default} className="icon_platform" width="25px"/> <img title="QQ 小程序" src={require('@site/static/img/platform/qq.png').default} className="icon_platform" width="25px"/> <img title="京东小程序" src={require('@site/static/img/platform/jd.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

## 类型

```tsx
ComponentType<CustomWrapperProps>
```

## 示例代码

```tsx
import { Component } from 'react'
import { CustomWrapper, View, Text } from '@tarojs/components'

export default class C extends Component {
  render () {
    return (
      <View>
        <CustomWrapper>
           <Text>Hello, world!</Text>
        </CustomWrapper>
      </View>
    )
  }
}
```

## CustomWrapperProps
