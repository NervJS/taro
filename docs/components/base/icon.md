---
title: Icon
sidebar_label: Icon
---

图标。组件属性的长度单位默认为 px

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/icon.html)

## 类型

```tsx
ComponentType<IconProps>
```

## 示例代码

```tsx
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <View className='components-page'>
        <Icon size='60' type='success' />
        <Icon size='60' type='info' />
        <Icon size='60' type='warn' color='#ccc' />
        <Icon size='60' type='warn' />
        <Icon size='60' type='waiting' />
        <Icon size='20' type='success_no_circle' />
        <Icon size='20' type='warn' />
        <Icon size='20' type='success' />
        <Icon size='20' type='download' />
        <Icon size='20' type='clear' color='red' />
        <Icon size='20' type='search' />
      </View>
    )
  }
}
```

## IconProps

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>&quot;success&quot; | &quot;success_no_circle&quot; | &quot;info&quot; | &quot;warn&quot; | &quot;waiting&quot; | &quot;cancel&quot; | &quot;download&quot; | &quot;search&quot; | &quot;clear&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>icon 的类型</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>23</code></td>
      <td style="text-align:center">否</td>
      <td>icon 的大小，单位px</td>
    </tr>
    <tr>
      <td>color</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>icon 的颜色，同 css 的 color</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IconProps.type | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| IconProps.size | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| IconProps.color | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

### TIconType

icon 的类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>success</td>
      <td>成功图标</td>
    </tr>
    <tr>
      <td>success_no_circle</td>
      <td>成功图标（不带外圈）</td>
    </tr>
    <tr>
      <td>info</td>
      <td>信息图标</td>
    </tr>
    <tr>
      <td>warn</td>
      <td>警告图标</td>
    </tr>
    <tr>
      <td>waiting</td>
      <td>等待图标</td>
    </tr>
    <tr>
      <td>cancel</td>
      <td>取消图标</td>
    </tr>
    <tr>
      <td>download</td>
      <td>下载图标</td>
    </tr>
    <tr>
      <td>search</td>
      <td>搜索图标</td>
    </tr>
    <tr>
      <td>clear</td>
      <td>清楚图标</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Icon | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
