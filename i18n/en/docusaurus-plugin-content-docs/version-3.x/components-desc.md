---
title: Description
---

Taro has customised its own component library specification using [WeChat Mini-Program Components](https://developers.weixin.qq.com/miniprogram/en/dev/component/) as a standard, combined with the `JSX` syntax specification.

Based on the above principles, on the WeChat Mini-Program side we can use all the applet native components, while on the other side we have implemented the corresponding component libraries:

- H5: `@tarojs/components`
- RN: `@tarojs/components-rn`

When using React we need to reference components from the Taro standard component library @tarojs/components before we can use them, for example with `<View />`, `<Text />` components， whereas with Vue there is no need to bring them in.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```jsx
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'

export default class C extends Component {
  render () {
    return (
      <View className='c'>
        <Text>c component</Text>
      </View>
    )
  }
}
```

</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="c">
    <text>c component</text>
  </view>
</template>
```
  
</TabItem>


</Tabs>

## TIPS

The detailed documentation of the components lists the extent to which the components are supported on different sides, as well as basic usage examples. For some components that are not listed as examples and are marked as only supported on the applet side, you can refer directly to the [Mini-Program Components Doc](https://developers.weixin.qq.com/miniprogram/en/dev/component/).

**Taro's development specifications still need to be followed:**

### Initial capitalisation and humpback naming

For example, using the `Map` component, which is not yet supported on the H5 side

```jsx
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { Map } from '@tarojs/components'

class App extends Components {
  onTap () {}
  render () {
    return (
      <Map onClick={this.onTap} />
    )
  }
}
```

### The event names of components should all start with `on`

All uses of `bind` in WeChat Mini-Program need to be converted to a form starting with `on`.
