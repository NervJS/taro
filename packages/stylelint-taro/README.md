# stylelint-taro

**Taro 多端融合校验工具**

我们可以根据我们需要适配多少个端，根据不同端所支持的最小样式子集进行样式校验：

## 安装

```
yarn add -D stylelint-taro
```

## 使用

```js
// .stylelintrc.js
const mergeConfig = require('stylelint-taro-harmony/lib/config')

// 合并配置，填写需要适配的端："h5", "miniprogram", "harmony", "rn"
module.exports = mergeConfig(['h5', 'miniprogram', 'harmony'], {
  // 自定义样式规范: 支持sass的语言规范
  // customSyntax: "postcss-scss"
  // 自定义Stylelint配置
  rules: {},
})
```

## 内置 rule

### taro/no-nested-selectors

仅能使用 class 选择器

```js
// .stylelintrc.js
module.exports = mergeConfig(['harmony'], {})
```

```css
/* 通过检查 */
✅ .hello {
  /* ... */
}
/* 警告提示：harmony平台仅能使用单类选择器 */
❌ #a {
}
❌ .a .b {
}
❌ #a .b {
}
❌ .a > .b {
}
❌ .a + .b {
}
❌ .a ~ .b {
}
```

### taro/property-allowed-list

允许的属性列表

### taro/declaration-property-value-allowed-list

允许的属性及其对应的值

```js
{
  plugins: ['stylelint-taro']
  rules: {
    'taro/declaration-property-value-allowed-list': {
      harmony: {
        'color': true,  // 支持color属性及所有合法值
        'text-align': ['left', 'right'], // 仅支持left、right 2个值
        'height': [/^-?\d+(\.\d+)?(px|vw|vh|%)?$/i] // 支持匹配height为length
      },
      rn: {
        'text-align': ['left', 'center'], // 仅支持left、center 2个值
      }
    }
  }
}
```

如果在支持`rn`和`harmony`的情况下:

```js
// .stylelintrc.js
module.exports = mergeConfig(['harmony', 'rn'], {})
```

```css
/* 通过检查 */
✅ .hello {
  text-align: left;
}
/* 警告提示 */
❌ .hello2 {
  /* rn平台的text-align属性暂不支持right */
  text-align: right;
}
```

## 开启 VSCODE 校验

项目空间内，建议通过修改 settings.json 配置

```json
// .vscode/settings.json
{
  "stylelint.enable": true,
  "stylelint.validate": ["css", "sass", "scss", "less", "postcss"]
}
```
