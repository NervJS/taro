---
title: SwiperItem
sidebar_label: SwiperItem
---

仅可放置在 swiper 组件中，宽高自动设置为100%

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html)

## 类型

```tsx
ComponentType<SwiperItemProps>
```

## 示例代码

```tsx
class App extends Component {
  render () {
    return (
      <Swiper
        className='test-h'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        vertical
        circular
        indicatorDots
        autoplay>
        <SwiperItem>
          <View className='demo-text-1'>1</View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-2'>2</View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-3'>3</View>
        </SwiperItem>
      </Swiper>
    )
  }
}
```

## SwiperItemProps

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
      <td>itemId</td>
      <td><code>string</code></td>
      <td style="text-align:center">否</td>
      <td>该 swiper-item 的标识符</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SwiperItemProps.itemId | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SwiperItem | ✔️ |  |  |
