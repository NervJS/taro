---
title: Swiper
sidebar_label: Swiper
---

滑块视图容器。其中只可放置 swiper-item 组件，否则会导致未定义的行为。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html)

## 类型

```tsx
ComponentType<SwiperProps>
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

## SwiperProps

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
      <td>indicatorDots</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否显示面板指示点</td>
    </tr>
    <tr>
      <td>indicatorColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;rgba(0, 0, 0, .3)&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指示点颜色</td>
    </tr>
    <tr>
      <td>indicatorActiveColor</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;#000000&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>当前选中的指示点颜色</td>
    </tr>
    <tr>
      <td>autoplay</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否自动切换</td>
    </tr>
    <tr>
      <td>current</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>0</code></td>
      <td style="text-align:center">否</td>
      <td>当前所在滑块的 index</td>
    </tr>
    <tr>
      <td>currentItemId</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>当前所在滑块的 item-id ，不能与 current 被同时指定</td>
    </tr>
    <tr>
      <td>interval</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>5000</code></td>
      <td style="text-align:center">否</td>
      <td>自动切换时间间隔</td>
    </tr>
    <tr>
      <td>duration</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>500</code></td>
      <td style="text-align:center">否</td>
      <td>滑动动画时长</td>
    </tr>
    <tr>
      <td>circular</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否采用衔接滑动</td>
    </tr>
    <tr>
      <td>vertical</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>滑动方向是否为纵向</td>
    </tr>
    <tr>
      <td>previousMargin</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;0px&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值</td>
    </tr>
    <tr>
      <td>nextMargin</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;0px&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值</td>
    </tr>
    <tr>
      <td>displayMultipleItems</td>
      <td><code>number</code></td>
      <td style="text-align:center"><code>1</code></td>
      <td style="text-align:center">否</td>
      <td>同时显示的滑块数量</td>
    </tr>
    <tr>
      <td>skipHiddenItemLayout</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息</td>
    </tr>
    <tr>
      <td>easingFunction</td>
      <td><code>&quot;default&quot; | &quot;linear&quot; | &quot;easeInCubic&quot; | &quot;easeOutCubic&quot; | &quot;easeInOutCubic&quot;</code></td>
      <td style="text-align:center"><code>&quot;default&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>指定 swiper 切换缓动动画类型</td>
    </tr>
    <tr>
      <td>onChange</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDeatil&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>current 改变时会触发 change 事件</td>
    </tr>
    <tr>
      <td>onTransition</td>
      <td><code>BaseEventOrigFunction&lt;onTransitionEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>swiper-item 的位置发生改变时会触发 transition 事件</td>
    </tr>
    <tr>
      <td>onAnimationFinish</td>
      <td><code>BaseEventOrigFunction&lt;onChangeEventDeatil&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>动画结束时会触发 animationfinish 事件</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SwiperProps.indicatorDots | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.indicatorColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.indicatorActiveColor | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.autoplay | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.current | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.interval | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.duration | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| SwiperProps.circular | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.vertical | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.previousMargin | ✔️ |  |  |  | ✔️ |  |
| SwiperProps.nextMargin | ✔️ |  |  |  | ✔️ |  |
| SwiperProps.displayMultipleItems | ✔️ | ✔️ |  | ✔️ | ✔️ |  |
| SwiperProps.skipHiddenItemLayout | ✔️ | ✔️ |  |  |  |  |
| SwiperProps.easingFunction | ✔️ |  |  |  |  |  |
| SwiperProps.onChange | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| SwiperProps.onTransition | ✔️ |  |  |  |  |  |
| SwiperProps.onAnimationFinish | ✔️ | ✔️ |  |  | ✔️ | ✔️ |

### TChangeSource

导致变更的原因

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>autoplay</td>
      <td>自动播放</td>
    </tr>
    <tr>
      <td>touch</td>
      <td>用户划动</td>
    </tr>
    <tr>
      <td></td>
      <td>其它原因</td>
    </tr>
  </tbody>
</table>

### TEasingFunction

指定 swiper 切换缓动动画类型

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>default</td>
      <td>默认缓动函数</td>
    </tr>
    <tr>
      <td>linear</td>
      <td>线性动画</td>
    </tr>
    <tr>
      <td>easeInCubic</td>
      <td>缓入动画</td>
    </tr>
    <tr>
      <td>easeOutCubic</td>
      <td>缓出动画</td>
    </tr>
    <tr>
      <td>easeInOutCubic</td>
      <td>缓入缓出动画</td>
    </tr>
  </tbody>
</table>

### onChangeEventDeatil

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>current</td>
      <td><code>number</code></td>
      <td>当前所在滑块的索引</td>
    </tr>
    <tr>
      <td>source</td>
      <td><code>&quot;&quot; | &quot;autoplay&quot; | &quot;touch&quot;</code></td>
      <td>导致变更的原因</td>
    </tr>
  </tbody>
</table>

### onTransitionEventDetail

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dx</td>
      <td><code>number</code></td>
      <td>X 坐标</td>
    </tr>
    <tr>
      <td>dy</td>
      <td><code>number</code></td>
      <td>Y 坐标</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Swiper | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
