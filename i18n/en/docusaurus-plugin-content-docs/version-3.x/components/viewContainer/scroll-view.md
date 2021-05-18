---
title: ScrollView
sidebar_label: ScrollView
---

The scrollable view area. When vertical scrolling is used, a fixed height must set for scroll-view via WXSS. The unit of length of the component's properties is px by default. 

Tips:
The ScrollView component in H5 is implemented by scrolling inside a container with a fixed height (or width), so it is important to set the height of the container correctly. For example, if the height of the ScrollView expands the body, there will be two scrollbars at the same time (the scrollbar under the body and the scrollbar of the ScrollView).
 If the ScrollView component in the WeChat applet is set to scrollX horizontally and has multiple child elements (a single child element with a fixed width will scroll horizontally), you need to set `white-space: nowrap` with WXSS to ensure that the element does not change lines, and set `display: inline-inline` for the ScrollView internal elements with `display: inline-block` to make them scroll horizontally.


> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/scroll-view.html)

## Type

```tsx
ComponentType<ScrollViewProps>
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
export default class PageView extends Component {
  constructor() {
    super(...arguments)
  }

  onScrollToUpper() {}

  // or use arrow function
  // onScrollToUpper = () => {}

  onScroll(e){
    console.log(e.detail)
  }

  render() {
    const scrollStyle = {
      height: '150px'
    }
    const scrollTop = 0
    const Threshold = 20
    const vStyleA = {
      height: '150px',
      'background-color': 'rgb(26, 173, 25)'
    }
    const vStyleB = {
       height: '150px',
      'background-color': 'rgb(39,130,215)'
    }
    const vStyleC = {
      height: '150px',
      'background-color': 'rgb(241,241,241)',
      color: '#333'
    }
    return (
      <ScrollView
        className='scrollview'
        scrollY
        scrollWithAnimation
        scrollTop={scrollTop}
        style={scrollStyle}
        lowerThreshold={Threshold}
        upperThreshold={Threshold}
        onScrollToUpper={this.onScrollToUpper.bind(this)} // When using the arrow function, you can write it like `onScrollToUpper={this.onScrollToUpper}`
        onScroll={this.onScroll}
      >
        <View style={vStyleA}>A</View>
        <View style={vStyleB}>B</View>
        <View style={vStyleC}>C</View>
      </ScrollView>
    )
  }
}
```

</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="container">
    <view class="page-body">
      <view class="page-section">
        <view class="page-section-title">
          <text>Vertical Scroll</text>
        </view>
        <view class="page-section-spacing">
          <scroll-view :scroll-y="true" style="height: 300rpx;" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll" :scroll-into-view="toView" :scroll-top="scrollTop">
            <view id="demo1" class="scroll-view-item demo-text-1">1</view>
            <view id="demo2"  class="scroll-view-item demo-text-2">2</view>
            <view id="demo3" class="scroll-view-item demo-text-3">3</view>
          </scroll-view>
        </view>
      </view>
      <view class="page-section">
        <view class="page-section-title">
          <text>Horizontal Scroll</text>
        </view>
        <view class="page-section-spacing">
          <scroll-view class="scroll-view_H" :scroll-x="true" @scroll="scroll" style="width: 100%">
            <view id="demo21" class="scroll-view-item_H demo-text-1">a</view>
            <view id="demo22"  class="scroll-view-item_H demo-text-2">b</view>
            <view id="demo23" class="scroll-view-item_H demo-text-3">c</view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const order = ['demo1', 'demo2', 'demo3']
export default {
  name: 'Index',
  data() {
    return {
      scrollTop: 0,
      toView: 'demo2'
    }
  },

  methods: {
    upper(e) {
      console.log('upper:', e)
    },

    lower(e) {
      console.log('lower:', e)
    },

    scroll(e) {
      console.log('scroll:', e)
    }
  }
}
</script>

<style>
.page-section-spacing{
  margin-top: 60rpx;
}
.scroll-view_H{
  white-space: nowrap;
}
.scroll-view-item{
  height: 300rpx;
}
.scroll-view-item_H{
  display: inline-block;
  width: 100%;
  height: 300rpx;
}

