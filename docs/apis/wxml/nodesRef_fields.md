---
title: nodesRef.fields(fields, [callback])
sidebar_label: nodesRef.fields
---


获取节点的相关信息，需要获取的字段在 fields 中指定。返回值是 nodesRef 对应的 selectorQuery。可指定获取的字段包括：

| 字段名 | 默认值 | 说明 |
| :-: | :-: | :-: |
| id | 否 | 是否返回节点 `id` |
| dataset | 否 | 是否返回节点 `dataset` |
| rect | 否 | 是否返回节点布局位置（`left` `right` `top` `bottom`） |
| size | 否 | 是否返回节点尺寸（`width` `height`） |
| scrollOffset | 否 | 是否返回节点的 `scrollLeft` `scrollTop` ，节点必须是 `scroll-view` 或者 viewport |
| properties | [] | 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值， `id` `class` `style` 和事件绑定的属性值不可获取） |
| computedStyle | [] | 指定样式名列表，返回节点对应样式名的当前值 |

> 注意： computedStyle 的优先级高于 size，当同时在 computedStyle 里指定了 width/height 和传入了 size: true，则优先返回 computedStyle 获取到的 width/height。

## 示例代码

```jsx
import Taro from '@tarojs/taro'

Taro.createSelectorQuery()
  .select('#the-id')
  .fields({
    dataset: true,
    size: true,
    scrollOffset: true,
    properties: ['scrollX', 'scrollY'],
    computedStyle: ['margin', 'backgroundColor']
  }, res => {
    res.dataset    // 节点的 dataset
    res.width      // 节点的宽度
    res.height     // 节点的高度
    res.scrollLeft // 节点的水平滚动位置
    res.scrollTop  // 节点的竖直滚动位置
    res.scrollX    // 节点 scroll-x 属性的当前值
    res.scrollY    // 节点 scroll-y 属性的当前值
    // 此处返回指定要返回的样式名
    res.margin
    res.backgroundColor
  })
  .exec()
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

