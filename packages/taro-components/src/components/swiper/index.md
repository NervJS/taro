swiper

## API
| 是否支持 | 属性                    | 类型        | 默认值            | 说明                                                         |
| -------- | ----------------------- | ----------- | ----------------- | ------------------------------------------------------------ |
| √        | indicatorDots           | Boolean     | false             | 是否显示面板指示点                                           |
| √        | indicatorColor          | String      | rgba(0, 0, 0, .3) | 指示点颜色                                                   |
| √        | indicatorActiveColor    | String      | 000               | 当前选中的指示点颜色                                         |
| √        | autoplay                | Boolean     | false             | 是否自动切换                                                 |
| √        | interval                | Number      | 5000              | 自动切换时间间隔                                             |
| √        | duration                | Number      | 500               | 滑动动画时长                                                 |
| √        | current                 | Number      | 0                 | 当前所在滑块的 index                                         |
| √        | bindchange              | EventHandle |                   | current 改变时会触发 change 事件                             |
| √        | circular                | Boolean     | false             | 是否采用衔接滑动                                             |
| ×        | skip-hidden-item-layout | Boolean     | false             | 是否跳过未显示的滑块布局，设为 true 可优化复杂情况下的滑动性能，但会丢失隐藏状态滑块的布局信息 |
| ×        | display-multiple-items  | Number      | 1                 | 同时显示的滑块数量                                           |
| ×        | vertical                | Boolean     | false             | 滑动方向是否为纵向                                           |
| ×        | bindanimationfinish     | EventHandle |                   | 动画结束时会触发 animationfinish 事件                        |