.demo-text-1 { background: #ccc; }
.demo-text-2 { background: #999; }
.demo-text-3 { background: #666; }
</style>
```

</TabItem>
</Tabs>

## ScrollViewProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scrollX</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Supports horizontal scrolling.</td>
    </tr>
    <tr>
      <td>scrollY</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Supports vertical scrolling.</td>
    </tr>
    <tr>
      <td>upperThreshold</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>50</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the distance from the top/left of the page when a scrolltoupper event is triggered.</td>
    </tr>
    <tr>
      <td>lowerThreshold</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>50</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the distance from the bottom/right of the page when a scrolltoupper event is triggered.</td>
    </tr>
    <tr>
      <td>scrollTop</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the location of the vertical scroll bar.</td>
    </tr>
    <tr>
      <td>scrollLeft</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the location of the horizontal scroll bar.</td>
    </tr>
    <tr>
      <td>scrollIntoView</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the direction to which the scroll bar can be moved. Its value should be the ID of a child element (the ID cannot begin with a number), and this child element is scrolled in the direction specified in this property.</td>
    </tr>
    <tr>
      <td>scrollWithAnimation</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Uses an animation for transition when setting the scroll bar.</td>
    </tr>
    <tr>
      <td>enableBackToTop</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Enables the scroll bar to return to the top when the top status bar is tapped on iOS or the title bar is double-tapped on Android. Only vertical scrolling is supported.	</td>
    </tr>
    <tr>
      <td>enableFlex</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Enables the flexbox layout. When enabled, the current node with <code>display: flex</code> declared becomes a flex container and acts on its children.</td>
    </tr>
    <tr>
      <td>scrollAnchoring</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Turn on the scroll anchoring feature, which controls the scroll position from jittering as the content changes, only on iOS, see the CSS <code>overflow-anchor</code> property on Android.</td>
    </tr>
    <tr>
      <td>refresherEnabled</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Enable custom drop-down refresh.</td>
    </tr>
    <tr>
      <td>refresherThreshold</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}><code>45</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Set a custom drop-down refresh threshold.</td>
    </tr>
    <tr>
      <td>refresherDefaultStyle</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>'black'</code></td>
      <td style={{ textAlign: "center"}}>否</td>
      <td>Set custom dropdown refresh default style, support <code>black | white | none</code>, none means don't use default style.</td>
    </tr>
    <tr>
      <td>refresherBackground</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>'#FFF'</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Set custom drop-down refresh area background color</td>
    </tr>
    <tr>
      <td>refresherTriggered</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>fasle</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Set the current dropdown refresh status, true means the dropdown refresh has been triggered, false means the dropdown refresh has not been triggered.</td>
    </tr>
    <tr>
      <td>onScrollToUpper</td>
      <td><code>(event: BaseEventOrigFunction&lt;any&gt;) =&gt; any</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Scrolling to the top/left will trigger the scrolltoupper event.</td>
    </tr>
    <tr>
      <td>onScrollToLower</td>
      <td><code>(event: BaseEventOrigFunction&lt;any&gt;) =&gt; any</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Scrolling to the bottom/right will trigger the scrolltolower event.</td>
    </tr>
    <tr>
      <td>onScroll</td>
      <td><code>(event: BaseEventOrigFunction&lt;onScrollDetail&gt;) =&gt; any</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered on scrolling.<br /><code>event.detail = {`{ scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}`}</code></td>
    </tr>
    <tr>
      <td>onRefresherPulling</td>
      <td><code>(event: BaseEventOrigFunction&lt;any&gt;) =&gt; any</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Custom dropdown refresh control is dropped.</td>
    </tr>
    <tr>
      <td>onRefresherRefresh</td>
      <td><code>(event: BaseEventOrigFunction&lt;any&gt;) =&gt; any</code></td>
      <td style={{ textAlign: "Custom dropdown refresh is triggered."}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td></td>
    </tr>
    <tr>
      <td>onRefresherRestore</td>
      <td><code>(event: BaseEventOrigFunction&lt;any&gt;) =&gt; any</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Custom dropdown refresh is reset.</td>
    </tr>
    <tr>
      <td>onRefresherAbort</td>
      <td><code>(event: BaseEventOrigFunction&lt;any&gt;) =&gt; any</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Custom dropdown refresh is aborted.</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| ScrollViewProps.scrollX | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️(二选一) |
| ScrollViewProps.scrollY | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️(二选一) |
| ScrollViewProps.upperThreshold | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.lowerThreshold | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.scrollTop | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.scrollLeft | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.scrollIntoView | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |  |
| ScrollViewProps.scrollWithAnimation | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.enableBackToTop | ✔️ |  | ✔️ |  |  | ✔️ |
| ScrollViewProps.enableFlex | ✔️ |  |  |  |  |  |
| ScrollViewProps.scrollAnchoring | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherEnabled | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherThreshold | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherDefaultStyle | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherBackground | ✔️ |  |  |  |  |  |
| ScrollViewProps.refresherTriggered | ✔️ |  |  |  |  |  |
| ScrollViewProps.onScrollToUpper | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.onScrollToLower | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.onScroll | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| ScrollViewProps.onRefresherPulling | ✔️ |  |  |  |  |  |
| ScrollViewProps.onRefresherRefresh | ✔️ |  |  |  |  |  |
| ScrollViewProps.onRefresherRestore | ✔️ |  |  |  |  |  |
| ScrollViewProps.onRefresherAbort | ✔️ |  |  |  |  |  |

### onScrollDetail

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>scrollLeft</td>
      <td><code>number</code></td>
      <td>Horizontal scrollbar position.</td>
    </tr>
    <tr>
      <td>scrollTop</td>
      <td><code>number</code></td>
      <td>Vertical scrollbar position.</td>
    </tr>
    <tr>
      <td>scrollHeight</td>
      <td><code>number</code></td>
      <td>Scroll bar height</td>
    </tr>
    <tr>
      <td>scrollWidth</td>
      <td><code>number</code></td>
      <td>Scroll bar width</td>
    </tr>
    <tr>
      <td>deltaX</td>
      <td><code>number</code></td>
      <td></td>
    </tr>
    <tr>
      <td>deltaY</td>
      <td><code>number</code></td>
      <td></td>
    </tr>
  </tbody>
</table>
