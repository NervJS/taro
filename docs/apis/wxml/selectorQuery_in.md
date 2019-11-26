---
title: selectorQuery.in(component)
sidebar_label: selectorQuery.in
---


将选择器的选取范围更改为自定义组件 component 内。（初始时，选择器仅选取页面范围的节点，不会选取任何自定义组件中的节点。）

注意：H5 端传 this 而不是传 this.$scope。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Component({
  ready () {
    if (process.env.TARO_ENV === 'h5') {
      const query = Taro.createSelectorQuery().in(this)
    } else {
      const query = Taro.createSelectorQuery().in(this.$scope)
    }
  }
})
```



## API支持度


| API | 微信小程序 | H5 | React Native |
| :-: | :-: | :-: | :-: |
| selectorQuery.in | ✔️ | ✔️ |  |
| selectorQuery.select | ✔️ | ✔️ |  |
| selectorQuery.selectAll | ✔️ | ✔️ |  |
| selectorQuery.selectViewport | ✔️ | ✔️ |  |
| nodesRef.boundingClientRect | ✔️ | ✔️ |  |
| nodesRef.scrollOffset | ✔️ | ✔️ |  |
| nodesRef.fields | ✔️ | ✔️ |  |
| selectorQuery.exec | ✔️ | ✔️ |  |

