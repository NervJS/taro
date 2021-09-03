---
title: Overview
---

## Platform Plugin

Since `v3.1.0`, we have extracted the compatibility logic for each mini program platform and injected it into the Taro framework as a [Taro plugin](./plugin) into the Taro framework to support compilation for the corresponding platform.

### Taro Includes Platform Plugins

| Plugin                         | Compile Platform       |
|:------------------------------ |:---------------------- |
| @tarojs/plugin-platform-weapp  | Wechat Mini Program    |
| @tarojs/plugin-platform-alipay | Alipay Mini Program    |
| @tarojs/plugin-platform-swan   | Swan Smart Program     |
| @tarojs/plugin-platform-tt     | ByteDance Mini Program |
| @tarojs/plugin-platform-qq     | QQ  Mini Program       |
| @tarojs/plugin-platform-jd     | Jingdong Mini Program  |

### Other Platform Plugin

| Plugin                                                                                          | Compile Platform               |
|:----------------------------------------------------------------------------------------------- |:------------------------------ |
| [@tarojs/plugin-platform-weapp-qy](https://github.com/NervJS/taro-plugin-platform-weapp-qy)     | Enterprise WeChat Mini Program |
| [@tarojs/plugin-platform-alipay-dd](https://github.com/NervJS/taro-plugin-platform-alipay-dd)   | DingTalk Mini Program          |
| [@tarojs/plugin-platform-alipay-iot](https://github.com/NervJS/taro-plugin-platform-alipay-iot) | Alipay IOT Mini Program        |
| [@tarojs/plugin-platform-lark](https://github.com/NervJS/taro-plugin-platform-lark)             | 飞书小程序                          |

### Platform Plugin Usage

1. Configuration Plugin

```js
// Taro Project Configuration
module.exports = {
  // ... plugins: [
    '@tarojs/plugin-platform-alipay-iot'
  ]
}
```

2. Compile as Alipay IOT Mini Program

```shell
taro build --type iot
taro build --type iot --watch
```

## Background

### Open Framework

In recent years, there are more and more mini program platforms launched, but there are only 6 platforms maintained by Taro core (WeChat, Alipay, Baidu, ByteDance, QQ, Jingdong mini program), so some students often ask if they can support Feature Request of a certain platform.

Based on the current architecture, the compatibility code for a single platform is distributed in various corners of the Taro core library, involving compile-time and run-time parts.Supporting a new platform requires changes to all these places, which makes development complicated and makes it difficult for the community to participate in contributing.

For this reason we came up with the idea of building an **open framework**.The goal is to extend Taro's end-platform support capabilities in the form of plugins for.

* Plugin developers can write a platform plugin without modifying the Taro core library code and following certain rules.
* Plugin users only need to install and configure the end-platform plugin to compile the code to the specified platform.

Platform extensions can be further divided into horizontal and vertical extensions in two ways:

* Horizontal extensions

  Extend a brand new compiled platform, such as the Meituan mini program.

* Vertical extension

  Inherit existing platform plugin and extend a new compilation platform, such as QQ mini program plugin inherit from WeChat mini program plugin.

#### Open compilation platform architecture diagram

![](http://storage.jd.com/cjj-pub-images/platform-plugin-all.png)

### What else is interesting to do

In addition to extending the new compilation platform, we can also write custom platform plugins that inject custom logic into the platform's compilation process by inheriting from existing platform plugins.

> Use the plugin [@tarojs/plugin-inject](https://github.com/NervJS/taro-plugin-inject) to quickly add APIs, components, adjust component properties, etc. for all mini program mini program

#### Quick fixes for problems

Due to the large number of mini program platforms and the fact that they are constantly iterating, there is often an issue where Taro does not have timely support for a newly introduced component or API of an mini program.Developers would first need to contact the Taro team and then wait for us to follow up with a fix and release a new version before they could use it properly, which would take an average of a week or two weeks to be resolved.

Based on the open compilation platform architecture, developers can quickly develop custom platform plugins by inheriting the target platform plugins to complete support for these new components or APIs without waiting for Taro to release a version.

#### Property Simplification

Because the properties and events of the mini program components must be written statically and cannot be added dynamically, Taro binds all the properties and events of the components in the template in advance.

However, in many cases, the actual project does not use all the properties and events of the component, and the redundant property and event bindings will occupy a large part of the volume, and too many event bindings will also reduce the performance of the mini program to some extent.

The following is the pseudo code for the `View` component template.

```html
<template name="tmpl_0_view">
  <view
    hover-class="..." hover-stop-propagation="..." hover-start-time="..." hover-stay-time="..." animation="..." onTouchStart="..." onTouchMove="..." onTouchEnd="..." onTouchCancel="..." onLongTap="..." onAnimationStart="..." onAnimationIteration="..." onAnimationEnd="..." onTransitionEnd="..." disable-scroll="..." hidden="..." onAppear="..." onDisappear="..." onFirstAppear="..." style="..." class="..." onTap="..." id="..." >
    ... </view>
</template>
```

Taro needs to bind all properties and events of the `View` component in advance in order to meet the needs of different developers.However, for a developer who may not use the `hover-stop-propagation` property for the entire `View` component of the project, consider streamlining it and not compiling it into the `View` template.

Attribute refinement can also be achieved by implementing a custom platform plugin.However, it is important to note that refinement of properties can cause unnecessary problems and make maintenance of the project difficult, and should be designed and used with care, especially when the project is large and has many developers.

#### Welcome to build together

We hope that after the launch of the open architecture, we can stimulate the creativity of developers in the community to create new platform support plugins or various excellent custom platform components for the Taro ecosystem, and we look forward to your participation and contribution!
