---
title: Checkbox
sidebar_label: Checkbox
---

多选项目

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/checkbox.html)

## 类型

```tsx
ComponentType<CheckboxProps>
```

## 示例代码

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
  {
    "label": "React",
    "value": "React"
  },
  {
    "label": "Vue",
    "value": "Vue"
  }
]}>
<TabItem value="React">

```tsx
export default class PageCheckbox extends Component {
  state = {
    list: [
      {
        value: '美国',
        text: '美国',
        checked: false
      },
      {
        value: '中国',
        text: '中国',
        checked: true
      },
      {
        value: '巴西',
        text: '巴西',
        checked: false
      },
      {
        value: '日本',
        text: '日本',
        checked: false
      },
      {
        value: '英国',
        text: '英国',
        checked: false
      },
      {
        value: '法国',
        text: '法国',
        checked: false
      }
    ]
  }
  render () {
    return (
      <View className='page-body'>
        <View className='page-section'>
          <Text>默认样式</Text>
          <Checkbox value='选中' checked>选中</Checkbox>
          <Checkbox style='margin-left: 20rpx' value='未选中'>未选中</Checkbox>
        </View>
        <View className='page-section'>
          <Text>推荐展示样式</Text>
          {this.state.list.map((item, i) => {
            return (
              <Label className='checkbox-list__label' for={i} key={i}>
                <Checkbox className='checkbox-list__checkbox' value={item.value} checked={item.checked}>{item.text}</Checkbox>
              </Label>
            )
          })}
        </View>
      </View>
    )
  }
}
```
</TabItem>
<TabItem value="Vue">

```html
<template>
  <view class="container">
    <view class="page-section">
      <text>默认样式</text>
      <checkbox value="选中" :checked="true">选中</checkbox>
      <checkbox style="margin-left: 20rpx;" value="未选中">未选中</checkbox>
    </view>
    <view class="page-section">
      <text>推荐展示样式(Taro 团队成员):</text>
      <label v-for="item in list" class="checkbox-list__label">
        <checkbox class="checkbox-list__checkbox" :value="item.value" :checked="item.checked">{{ item.text }}</checkbox>
      </label>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          value: '美国',
          text: '美国',
          checked: false
        },
        {
          value: '中国',
          text: '中国',
          checked: true
        },
        {
          value: '巴西',
          text: '巴西',
          checked: false
        },
        {
          value: '日本',
          text: '日本',
          checked: false
        },
        {
          value: '英国',
          text: '英国',
          checked: false
        },
        {
          value: '法国',
          text: '法国',
          checked: false
        }
      ]
    }
  }
}
</script>
```
</TabItem>
</Tabs>

## CheckboxProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| value | `string` |  | 是 | `<Checkbox/>`标识，选中时触发`<CheckboxGroup/>`的 change 事件，并携带 `<Checkbox/>` 的 value |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| checked | `boolean` | `false` | 否 | 当前是否选中，可用来设置默认选中 |
| color | `string` |  | 否 | checkbox的颜色，同 css 的 color |
| onChange | `CommonEventFunction<{ value: string[]; }>` |  | 否 | 选中项发生变化时触发 change 事件，小程序无此 API |
| nativeProps | `Record<string, unknown>` |  | 否 | 用于透传 `WebComponents` 上的属性到内部 H5 标签上 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CheckboxProps.value | ✔️ |  | ✔️ |
| CheckboxProps.disabled | ✔️ | ✔️ | ✔️ |
| CheckboxProps.checked | ✔️ | ✔️ | ✔️ |
| CheckboxProps.color | ✔️ | ✔️ | ✔️ |
| CheckboxProps.onChange |  | ✔️ | ✔️ |
| CheckboxProps.nativeProps |  | ✔️ |  |
