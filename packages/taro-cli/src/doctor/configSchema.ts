import * as Joi from '@hapi/joi'

const schema = Joi.object().keys({
  projectName: Joi.string().required(),
  date: Joi.date(),
  designWidth: Joi.number().integer().positive(),
  deviceRatio: Joi.object().pattern(Joi.number(), Joi.number()),
  sourceRoot: Joi.string().required(),
  outputRoot: Joi.string().required(),

  plugins: Joi.array().items(Joi.alternatives(
    Joi.string(),
    Joi.array().ordered(Joi.string().required(), Joi.object())
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
        ignore: Joi.string()
      })
    ),

    options: Joi.object().keys({
      ignore: Joi.array().items(Joi.string())
    })
  }),

  framework: Joi.any().valid('nerv', 'react', 'vue', 'vue3'),

  mini: Joi.object().keys({
    compile: Joi.object().keys({
      exclude: Joi.array().items(Joi.string(), Joi.function()),
      include: Joi.array().items(Joi.string(), Joi.function())
    }),
    webpackChain: Joi.func(),
    commonChunks: Joi.alternatives(Joi.func(), Joi.array().items(Joi.string())),
    addChunkPages: Joi.func(),
    output: Joi.object(),
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

    esnextModules: Joi.array().items(Joi.string()),

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
