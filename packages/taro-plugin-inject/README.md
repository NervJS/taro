# @tarojs/plugin-inject

> 可以为小程序平台注入公共的组件、API 等逻辑

## 版本要求

### Taro 3.3+

请使用本插件的 `1.0` 或以上版本

### Taro 3.1/3.2

请使用本插件的 `0.0.2` 或以上版本

## 安装

在 Taro 项目根目录下安装

```bash
$ npm i @tarojs/plugin-inject --save
```

## 使用

### 引入插件

请确保 Taro CLI 已升级至 Taro `3.1.0` 的最新版本。

修改项目 `config/index.js` 中的 plugins 配置为如下

```js
const config = {
  ...
  plugins: [
    ['@tarojs/plugin-inject', {
      // 配置项
    }]
  ]
  ...
}
```

### 配置项

插件可以接受如下参数：

| 参数项 | 类型 | 用途 |
| :-----| :---- | :---- |
| syncApis | array | 新增同步 API |
| asyncApis | array | 新增异步 API |
| components | object | 修改、新增组件的属性 |
| componentsMap | object | 新增组件时的名称映射 |
| voidComponents | array, function | 设置组件是否可以渲染子元素 |
| nestElements | object, function | 设置组件模版的循环次数 |
| thirdPartyComponents | object | 设置第三方自定义组件的属性的默认值 |

#### 1. syncApis

> Deprecated
> v1.0.0+ 不再需要此属性

插件支持为小程序新增**同步的** API。

用法：

```js
const config = {
  plugins: [
    ['@tarojs/plugin-inject', {
      // 配置需要新增的 API
      syncApis: ['a']
    }]
  ]
}
```

运行时即可调用此新增的 API：

```js
Taro.a()
```

#### 2. asyncApis

插件支持为小程序新增**异步的** API。

用法：

```js
const config = {
  plugins: [
    ['@tarojs/plugin-inject', {
      // 配置需要新增的 API
      asyncApis: ['b']
    }]
  ]
}
```

运行时即可调用此新增的 API：

```js
Taro.b()
  .then(() => {})
  .catch(() => {})
```

#### 3. components

插件支持为小程序的组件**修改属性默认值**或**新增属性**。

