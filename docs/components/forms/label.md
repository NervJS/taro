---
title: Label
sidebar_label: Label
---

用来改进表单组件的可用性。

使用for属性找到对应的id，或者将控件放在该标签下，当点击时，就会触发对应的控件。 for优先级高于内部控件，内部有多个控件的时候默认触发第一个控件。 目前可以绑定的控件有：button, checkbox, radio, switch。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/label.html)

## 类型

```tsx
ComponentType<LabelProps>
```

## 示例代码

```tsx
class App extends Components {

  render () {
    return (
      <RadioGroup>
        <Label className='example-body__label' for='1' key='1'>
          <Radio value='USA'>USA</Radio>
        </Label>
        <Label className='example-body__label' for='2' key='2'>
          <Radio value='CHN' checked>
          CHN
          </Radio>
        </Label>
      </RadioGroup>
    )
  }
}
```

## LabelProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>for</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>绑定控件的 id</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Label | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
