---
title: Label
sidebar_label: Label
---

Improves the availability of form components.

You can use the for property to find the appropriate ID. Alternatively, you can place the control within this tag, so that you can tap the tag to trigger the corresponding control. The for property takes precedence over internal controls. When multiple internal controls are available, the first control is triggered by default. The following controls can be bound to this component: button, checkbox, radio, and switch.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/label.html)

## Type

```tsx
ComponentType<LabelProps>
```

## Examples

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
class App extends Components {

  render () {
    return (
      <RadioGroup>
        <Label className='example-body__label' for='1' key='1'>
          <Radio id='1' value='USA'>USA</Radio>
        </Label>
        <Label className='example-body__label' for='2' key='2'>
          <Radio id='2' value='CHN' checked>
          CHN
          </Radio>
        </Label>
      </RadioGroup>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <radio-group>
    <label class="example-body__label" for="1" key="1">
      <radio id="1" value="USA" />
      USA
    </label>
    <label class="example-body__label" for="2" key="2">
      <radio id="2" value="CHN" :checked="true" />
      CHN
    </label>
  </radio-group>
</template>
```
  
</TabItem>
</Tabs>


## LabelProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>for</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The ID of the bound control, not supported in RN</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Label | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
