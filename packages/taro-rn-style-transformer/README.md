## @tarojs/rn-style-transformer

用于处理 rn 样式配置，生成需要的样式

### rn.postcss

`object`

 `postcss` 相关配置，其他样式语言预处理后经过此配置。

```js
module.exports = {
  // ...
  rn: {
    // ...
    postcss: {
      // postcss 配置，参考 https://github.com/postcss/postcss#options
      options: { /* ... */ },
      // 默认true，控制是否对 css value 进行 scalePx2dp 转换，pxtransform配置 enable 才生效
      scalable: boolean,
      pxtransform: {
        enable: boolean, // 默认true
        config: { /* ... */ } // 插件 pxtransform 配置项，参考尺寸章节
      },
      // 跟其他端 css module 配置保持统一
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
      }
    },
  }
}
```

### rn.sass

`object`

 `sass` 相关配置。`options` 配置项参考[官方文档](https://github.com/sass/node-sass#options)。

```js
module.exports = {
  // ...
  rn: {
    // ...
    sass: {
      options: { /* ... */ },
    	// 加入到脚本注入的每个 sass 文件头部，在 config.sass 之前
      additionalData: '', // {String|Function}
    }
  }
}
```

### rn.less

`object`

`less` 相关配置。`options` 配置项参考 [官方文档](http://lesscss.org/usage/#less-options)。

```js
module.exports = {
  // ...
  rn: {
    // ...
    less: {
      options: { /* ... */ },
      additionalData: '', // {String|Function}
    }
  }
}
```

### rn.stylus

`object`

 `stylus` 相关配置。`options` 配置项如下。

```js
module.exports = {
  // ...
  rn: {
    // ...
    stylus: {
      options: {
        /**
         * Specify Stylus plugins to use.
         *
         * @type {(string|Function)[]}
         * @default []
         */
        use: ["nib"],

        /**
         * Add path(s) to the import lookup paths.
         *
         * @type {string[]}
         * @default []
         */
        include: [path.join(__dirname, "src/styl/config")],

        /**
         * Import the specified Stylus files/paths.
         *
         * @type {string[]}
         * @default []
         */
        import: ["nib", path.join(__dirname, "src/styl/mixins")],

        /**
         * Define Stylus variables or functions.
         *
         * @type {Array|Object}
         * @default {}
         */
        // Array is the recommended syntax: [key, value, raw]
        define: [
          ["$development", process.env.NODE_ENV === "development"],
          ["rawVar", 42, true],
        ],
        // Object is deprecated syntax (there is no possibility to specify "raw')
        // define: {
        //   $development: process.env.NODE_ENV === 'development',
        //   rawVar: 42,
        // },

        /**
         * Include regular CSS on @import.
         *
         * @type {boolean}
         * @default false
         */
        includeCSS: false,

        /**
         * Emits comments in the generated CSS indicating the corresponding Stylus line.
         *
         * @see https://stylus-lang.com/docs/executable.html
         *
         * @type {boolean}
         * @default false
         */
        lineNumbers: true,

        /**
         * Move @import and @charset to the top.
         *
         * @see https://stylus-lang.com/docs/executable.html
         *
         * @type {boolean}
         * @default false
         */
        hoistAtrules: true,
      },
      additionalData: '', // {String|Function}
    }
  }
}
```
