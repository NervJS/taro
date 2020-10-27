---
title: 设计稿及尺寸单位
---

在 Taro 中尺寸单位建议使用 `px`、 `百分比 %`，Taro 默认会对所有单位进行转换。在 Taro 中书写尺寸按照 1:1 的关系来进行书写，即从设计稿上量的长度 `100px`，那么尺寸书写就是 `100px`，当转成微信小程序的时候，尺寸将默认转换为 `100rpx`，当转成 H5 时将默认转换为以 `rem` 为单位的值。

如果你希望部分 `px` 单位不被转换成 `rpx` 或者 `rem` ，最简单的做法就是在 px 单位中增加一个大写字母，例如 `Px` 或者 `PX` 这样，则会被转换插件忽略。

结合过往的开发经验，Taro 默认以 `750px` 作为换算尺寸标准，如果设计稿不是以 `750px` 为标准，则需要在项目配置 `config/index.js` 中进行设置，例如设计稿尺寸是 `640px`，则需要修改项目配置 `config/index.js` 中的 `designWidth` 配置为 `640`：

```jsx
const config = {
  projectName: 'myProject',
  date: '2018-4-18',
  designWidth: 640,
  ....
}
```

目前 Taro 支持 `750`、 `640` 、 `828` 三种尺寸设计稿，他们的换算规则如下：

```jsx
const DEVICE_RATIO = {
  '640': 2.34 / 2,
  '750': 1,
  '828': 1.81 / 2
}
```

建议使用 Taro 时，设计稿以 iPhone 6 `750px` 作为设计尺寸标准。

如果你的设计稿是 `375` ，不在以上三种之中，那么你需要把 `designWidth` 配置为 `375`，同时在 `DEVICE_RATIO` 中添加换算规则如下：
```jsx
const DEVICE_RATIO = {
  '640': 2.34 / 2,
  '750': 1,
  '828': 1.81 / 2,
  '375': 2 / 1
}
```

## API

在编译时，Taro 会帮你对样式做尺寸转换操作，但是如果是在 JS 中书写了行内样式，那么编译时就无法做替换了，针对这种情况，Taro 提供了 API `Taro.pxTransform` 来做运行时的尺寸转换。

```jsx
Taro.pxTransform(10) // 小程序：rpx，H5：rem
```

## 配置

默认配置会对所有的 `px` 单位进行转换，有大写字母的 `Px` 或 `PX` 则会被忽略。

参数默认值如下：

```js
{
  onePxTransform: true,
  unitPrecision: 5,
  propList: ['*'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0
}
```

Type: `Object | Null`

### `onePxTransform` (Boolean)

设置 1px 是否需要被转换

### `unitPrecision` (Number)

REM 单位允许的小数位。

### `propList` (Array)

允许转换的属性。

- Values need to be exact matches.
- Use wildcard `*` to enable all properties. Example: `['*']`
- Use `*` at the start or end of a word. (`['*position*']` will match `background-position-y`)
- Use `!` to not match a property. Example: `['*', '!letter-spacing']`
- Combine the "not" prefix with the other prefixes. Example: `['*', '!font*']`

### `selectorBlackList`

黑名单里的选择器将会被忽略。

- If value is string, it checks to see if selector contains the string.
  - `['body']` will match `.body-class`
- If value is regexp, it checks to see if the selector matches the regexp.
  - `[/^body$/]` will match `body` but not `.body`

### `replace` (Boolean)

直接替换而不是追加一条进行覆盖。

### `mediaQuery` (Boolean)

允许媒体查询里的 px 单位转换

### `minPixelValue` (Number)

设置一个可被转换的最小 px 值

配置规则对应到 `config/index.js` ，例如：

```js
{
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true
      },
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['body']
        }
      }
    }
  },
  mini: {
    // ...
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['body']
        }
      }
    }
  }
}
```

## 忽略

### 属性

当前忽略单个属性的最简单的方法，就是 px 单位使用大写字母。

```css
 /* `px` is converted to `rem` */
.convert {
  font-size: 16px; // converted to 1rem
}

 /* `Px` or `PX` is ignored by `postcss-pxtorem` but still accepted by browsers */
.ignore {
  border: 1Px solid; // ignored
  border-width: 2PX; // ignored
}
```

### 文件

对于头部包含注释 `/*postcss-pxtransform disable*/` 的文件，插件不予处理。