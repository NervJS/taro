# PostCSS Pxtransform [![Build Status][ci-img]][ci]

[PostCSS](https://github.com/ai/postcss) 插件，目前已支持 px 转小程序 rpx 及 h5 rem 单位。

基于 [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem/)。

## Install

```shell
$ npm install postcss-pxtransform --save-dev
```

## Usage

### 小程序
```js
options = {
    platform: 'weapp',
    designWidth: 750,
}
```

### H5
```js
options = {
    platform: 'h5',
    designWidth: 750,
}
```

### 输入/输出

默认配置下，所有的 px 都会被转换。

```css
/* input */
h1 {
    margin: 0 0 20px;
    font-size: 32px;
    line-height: 1.2;
    letter-spacing: 1px;
}

/* weapp output */
h1 {
    margin: 0 0 20rpx;
    font-size: 40rpx;
    line-height: 1.2;
    letter-spacing: 1rpx;
}

/* h5 output */
h1 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    line-height: 1.2;
    letter-spacing: 0.025rem;
}
```

### example

```js
var fs = require('fs');
var postcss = require('postcss');
var pxtorem = require('postcss-pxtransform');
var css = fs.readFileSync('main.css', 'utf8');
var options = {
    replace: false
};
var processedCss = postcss(pxtorem(options)).process(css).css;

fs.writeFile('main-rem.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});
```

## 配置 **options** 
参数默认值如下：

```js
{
    unitPrecision: 5,
    propList: ['*'],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0
}
```

Type: `Object | Null`

###  `platform` （String）（必填）
`weapp` 或 `h5`

### `designWidth`（Number）（必填）
`640` 或 `750` 或 `828`

### `rootValue` (Number) (必填)
(Number) The root element font size.

### `unitPrecision` (Number) 
The decimal numbers to allow the REM units to grow to.

### `propList` (Array) 
The properties that can change from px to rem.

- Values need to be exact matches.
- Use wildcard `*` to enable all properties. Example: `['*']`
- Use `*` at the start or end of a word. (`['*position*']` will match `background-position-y`)
- Use `!` to not match a property. Example: `['*', '!letter-spacing']`
- Combine the "not" prefix with the other prefixes. Example: `['*', '!font*']`
 
### `selectorBlackList`
(Array) The selectors to ignore and leave as px.
- If value is string, it checks to see if selector contains the string.
  - `['body']` will match `.body-class`
- If value is regexp, it checks to see if the selector matches the regexp.
  - `[/^body$/]` will match `body` but not `.body`

### `replace` (Boolean) 
replaces rules containing rems instead of adding fallbacks.

### `mediaQuery` (Boolean) 
Allow px to be converted in media queries.

### `minPixelValue` (Number) 
Set the minimum pixel value to replace.


## A message about ignoring properties
Currently, the easiest way to have a single property ignored is to use a capital in the pixel unit declaration.

```css
 /*`px` is converted to `rem`*/
.convert {
    font-size: 16px; // converted to 1rem
}

 /* `Px` or `PX` is ignored by `postcss-pxtorem` but still accepted by browsers*/
.ignore {
    border: 1Px solid; // ignored
    border-width: 2PX; // ignored
}
```

