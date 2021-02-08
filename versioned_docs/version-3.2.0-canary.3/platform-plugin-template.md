---
title: 模板
---

Taro3 通过把 DOM 树的数据进行 `setData`，从而驱动模板（`<template>`）拼接来渲染出视图。

因此开发者可以看到编译后的代码中，页面模板文件的内容很简单，只是引用了公共模板 `base.xml`，所有组件的模板都在此文件中进行声明。

我们可以创建一个模板类，控制 `base` 模板的编译结果。

## 递归与非递归模板

我们把模板相关的处理逻辑封装成了基类。分别是给**支持模板递归**的小程序继承的 `RecursiveTemplate` 类，和给**不支持模板递归**的小程序继承的 `UnRecursiveTemplate` 类。

### 可递归模板

支持模板递归的小程序中，同一个模板能够不断调用自身，包括支付宝、头条、百度小程序。

`view_0` 引用 `container_0`，`container_0` 能再引用 `view_0`：

![](http://storage.jd.com/cjj-pub-images/recursive_temp.png)

### 非递归模板

不支持模板递归的小程序中，引用过的模板不能再调用自身，包括微信、QQ、京东小程序。

`view_0` 引用 `container_0`，`container_0` 不能再引用 `view_0`，只能引用新的 `view` 模板 `view_1`：

![](http://storage.jd.com/cjj-pub-images/unrecursive_temp.png)

## 模板基类

### this.Adapter

`object`

平台的模板语法关键词。

例子：

```js
// 声明了微信小程序模板语法关键词的 Adapter
class Template extends UnRecursiveTemplate {
  Adapter = {
    if: 'wx:if',
    else: 'wx:else',
    elseif: 'wx:elif',
    for: 'wx:for',
    forItem: 'wx:for-item',
    forIndex: 'wx:for-index',
    key: 'wx:key',
    xs: 'wxs',
    type: 'weapp'
  }
}
```

### this.isSupportRecursive

`boolean`

只读，是否支持模板递归。

### this.supportXS

`boolean`

默认值：false

是否支持渲染层脚本，如微信小程序的 wxs，支付宝小程序的 sjs。

### this.exportExpr

`string`

默认值：'module.exports ='

渲染层脚本的导出命令。

例子：

```js
// 支付宝小程序 sjs 脚本的导出命令为 ES 模式
class Template extends RecursiveTemplate {
  exportExpr = 'export default'
}
```

### this.internalComponents

`object`

Taro 内置组件列表，包括了相对通用的组件及其部分通用属性。

### this.focusComponents

`Set<string>`

可以设置 focus 聚焦的组件。

默认值：

```js
focusComponents = new Set([
  'input',
  'textarea',
  'editor'
])
```

### this.voidElements

`Set<string>`

不需要渲染子节点的元素。配置后这些组件不会渲染子节点，能够减少模板体积。

默认值：

```js
voidElements = new Set([
  'progress',
  'icon',
  'rich-text',
  'input',
  'textarea',
  'slider',
  'switch',
  'audio',
  'live-pusher',
  'video',
  'ad',
  'official-account',
  'open-data',
  'navigation-bar'
])
```

### this.nestElements

`Map<string, number>`

对于一个小程序来说，只有部分组件有可能递归调用自身。如 `<Map>` 组件不会再调用 `<Map>`，而 `<View>` 则可以不断递归调用 `<View>`。

如果此小程序不支持递归，我们又把 `<Map>` 模板循环渲染了 N 次，那么小程序体积就会变大，而这些循环出来的模板又是不必要的。因此使用了 `nestElements` 去标记那些可能递归调用的组件。

但考虑到例如 `<Form>` 这些组件即使可能递归调用，但也不会递归调用太多次。因此在 `nestElements` 中可以对它的循环渲染次数进行控制，假设 `<Form>` 不会递归调用超过 N 次，进一步减少模板体积。

默认值：

```js
nestElements = new Map([
  ['view', -1],
  ['cover-view', -1],
  ['block', -1],
  ['text', -1],
  ['slot', 8],
  ['slot-view', 8],
  ['label', 6],
  ['form', 4],
  ['scroll-view', 4]
])
```

`key` 值为可以递归调用自身的组件。

`value` 值代表递归生成此组件的次数，**-1** 代表循环 [baseLevel](./config-detail#minibaselevel) 层。

### replacePropName (name, value, componentName)

代替组件的属性名。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| name | string | 属性名 |
| value | string | 属性值 |
| componetName | string | 组件名 |

例子：

```js
replacePropName (name, value, componentName) {
  // 如果属性值为 'eh'，代表这是一个事件，把属性名改为全小写。
  if (value === 'eh') return name.toLowerCase()
  return name
}
```

### buildXsTemplate ()

支持渲染层脚本的小程序，Taro 会生成一个 utils 脚本在根目录。此时需要声明此函数以设置 base 模板中对 utils 脚本的引用语法。

例子：

```js
// 微信小程序 base 模板引用 utils.wxs 脚本
buildXsTemplate () {
  return '<wxs module="xs" src="./utils.wxs" />'
}
```

### modifyLoopBody (child, nodeName)

修改组件模板的子节点循环体。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| child | string | 组件模板的子节点循环体 |
| nodeName | string | 组件名 |

没有在 [this.voidElements](./platform-plugin-template#thisvoidelements) 中声明过的组件，会遍历子节点进行渲染。

这些组件的模板通用格式为：

```html
<template name="tmpl_0_view">
  <view>
    <!-- 子节点循环 begin -->
    <block wx:for="{{i.cn}}" wx:key="uid">
      <!-- 子节点循环体 begin -->
      <template is="{{...}}" data="{{...}}" />
      <!-- 子节点循环体 end -->
    </block>
    <!-- 子节点循环 end -->
  </view>
</template>
```

例子：

```js
// 支付宝小程序的 <swiper> 组件中，循环体套一层 <swiper-item> 和 <view> 组件
modifyLoopBody (child, nodeName) {
  if (nodeName === 'swiper') {
    return `<swiper-item>
      <view a:for="{{item.cn}}" a:key="id">
        ${child}
      </view>
    </swiper-item>`
  }
  return child
}
```

### modifyLoopContainer (children, nodeName)

修改组件模板的子节点循环。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| children | string | 组件模板的子节点循环 |
| nodeName | string | 组件名 |

例子：

```js
// 支付宝小程序的 <picker> 组件中，子节点循环套一层 <view> 组件
modifyLoopContainer (children, nodeName) {
  if (nodeName === 'picker') {
    return `
<view>${children}</view>
`
  }
  return children
}
```

### modifyTemplateResult (res, nodeName, level, children)

修改组件模板的最终结果。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| res | string | 组件模板的结果 |
| nodeName | string | 组件名 |
| level | string | 循环层级 |
| children | string | 组件模板的子节点循环 |

例子：

```js
// 支付宝小程序当遇到 <swiper-item> 组件时不渲染其模板
modifyTemplateResult = (res: string, nodeName: string) => {
  if (nodeName === 'swiper-item') return ''
  return res
}
```

### getAttrValue (value, key, nodeName)

设置组件的属性绑定语法。

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| value | string | 属性值 |
| key | string | 属性名 |
| nodeName | string | 组件名 |

例子：

```js
getAttrValue (value, key, nodeName) {
  const swanSpecialAttrs = {
    'scroll-view': ['scrollTop', 'scrollLeft', 'scrollIntoView']
  }

  // 百度小程序中 scroll-view 组件部分属性的属性绑定语法是: {= value =}
  if (isArray(swanSpecialAttrs[nodeName]) && swanSpecialAttrs[nodeName].includes(key)) {
    return `= ${value} =`
  }

  // 其余属性还是使用 {{ value }} 绑定语法
  return `{ ${value} }`
}
```

## 例子

### 头条小程序模板

* 头条小程序支持模板递归，所以继承 `RecursiveTemplate` 基类。

* 因为不需要调整模板内容，所以只用设置 `supportXS` 和 `Adapter` 属性即可。

```js
import { RecursiveTemplate } from '@tarojs/shared'

export class Template extends RecursiveTemplate {
  supportXS = false
  Adapter = {
    if: 'tt:if',
    else: 'tt:else',
    elseif: 'tt:elif',
    for: 'tt:for',
    forItem: 'tt:for-item',
    forIndex: 'tt:for-index',
    key: 'tt:key',
    type: 'tt'
  }
}
```

### 微信小程序模板

* 微信小程序不支持模板递归，所以继承 `UnRecursiveTemplate` 基类。
* 设置 `supportXS` 和 `Adapter` 属性。
* 因为微信小程序支持渲染层脚本 `wxs`，所以通过 `buildXsTemplate` 设置 base 模板中对 utils 脚本的引用语法。
* 利用 `replacePropName` 修改了组件绑定的属性名。

```js
import { UnRecursiveTemplate } from '@tarojs/shared'

export class Template extends UnRecursiveTemplate {
  supportXS = true
  Adapter = {
    if: 'wx:if',
    else: 'wx:else',
    elseif: 'wx:elif',
    for: 'wx:for',
    forItem: 'wx:for-item',
    forIndex: 'wx:for-index',
    key: 'wx:key',
    xs: 'wxs',
    type: 'weapp'
  }

  buildXsTemplate () {
    return '<wxs module="xs" src="./utils.wxs" />'
  }

  replacePropName (name, value, componentName) {
    if (value === 'eh') {
      const nameLowerCase = name.toLowerCase()
      if (nameLowerCase === 'bindlongtap' && componentName !== 'canvas') return 'bindlongpress'
      return nameLowerCase
    }
    return name
  }
}
```