`components` 属性的[设置规范](https://taro-docs.jd.com/taro/docs/next/platform-plugin-base#31-%E7%BC%96%E5%86%99-componentsts)

用法：

```js
const config = {
  plugins: [
    ['@tarojs/plugin-inject', {
      components: {
        // 为 Text 组件新增了 'x-props' 属性和 'bindYEvent' 事件
        Text: {
          'x-props': "'hello'",
          bindYEvent: ''
        },
        // 新增一个组件
        ShareElement: {
          key: "",
          transform: "true",
          duration: "300",
          "easing-function": ""
        }
      },
      // 新增的组件需要写映射
      componentsMap: {
        ShareElement: 'share-element'
      }
    }]
  ]
}
```

新增事件属性：
> 新增一个事件属性有两种方式，一种是像上面例子那样属性以`bind`开头，一种是像下面例子这样将属性值设为`eh` [查看详细PR](https://github.com/NervJS/taro/pull/11478)
```js
const config = {
  plugins: [
    [
      '@tarojs/plugin-inject',
      {
        components: {
          // 新增一个 'CustomComponent' 组件并支持 'catchtouchend' 事件
          CustomComponent: {
            catchtouchend: 'eh',
          },
        },
        componentsMap: {
          CustomComponent: 'custom-component',
        },
      },
    ],
  ],
}
```

#### 4. voidComponents

在 `voidComponents` 里的组件**不可以渲染子组件**。

Taro3 默认下述组件**不渲染子组件**以节省模板体积：

```js
export const voidElements = new Set([
  'progress',
  'icon',
  'rich-text',
  'input',
  'textarea',
  'slider',
  'switch',
  'audio',
  'ad',
  'official-account',
  'open-data',
  'navigation-bar'
])
```

但是我们可以通过配置进行修改：

```js
const config = {
  plugins: [
    ['@tarojs/plugin-inject', {
      // array：新增 View 组件也不需要渲染子组件
      voidComponents: ['view']，
      // function：直接修改 voidComponents
      voidComponents (origin) {
        // 现在 audio 能渲染子组件了
        origin.delete('audio')
        return origin
      },
    }]
  ]
}
```

#### 5. nestElements

对于不支持模板递归的小程序（如微信、QQ、京东小程序），Taro3 默认下述组件的模板能递归自身：

```js
// 正数代表最多可递归 N 次
// -1 代表最多可递归 config.baseLevel 次
export const nestElements = new Map([
  ['view', -1],
  ['catch-view', -1],
  ['cover-view', -1],
  ['static-view', -1],
  ['pure-view', -1],
  ['block', -1],
  ['text', -1],
  ['static-text', 6],
  ['slot', 8],
  ['slot-view', 8],
  ['label', 6],
  ['form', 4],
  ['scroll-view', 4],
  ['swiper', 4],
  ['swiper-item', 4]
])
```

默认原生自定义组件可递归 `config.baseLevel` 次，因为 Taro 不清楚原生自定义组件是否存在可递归自身的情况。例如 `vant-weapp` 中，`van-image` 组件不存在递归自身的情况，而 `van-cell` 这种容器类组件可能递归自身。

但是对 `van-image` 组件循环 `config.baseLevel` 次是不必要的，会增大小程序包体积，针对这种情况我们可以通过配置进行修改：

```js
const config = {
  plugins: [
    ['@tarojs/plugin-inject', {
      // object：修改 swiper、swiper-item 组件的最大循环次数
      nestElements: {
        'swiper': 2,
        'swiper-item': 2
      },
      // function：直接修改 nestElements
      nestElements (origin) {
        // 现在 van-image 只能循环一次了
        origin.set('van-image', 1)
        return origin
      },
    }]
  ]
}
```

#### 6. thirdPartyComponents

> v1.0.2+ 开始支持，且需要 Taro v3.4.10+

在默认情况下，第三方自定义组件的属性会被编译为形如：`<van-empty image="{{i.image}}" />`。

这时自定义组件声明的默认值会失效（详情请浏览 [#11575](https://github.com/NervJS/taro/issues/11575)）。

```js
Component({
  props: {
    image: {
      type: String,
      value: 'default'
    }
  }
})
```

所以我们需要为此属性增加默认值，把它编译为形如：`<van-empty image="{{i.image===undefined?'default':i.image}}" />`。

用法：

```js
const config = {
  plugins: [
    ['@tarojs/plugin-inject', {
      thirdPartyComponents: {
        // 为 `van-empty` 组件的 image 属性设置默认值 'default'
        'van-empty': {
          'image': "'default'"
        }
      }
    }]
  ]
}
```

### 模块补充

在前面的 components 示例中，给Text组件添加了新属性x-props后，@tarojs/components的类型文件中没有新定义的属性，typescript无法识别Text组件的x-props属性，导致vscode提示属性不存在，可以通过[模块补充](https://docs.taro.zone/docs/platform-plugin-how#%E7%B1%BB%E5%9E%8B)的方式来修正

```typescript
//tsconfig.json
{
  "compilerOptions": {
     "typeRoots": ["src/global.d.ts"],
   }
}

// global.d.ts 
declare module '@tarojs/components' {
  export * from '@tarojs/components/types/index';
  
  // 下面示例是react的定义，vue下可能有所不同,原理是一样的
  import { ComponentType } from 'react';
  import { TextProps as OldTextProps } from '@tarojs/components/types/Text';

  // 修改的Props
  interface TextProps extends OldTextProps {
    xProps?: string;
  }

  export const Text: ComponentType<TextProps>;
}
```


## License

MIT License

Copyright (c) O2Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
