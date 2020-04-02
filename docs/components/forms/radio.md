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

## RadioProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| value | `string` |  | 否 | `<Radio/>` 标识。当该`<Radio/>` 选中时，`<RadioGroup/>`的 change 事件会携带`<Radio/>`的 value |
| checked | `boolean` | `false` | 否 | 当前是否选中 |
| disabled | `boolean` | `false` | 否 | 是否禁用 |
| color | `string` | `"#09BB07"` | 否 | Radio 的颜色，同 css 的 color |

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
