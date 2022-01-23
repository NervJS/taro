---
title: CustomWrapper
sidebar_label: CustomWrapper
---

custom-wrapper 自定义组件包裹器
当数据更新层级较深时，可用此组件将需要更新的区域包裹起来，这样更新层级将大大减少

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

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | 京东小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| CustomWrapper | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |  |
