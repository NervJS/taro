---
title: NavigationBar
sidebar_label: NavigationBar
---

页面导航条配置节点，用于指定导航栏的一些属性。只能是 PageMeta 组件内的第一个节点，需要配合它一同使用。
通过这个节点可以获得类似于调用 Taro.setNavigationBarTitle Taro.setNavigationBarColor 等接口调用的效果。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html)

## 类型

```tsx
ComponentType<NavigationBarProps>
```

## NavigationBarProps

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
      <td>title</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>导航条标题</td>
    </tr>
    <tr>
      <td>loading</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>是否在导航条显示 loading 加载提示</td>
    </tr>
    <tr>
      <td>frontColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>导航条前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000</td>
    </tr>
    <tr>
      <td>backgroundColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>导航条背景颜色值，有效值为十六进制颜色</td>
    </tr>
    <tr>
      <td>colorAnimationDuration</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>改变导航栏颜色时的动画时长，默认为 0 （即没有动画效果）</td>
    </tr>
    <tr>
      <td>colorAnimationTimingFunc</td>
      <td><code>&quot;linear&quot; | &quot;easeIn&quot; | &quot;easeOut&quot; | &quot;easeInOut&quot;</code></td>
      <td style="text-align:center"><code>&quot;linear&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>改变导航栏颜色时的动画方式，支持 linear 、 easeIn 、 easeOut 和 easeInOut</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NavigationBarProps.title | ✔️ |  |  |
| NavigationBarProps.loading | ✔️ |  |  |
| NavigationBarProps.frontColor | ✔️ |  |  |
| NavigationBarProps.backgroundColor | ✔️ |  |  |
| NavigationBarProps.colorAnimationDuration | ✔️ |  |  |
| NavigationBarProps.colorAnimationTimingFunc | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NavigationBar | ✔️ |  |  |
