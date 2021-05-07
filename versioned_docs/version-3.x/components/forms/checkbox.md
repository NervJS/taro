---
title: Checkbox
sidebar_label: Checkbox
---

多选项目

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
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
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
          value: 'yuche',
          text: 'yuche',
          checked: false
        },
        {
          value: 'cjj',
          text: 'cjj',
          checked: true
        },
        {
          value: 'xiexiaoli',
          text: 'xiexiaoli',
          checked: true
        },
        {
          value: 'honly',
          text: 'honly',
          checked: true
        },
        {
          value: 'cs',
          text: 'cs',
          checked: true
        },
        {
          value: 'zhutianjian',
          text: 'zhutianjian',
          checked: true
        },
        {
          value: '隔壁老李',
          text: '隔壁老李',
          checked: true
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


<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style={{ textAlign: "center"}}>默认值</th>
      <th style={{ textAlign: "center"}}>必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>value</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>是</td>
      <td><code>&lt;Checkbox/&gt;</code>标识，选中时触发<code>&lt;CheckboxGroup/&gt;</code>的 change 事件，并携带 <code>&lt;Checkbox/&gt;</code> 的 value</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>checked</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>当前是否选中，可用来设置默认选中</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>checkbox的颜色，同 css 的 color</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td>
        `BaseEventOrigFunction&lt;{`{ value: string[]; }`}&gt;
      </td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>选中项发生变化时触发 change 事件，小程序无此 API</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CheckboxProps.value | ✔️ |  | ✔️ |
| CheckboxProps.disabled | ✔️ | ✔️ | ✔️ |
| CheckboxProps.checked | ✔️ | ✔️ | ✔️ |
| CheckboxProps.color | ✔️ | ✔️ | ✔️ |
| CheckboxProps.onChange |  | ✔️ | ✔️ |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Checkbox | ✔️ | ✔️ | ✔️ |
