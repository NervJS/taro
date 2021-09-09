---
title: Taro DOM Reference
---

**小程序**环境下，Taro 模拟实现的 DOM、BOM API 概览。

相关代码位于 `@tarojs/runtime` 包中。

## DOM

### TaroEventTarget

| 属性或方法 | 说明 |
| :------- | :-- |
| addEventListener | 绑定事件 |
| removeEventListener | 解绑事件 |

### TaroNode

`TaroEventTarget <- TaroNode`

| 属性或方法 | 说明 |
| :------- | :-- |
| nodeType |  |
| nodeName |  |
| parentNode |  |
| childNodes |  |
| nextSibling |  |
| previousSibling |  |
| parentElement |  |
| firstChild |  |
| lastChild |  |
| textContent | setter |
| insertBefore |  |
| appendChild |  |
| replaceChild |  |
| removeChild |  |
| remove |  |
| hasChildNodes |  |
| ownerDocument | 只读，返回模拟的 [document](taro-dom#document) 对象 |

#### 可选属性/方法

以下属性/方法不是每个 Web 框架、每个应用都需要使用的。因此 Taro v3.4 把这类 DOM APIs 做成可插拔式，让开发者可以选择在最终的编译结果里只存在哪些 DOM APIs。

:::tip
如果没有使用 React 的 `dangerouslySetInnerHTML` 或 Vue2 的 `v-html` 去渲染 HTML 字符串，可以关闭对 `innerHTML` 的支持，可以节省 **9k** 的空间。
但 Vue3 必须开启，因为它使用了 insertAdjacentHTML。
:::

| 属性或方法 | 默认状态 | 配置项 | 说明 |
| :------- | :------ | :---- |:--- |
| innerHTML | 开启 | enableInnerHTML | 目前只实现了 `setter`(主要用于支持 React `dangerouslySetInnerHTML`、Vue `v-html`)<br/>`getter` 只会返回空字符串 |
| insertAdjacentHTML | 开启（Vue3） | enableAdjacentHTML |  |
| cloneNode | 开启（Vue3） | enableCloneNode |  |
| contains | 关闭 | enableContains | |

### TaroText

`TaroEventTarget <- TaroNode <- TaroText`

| 属性或方法 | 说明 |
| :------- | :-- |
| textContent |  |
| nodeValue |  |

### TaroElement

`TaroEventTarget <- TaroNode <- TaroElement`

| 属性或方法 | 说明 |
| :------- | :-- |
| id |  |
| tagName |  |
| props |  |
| style |  |
| dataset |  |
| className |  |
| cssText |  |
| classList |  |
| children |  |
| attributes |  |
| textContent |  |
| hasAttribute |  |
| hasAttributes |  |
| focus |  |
| blur |  |
| setAttribute |  |
| removeAttribute |  |
| getAttribute |  |
| getElementsByTagName |  |
| getElementsByClassName |  |
| dispatchEvent |  |

#### 可选属性/方法

| 属性或方法 | 默认状态 | 配置项 | 说明 |
| :------- | :------ | :---- |:--- |
| content | 开启（Vue3） | enableTemplateContent |  |
| getBoundingClientRect | 关闭 | enableSizeAPIs | 受限于小程序，此 API 是**异步函数** |

### RootElement

`TaroEventTarget <- TaroNode <- TaroElement <- RootElement`

非 Web 标准 API。是链接 Taro DOM 更新和小程序 `setData` 的核心实现。

在这里会调用小程序的 `setData` API，把 Taro DOM 的序列化数据传递到小程序渲染层。

### FormElement

`TaroEventTarget <- TaroNode <- TaroElement <- FormElement`

| 属性或方法 | 说明 |
| :------- | :-- |
| value | 返回或设置当前控件的值 |

### SVGElement

`TaroEventTarget <- TaroNode <- TaroElement <- SVGElement`

只是实现了继承关系，没有实现属性与方法。

## BOM

### window

Taro 模拟实现了基于浏览器标准 `window` 对象，它主要实现了用于支持 React、Vue 等框架运行的必备 API。

此外，Taro 会为 `window` 对象赋值小程序的 `global` 对象上的全部属性。

| 属性或方法 | 说明 |
| :------- | :-- |
| navigator | 模拟的 [navigator](taro-dom#navigator) 对象 |
| document | 模拟的 [document](taro-dom#document) 对象 |
| requestAnimationFrame | 模拟的 [requestAnimationFrame](taro-dom#requestanimationframe) API |
| cancelAnimationFrame | 模拟的 [cancelAnimationFrame](taro-dom#cancelanimationframe) API |
| getComputedStyle | 只能用于返回元素的 `style` 值，做不到真正去计算 `css` 后的样式 |
| addEventListener | 空函数 |
| removeEventListener | 空函数 |

### document

`TaroEventTarget <- TaroNode <- TaroElement <- document`

| 属性或方法 | 说明 |
| :------- | :-- |
| createElement | 返回 `TaroElement` |
| createElementNS | 没有正真去实现，等同于 `document.createElement`，返回 `TaroElement` |
| createTextNode | 返回 `TaroText` |
| createComment | 返回 `TaroText` |
| getElementById | 返回 `TaroElement` |
| querySelector | 目前只能根据 `id` 寻找元素，等同于 `document.getElementById` |
| querySelectorAll | 没有正真去实现，返回 `[]` |
| defaultView | 返回 [window](taro-dom#window) |

### navigator

`navigator` 为以下对象：

```json
{
  "appCodeName": "Mozilla",
  "appName": "Netscape",
  "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/534.36 (KHTML, like Gecko) NodeJS/v4.1.0 Chrome/76.0.3809.132 Safari/534.36",
  "cookieEnabled": true,
  "mimeTypes": [],
  "onLine": true,
  "platform": "MacIntel",
  "plugins": [],
  "product": "Taro",
  "productSub": "20030107",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/534.36 (KHTML, like Gecko) NodeJS/v4.1.0 Chrome/76.0.3809.132 Safari/534.36",
  "vendor": "Joyent",
  "vendorSub": ""
}
```

### requestAnimationFrame

优先使用小程序的 `requestAnimationFrame` API，如果不存在则进行 [polyfill](https://github.com/NervJS/taro/blob/next/packages/taro-runtime/src/bom/raf.ts)。

### cancelAnimationFrame

优先使用小程序的 `cancelAnimationFrame` API，如果不存在则使用 `clearTimeout` 代替。
