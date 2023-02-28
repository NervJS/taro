import * as Joi from 'joi'

const schema = Joi.object().keys({
  projectName: Joi.string().required(),
  date: Joi.date(),
  designWidth: Joi.alternatives(Joi.number().integer().positive(), Joi.function()),
  deviceRatio: Joi.object().pattern(Joi.number(), Joi.number()),
  sourceRoot: Joi.string().required(),
  outputRoot: Joi.string().required(),

  plugins: Joi.array().items(Joi.alternatives(
    Joi.string(),
    Joi.array().ordered(
      Joi.string().required(),
      Joi.alternatives().try(Joi.object(), Joi.function())
    )
  )),

  presets: Joi.array().items(Joi.alternatives(
    Joi.string(),
    Joi.array().ordered(Joi.string().required(), Joi.object())
  )),

  env: Joi.object().pattern(
    Joi.string(), Joi.any()
  ),

  defineConstants: Joi.object().pattern(
    Joi.string(), Joi.any()
  ),

  copy: Joi.object().keys({
    patterns: Joi.array().items(
      Joi.object().keys({
        from: Joi.string().required(),
        to: Joi.string().required(),
        ignore: Joi.array().items(Joi.string()),
        transform: Joi.func()
      })
    ),

    options: Joi.object().keys({
      ignore: Joi.array().items(Joi.string())
    })
  }),

  framework: Joi.any().valid('nerv', 'react', 'preact', 'vue', 'vue3').required(),

  compiler: Joi.alternatives(
    Joi.string().valid('webpack4', 'webpack5'),
    Joi.object().keys({
      type: Joi.string().valid('webpack4', 'webpack5'),
      prebundle: Joi.object().keys({
        enable: Joi.boolean(),
        timings: Joi.boolean(),
        cacheDir: Joi.string(),
        force: Joi.boolean(),
        include: Joi.array(),
        exclude: Joi.array(),
        esbuild: Joi.object().unknown(),
        swc: Joi.object().unknown(),
        webpack: Joi.object().keys({
          provide: Joi.array().items(Joi.function())
        })
      })
    })
  ),

  jsMinimizer: Joi.string().valid('terser', 'esbuild'),

  cssMinimizer: Joi.string().valid('csso', 'esbuild', 'parcelCss'),

  cache: Joi.object().keys({
    enable: Joi.bool()
  }).unknown(),

  logger: Joi.object().keys({
    quiet: Joi.bool(),
    stats: Joi.bool()
  }).unknown(),

  mini: Joi.object().keys({
    baseLevel: Joi.number().integer().positive(),
    compile: Joi.object().keys({
      exclude: Joi.array().items(Joi.string(), Joi.function()),
      include: Joi.array().items(Joi.string(), Joi.function())
    }),
    webpackChain: Joi.func(),
    commonChunks: Joi.alternatives(Joi.func(), Joi.array().items(Joi.string())),
    addChunkPages: Joi.func(),
    output: Joi.object(),
    enableSourceMap: Joi.bool(),
    sourceMapType: Joi.string(),
    debugReact: Joi.bool(),
    minifyXML: Joi.object().keys({
      collapseWhitespace: Joi.bool()
    }),
    postcss: Joi.object().pattern(
      Joi.string(),
      Joi.object().keys({
        enable: Joi.bool(),
        config: Joi.object() // 第三方配置
      })
    ), // 第三方配置
    cssLoaderOption: Joi.object(), // 第三方配置
    styleLoaderOption: Joi.object(), // 第三方配置
    sassLoaderOption: Joi.object(), // 第三方配置
    lessLoaderOption: Joi.object(), // 第三方配置
    stylusLoaderOption: Joi.object(), // 第三方配置
    mediaUrlLoaderOption: Joi.object(), // 第三方配置
    fontUrlLoaderOption: Joi.object(), // 第三方配置
    imageUrlLoaderOption: Joi.object(), // 第三方配置
    miniCssExtractPluginOption: Joi.object() // 第三方配置
  }).unknown(),

  alias: Joi.object().pattern(Joi.string(), Joi.string()),

  csso: Joi.object().keys({
    enable: Joi.bool(),
    config: Joi.object()
  }),
  uglify: Joi.object().keys({
    enable: Joi.bool(),
    config: Joi.object()
  }),
  terser: Joi.object().keys({
    enable: Joi.bool(),
    config: Joi.object()
  }),
  esbuild: Joi.object().keys({
    minify: Joi.object().keys({
      enable: Joi.bool(),
      config: Joi.object()
    })
  }),
  sass: Joi.object().keys({
    resource: Joi.alternatives(Joi.array(), Joi.string()),
    projectDirectory: Joi.string(),
    data: Joi.string()
  }).unknown(),

  h5: Joi.object().keys({
    devServer: Joi.object(), // 第三方配置
    publicPath: Joi.string(),
    staticDirectory: Joi.string(),
    chunkDirectory: Joi.string(),
    webpackChain: Joi.func(),
    output: Joi.object(),
    router: Joi.object(),

    esnextModules: Joi.array().items(Joi.alternatives(
      Joi.string(),
      Joi.object().instance(RegExp)
    )),

    // DEPRECATED: https://nervjs.github.io/taro/docs/config-detail.html#deprecated-h5webpack
    webpack: Joi.forbidden(),

    // https://webpack.js.org/configuration/entry-context/#entry
    entry: Joi.alternatives(
      Joi.string(),
      Joi.array().items(Joi.string()),
      Joi.object().pattern(
        Joi.string(),
        Joi.alternatives(Joi.string(), Joi.array().items(Joi.string()))
      ),
      Joi.func()
    ),
    enableSourceMap: Joi.bool(),
    sourceMapType: Joi.string(),
    enableExtract: Joi.bool(),
    cssLoaderOption: Joi.object(), // 第三方配置
    styleLoaderOption: Joi.object(), // 第三方配置
    sassLoaderOption: Joi.object(), // 第三方配置
    lessLoaderOption: Joi.object(), // 第三方配置
    stylusLoaderOption: Joi.object(), // 第三方配置
    mediaUrlLoaderOption: Joi.object(), // 第三方配置
    fontUrlLoaderOption: Joi.object(), // 第三方配置
    imageUrlLoaderOption: Joi.object(), // 第三方配置
    miniCssExtractPluginOption: Joi.object(), // 第三方配置

    postcss: Joi.object().pattern(
      Joi.string(),
      Joi.object().keys({
        enable: Joi.bool(),
        config: Joi.object() // 第三方配置
      })
    )
  }).unknown()
}).unknown()

export default schema
