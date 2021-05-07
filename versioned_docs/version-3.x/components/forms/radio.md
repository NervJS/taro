---
title: Radio
sidebar_label: Radio
---

单选项目

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/radio.html)

## 类型

```tsx
ComponentType<RadioProps>
```

## 示例代码


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
export default class PageRadio extends Component {
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
      <View className='container'>
        <Head title='Radio' />
        <View className='page-body'>
          <View className='page-section'>
            <Text>默认样式</Text>
            <Radio value='选中' checked>选中</Radio>
            <Radio style='margin-left: 20rpx' value='未选中'>未选中</Radio>
          </View>
          <View className='page-section'>
            <Text>推荐展示样式</Text>
            <View className='radio-list'>
              <RadioGroup>
                {this.state.list.map((item, i) => {
                  return (
                    <Label className='radio-list__label' for={i} key={i}>
                      <Radio className='radio-list__radio' value={item.value} checked={item.checked}>{item.text}</Radio>
                    </Label>
                  )
                })}
              </RadioGroup>
            </View>
          </View>
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
      <radio value="选中" :checked="true">选中</radio>
      <radio style="margin-left: 20rpx;" value="未选中">未选中</radio>
    </view>
    <view class="page-section">
      <text>推荐展示样式(Taro 团队成员):</text>
        <radio-group @change="onChange">
          <label v-for="item in list" class="checkbox-list__label">
            <radio class="checkbox-list__checkbox" :value="item.value" :checked="item.checked">{{ item.text }}</radio>
          </label>
        </radio-group>
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
          checked: false
        },
        {
          value: 'xiexiaoli',
          text: 'xiexiaoli',
          checked: false
        },
        {
          value: 'honly',
          text: 'honly',
          checked: false
        },
        {
          value: 'cs',
          text: 'cs',
          checked: false
        },
        {
          value: 'zhutianjian',
          text: 'zhutianjian',
          checked: false
        },
        {
          value: '隔壁老李',
          text: '隔壁老李',
          checked: true
        }
      ]
    }
  },
  methods: {
    onChange: function(e) {
      console.log(e.detail.value)
    }
  }
}
</script>
```
  
</TabItem>
</Tabs>

## RadioProps

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
      <td style={{ textAlign: "center"}}>否</td>
      <td><code>&lt;Radio/&gt;</code> 标识。当该<code>&lt;Radio/&gt;</code> 选中时，<code>&lt;RadioGroup/&gt;</code>的 change 事件会携带<code>&lt;Radio/&gt;</code>的 value</td>
    </tr>
    <tr>
      <td>checked</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>当前是否选中</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>是否禁用</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;#09BB07&quot;</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Radio 的颜色，同 css 的 color</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RadioProps.value | ✔️ |  | ✔️ |
| RadioProps.checked | ✔️ | ✔️ | ✔️ |
| RadioProps.disabled | ✔️ | ✔️ | ✔️ |
| RadioProps.color | ✔️ |  | ✔️ |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Radio | ✔️ | ✔️ | ✔️ |
