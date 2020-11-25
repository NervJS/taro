---
title: Vue3
---

Taro 可以使用 Vue 3 进行开发，开发者可以使用 `taro init` 命令创建 Vue3 的 **default** 模板或 **vuex** 模板进行体验。

具体用法可以参考 [Taro Vue 文档](./vue.md)，本篇将着重介绍在 Taro 中使用 Vue3 与使用 Vue 的主要差别。

Vue3 新特性可参阅 [Vue3 文档](https://v3.vuejs.org/guide/migration/introduction.html#notable-new-features)。

Taro 是如何兼容 Vue3 的，可参阅 [Taro RFC](https://github.com/NervJS/taro-rfcs/blob/master/rfcs/0001-vue-3-support.md)。

## 入口组件

由于 Vue3 Global API 有变化（[0009-global-api-change](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0009-global-api-change.md)），Vue3 的入口组件写法将会变成：

```js
// app.js
import { createApp } from 'vue'

const app = createApp({
  onShow (options) {
    // ...
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

export app
```

## 页面组件

页面组件使用 Vue SFC 正常导出一个 Vue3 组件即可。

开发者可以自行选择使用 options 式配置或 [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) 组织逻辑，浏览 [Vue 3 文档](https://v3.vuejs.org/) 以了解更多的 Vue3 改动。

```html
<template>
  <view class="index">
    <text>{{ msg }}</text>
  </view>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
}
</script>
```

## 其它限制

* 小程序中不支持 `<style scoped>`，建议使用 cssModules 代替。[#6662](https://github.com/NervJS/taro/issues/6662)
* Vue 3 内部实现使用了 Proxy ，在 iOS 9 及以下操作系统无法运行。但 Vue 官方团队在正式版发布后会推出兼容版本。
* 在 H5 端使用 ref 获取基础组件的 DOM 节点，现在只能得到适配层的 Vue 组件实例，而不是对应的 webComponent 根节点。在 Vue2 里可以通过修改父元素的 refs 属性实现，但 Vue3 中组件间初始化顺序有变化，因此暂时不能支持。
* 小程序端非类似 HTML 表单标签规范的表单组件，如 Picker，暂不兼容 v-model。Vue3 的 v-model 绑定属性改为了 modelValue，事件绑定改为了 update:modelValue。对于 HTML 表单标签会自动对接表单的值与事件，例如 input 会自动对应 modelValue 与 value、update:modelValue 与 @input。但对于 Picker 这种小程序特有表单则无法对应，建议这种情况不使用 v-model。
* VirtualList 组件需要实现一份 Vue3 版本（待实现）
* 所有组件的 `id` 必须在整个应用中保持唯一（即使他们在不同的页面），否则可能导致事件不触发的问题，[#7317](https://github.com/NervJS/taro/issues/7317)


## 相关阅读

[使用 Vue3 开发小程序](https://taro-club.jd.com/topic/2267/%E4%BD%BF%E7%94%A8-vue3-%E5%BC%80%E5%8F%91%E5%B0%8F%E7%A8%8B%E5%BA%8F) by lillian