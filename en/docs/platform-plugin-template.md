---
title: Template
---

Taro3 renders the view by stitching the data from the DOM tree with `setData`, which drives the template (`<template>`).

So developers can see that the compiled code has a simple page template file that just references the public template `base.xml`, where all component templates are declared.

We can create a template class that controls the compiled result of the `base` template.

## Recursive and non-recursive templates

We have encapsulated the template related processing logic into base classes.These are the `RecursiveTemplate` class for mini program that **support template recursion**, and the `UnRecursiveTemplate` class for mini program that **do not support template recursion**.

### Recursive Template

In the mini program that support template recursion, the same template is able to keep calling itself, including Alipay, ByteDance, and Baidu mini program.

`view_0` references `container_0`，`container_0` then reference `view_0`：

![](http://storage.jd.com/cjj-pub-images/recursive_temp.png)

### Non-recursive Templates

In mini program that do not support template recursion, the referenced template cannot call itself again, including WeChat, QQ, and Jingdong mini programs.

`view_0` references `container_0`，`container_0` can not references `view_0`，only references new  `view` template `view_1`：

![](http://storage.jd.com/cjj-pub-images/unrecursive_temp.png)

## Template Base Classes

### this.Adapter

`object`

The platform's template syntax keywords.

Example:

```js
// Declared Adapter for WeChat mini program template syntax keywords
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

Readonly, if or not template recursion is supported.

### this.supportXS

`boolean`

Default value: false

Whether to support rendering layer scripts, such as wxs for WeChat mini program, sjs for Alipay mini program.

### this.exportExpr

`string`

Default value: 'module.exports ='

Export command for rendering layer scripts.

Example:

```js
// The export command for Alipay mini program sjs scripts is ES mode
class Template extends RecursiveTemplate {
  exportExpr = 'export default'
}
```

### this.internalComponents

`object`

The list of Taro built-in components, including relatively generic components and some of their generic properties.

### this.focusComponents

`Set<string>`

The component that can set focus.

Default value:

```js
focusComponents = new Set([
  'input',
  'textarea',
  'editor'
])
```

### this.voidElements

`Set<string>`

Elements that do not need to render child nodes.These components do not render child nodes after configuration and can reduce the template size.

Default value:

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

For an mini program, only some components have the possibility to recursively call themselves.For example, the `<Map>` component will not call `<Map>` again, while `<View>` can keep calling `<View>` recursively.

If this mini program does not support recursion and we render the `<Map>` template N times in a loop, then the mini program will get bigger and the templates that come out of the loop are unnecessary.So `nestElements` is used to mark components that may be called recursively.

But considering that components such as `<Form>` are not called recursively too many times, even though they may be called recursively.So in `nestElements` you can control the number of times it is rendered recursively, assuming that `<Form>` will not be called recursively more than N times, further reducing the size of the template.

Default value:

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

The `key` value is the component that can recursively call itself.

The `value` value represents the number of times this component has been recursively generated, **-1** represents the loop [baseLevel](./config-detail#minibaselevel) level.

### replacePropName (name, value, componentName)

Replaces the attribute name of the component.

| Parameters   | Type   | Description    |
|:------------ |:------ |:-------------- |
| name         | string | Property Name  |
| value        | string | Property Value |
| componetName | string | Component Name |

Example:

```js
replacePropName (name, value, componentName) {
  // If the property value is 'eh', which means this is an event, change the property name to all lowercase.
  if (value === 'eh') return name.toLowerCase()
  return name
}
```

### buildXsTemplate ()

For mini program that support rendering layer scripts, Taro will generate a utils script in the root directory.This function needs to be declared at this point to set the syntax of the reference to the utils script in the base template.

Example:

```js
// WeChat mini program base template references utils.wxs script
buildXsTemplate () {
  return '<wxs module="xs" src="./utils.wxs" />'
}
```

### modifyLoopBody (child, nodeName)

Modify the sub-node loop body of the component template.

| Parameters | Type   | Description                                 |
|:---------- |:------ |:------------------------------------------- |
| child      | string | Subnode loop body of the component template |
| nodeName   | string | Component name                              |

Components not declared in [this.voidElements](./platform-plugin-template#thisvoidelements), components that have not been declared in \[this.voidElements\] (.../platform-plugin-template#thisvoidelements) will traverse the child nodes for rendering.

The generic format of the template for these components:

```html
<template name="tmpl_0_view">
  <view>
    <!-- Child node loop begin -->
    <block wx:for="{{i.cn}}" wx:key="uid">
      <!-- Child node loop body begin -->
      <template is="{{...}}" data="{{...}}" />
      <!-- Child node loop body end -->
    </block>
    <!-- Child node loop end -->
  </view>
</template>
```

Example:

```js
// In the <swiper> component of the Alipay mini program, the loop body has a layer of <swiper-item> and <view> components
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

Modifies the child node loop of a component template

| Parameters | Type   | Description                             |
|:---------- |:------ |:--------------------------------------- |
| children   | string | Child node loop for component templates |
| nodeName   | string | Component Name                          |

Example:

```js
// In the <picker> component of the Alipay mini program, the child node loops over one layer of the <view> component
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

Modifies the final result of the component template.

| Parameters | Type   | Description                          |
|:---------- |:------ |:------------------------------------ |
| res        | string | The result of the component template |
| nodeName   | string | Component Name                       |
| level      | string | Loop Hierarchy                       |
| children   | string | Subnode loop for component templates |

Example:

```js
// Alipay mini program does not render the <swiper-item> component template when it encounters it
modifyTemplateResult = (res: string, nodeName: string) => {
  if (nodeName === 'swiper-item') return ''
  return res
}
```

### getAttrValue (value, key, nodeName)

Sets the component's property binding syntax.

| Parameters | Type   | Description    |
|:---------- |:------ |:-------------- |
| value      | string | Property value |
| key        | string | Property name  |
| nodeName   | string | Component name |

Example:

```js
getAttrValue (value, key, nodeName) {
  const swanSpecialAttrs = {
    'scroll-view': ['scrollTop', 'scrollLeft', 'scrollIntoView']
  }

  // The property binding syntax for some properties of the scroll-view component in Baidu mini program is: {= value =}
  if (isArray(swanSpecialAttrs[nodeName]) && swanSpecialAttrs[nodeName].includes(key)) {
    return `= ${value} =`
  }

  // The rest of the properties still use the {{ value }} binding syntax
  return `{ ${value} }`
}
```

## Examples

### ByteDance Mini Program Template

* The header mini program supports template recursion, so it inherits the `RecursiveTemplate` base class.

* Since you don't need to adjust the template content, you only need to set the `supportXS` and `Adapter` properties.

```js
import { RecursiveTemplate } from '@tarojs/shared/dist/template''

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

### WeChat  Mini Program Template

* WeChat mini program does not support template recursion, so it inherits the `UnRecursiveTemplate` base class.
* Set `supportXS` and `Adapter` properties.
* Since WeChat mini program support rendering layer scripts `wxs`, set the reference syntax for utils scripts in base templates via `buildXsTemplate`.
* Modified the attribute name of the component binding with `replacePropName`.

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
