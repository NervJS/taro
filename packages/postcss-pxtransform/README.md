# PostCSS Pxtransform 

[PostCSS](https://github.com/ai/postcss) 单位转换插件，目前已支持小程序端（px 转rpx），H5 端（px 转 rem）及 RN 端。

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

### RN
```js
options = {
    platform: 'rn',
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
    font-size: 32rpx;
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

/* rn output */
h1 {
    margin: 0 0 10px;
    font-size: 16px;
    line-height: 1.2;
    letter-spacing: 0.5px;
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
`weapp` 或 `h5` 或 `rn`

### `designWidth`（Number）（必填）
`640` 或 `750` 或 `828`

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


## 忽略
### 属性
当前忽略单个属性的最简单的方法，就是 px 单位使用大写字母。

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

### 文件
对于头部包含注释`/*postcss-pxtransform disable*/` 的文件，插件不予处理。

## 剔除
`/*postcss-pxtransform rn eject enable*/` 与 `/*postcss-pxtransform rn eject disable*/` 中间的代码，
在编译成 RN 端的样式的时候，会被删除。建议将 RN 不支持的但 H5 端又必不可少的样式放到这里面。如：样式重制相关的代码。
```css
/*postcss-pxtransform rn eject enable*/

.test {
  color: black;
}

/*postcss-pxtransform rn eject disable*/
```

