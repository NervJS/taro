## @tarojs/rn-style-transformer

用于处理 rn 样式配置，生成需要的样式

### example
- config.sass
```css
/* a.scss */
.a {
  color: red;
}
```
```js
// config/index.js
{
  ...
  sass: { // 配置详情 https://taro-docs.jd.com/taro/docs/config-detail#sass
    resource: [
      './styles/a.scss',
    ],
    projectDirectory: path.resolve(__dirname),
    data: '.b { color: blue }' // 如果有同样的类型，下面的会把上面的覆盖
  },
  ...
}
```
↓ ↓ ↓ ↓ ↓ ↓
```css
.a {
  color: red;
}
.b {
  color: blue;
}
```

- config.rn 配置
```js
// config/index.js
{
  ...
  rn: {
    postcss: { ... },
    sass: { ... },
    less: { ... },
    stylus: { ... },
    ...
  }
  ...
}
```
- config.rn.poscss 配置
```js
// config/index.js
{
  ...
  rn: {
    postcss: {
      options: { ... }; // https://github.com/postcss/postcss#options
      scalable: boolean; // 默认true，控制是否对 css value 进行 scalePx2dp 转换
      pxtransform: {
        enable: boolean; // 默认true
        config: { ... }; // https://github.com/NervJS/taro/tree/master/packages/postcss-pxtransform
      },
    },
  }
  ...
}
```

- config.rn.sass 配置
```js
// config/index.js
{
  ...
  rn: {
    sass: {
      options?: { ... }; // https://github.com/sass/node-sass#options
      additionalData?: string | Function; // 加入到脚本注入的每个 sass 文件头部，在 config.sass 之前
    }
  }
  ...
}
```

- config.rn.less 配置
```js
// config/index.js
{
  ...
  rn: {
    less: {
      options?: { ... }; // http://lesscss.org/usage/#less-options
      additionalData?: string | Function;
    }
  }
  ...
}
```

- config.rn.stylus 配置
```js
// config/index.js
{
  ...
  rn: {
    stylus: {
      options?: { ... }; // https://stylus-lang.com/docs/js.html
      additionalData?: string | Function;
    }
  }
  ...
}
```