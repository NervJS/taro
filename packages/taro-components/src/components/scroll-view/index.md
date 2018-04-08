scroll-view

## API

|             | 属性                  | 类型        | 默认值 | 说明                                                                                 |
| ----------- | --------------------- | ----------- | ------ | ------------------------------------------------------------------------------------ |
| √           | scroll-x              | Boolean     | false  | 允许横向滚动                                                                         |
| √           | scroll-y              | Boolean     | false  | 允许纵向滚动                                                                         |
| √           | upper-threshold       | Number      | 50     | 距顶部/左边多远时（单位 px），触发 scrolltoupper 事件                                |
| √           | lower-threshold       | Number      | 50     | 距底部/右边多远时（单位 px），触发 scrolltolower 事件                                |
| √           | scroll-top            | Number      |        | 设置竖向滚动条位置                                                                   |
| √           | scroll-left           | Number      |        | 设置横向滚动条位置                                                                   |
|             | scroll-into-view      | String      |        | 值应为某子元素 id（id 不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素 |
| √           | scroll-with-animation | Boolean     | false  | 在设置滚动条位置时使用动画过渡                                                       |
|             | enable-back-to-top    | Boolean     | false  | iOS 点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向                     |
| √           | bindscrolltoupper     | EventHandle |        | 滚动到顶部/左边，会触发 scrolltoupper 事件                                           |
| √           | bindscrolltolower     | EventHandle |        | 滚动到底部/右边，会触发 scrolltolower 事件                                           |
| √(onScroll) | bindscroll            | EventHandle |        | 是否解码                                                                             |
