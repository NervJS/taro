---
title: selectorQuery.select(selector)
sidebar_label: selectorQuery.select
---


在当前页面下选择第一个匹配选择器 selector 的节点，返回一个 NodesRef 对象实例，可以用于获取节点信息。

* ID 选择器：`#the-id`
* class 选择器（可以连续指定多个）：`.a-class.another-class`
* 子元素选择器：`.the-parent > .the-child`
* 后代选择器：`.the-ancestor .the-descendant`
* 跨自定义组件的后代选择器：`.the-ancestor >>> .the-descendant`
* 多选择器的并集：`#a-node, .some-other-nodes`



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

