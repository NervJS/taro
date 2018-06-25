##### ScrollView
##### 可滚动视图区域。

> 属性及支持度

| 微信小程序 | H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| √ | √ | x (二选一) | scrollX              | Boolean     | false  | 允许横向滚动 |
| √ | √ | x (二选一) | scrollY              | Boolean     | false  | 允许纵向滚动 |
| √ | √ | √ | upperThreshold       | Number      | 50     | 距顶部/左边多远时（单位 px），触发 scrolltoupper 事件  |
| √ | √ | √ | lowerThreshold       | Number      | 50     | 距底部/右边多远时（单位 px），触发 scrolltolower 事件  |
| √ | √ | √ | scrollTop            | Number      |        | 设置竖向滚动条位置 |
| √ | √ | √ | scrollLeft           | Number      |        | 设置横向滚动条位置 |
| √ |   | x | scrollIntoView      | String      |        | 值应为某子元素 id（id 不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素 |
| √ | √ | √ | scrollWithAnimation | Boolean     | false  | 在设置滚动条位置时使用动画过渡  |
| √ |   | √ | enableBackToTop    | Boolean     | false  | iOS 点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向                     |
| √ | √ | √ | onScrolltoupper     | EventHandle |        | 滚动到顶部/左边，会触发 scrolltoupper 事件 |
| √ | √ | √ | onScrolltolower     | EventHandle |        | 滚动到底部/右边，会触发 scrolltolower 事件 |
| √ | √ | √ | onScroll            | EventHandle |        | 滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY} |


使用竖向滚动时，需要给 `<scroll-view/>` 一个固定高度，通过 WXSS 设置 height。

###### 示例：
```
<ScrollView className='scrollview'
            scrollY
            scrollWithAnimation
            scrollTop='0'
            style='height: 150px;'
            lowerThreshold='20'
            upperThreshold='20'
            onScrolltoupper={this.onScrolltoupper}
            onScroll={this.onScroll}>
  <View style='height:150px;background-color:rgb(26,173,25);'>A</View>
  <View style='height:150px;background-color:rgb(39,130,215);'>B</View>
  <View style='height:150px;background-color:rgb(241,241,241);color: #333;'>C</View>
</ScrollView>
```
