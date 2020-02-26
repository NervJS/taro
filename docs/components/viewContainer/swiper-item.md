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

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| itemId | `string` | 否 | 该 swiper-item 的标识符 |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SwiperItemProps.itemId | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SwiperItem | ✔️ |  |  |
