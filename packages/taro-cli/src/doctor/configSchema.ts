import * as Joi from 'joi'

const schema = Joi.object().keys({
  'projectName': Joi.string().required(),
  'date': Joi.date(),
  'designWidth': Joi.number().integer(),
  'deviceRatio': Joi.object().pattern(
    Joi.number(), Joi.number()
  ),
  'sourceRoot': Joi.string().required(),
  'outputRoot': Joi.string().required(),

  'plugins': Joi.array().items(Joi.object()),

  'env': Joi.object().pattern(
    Joi.string(), Joi.string()
  ),

  'defineConstants': Joi.object().pattern(
    Joi.string(), Joi.string()
  ),

  'copy': Joi.object().keys({
    'patterns': Joi.array().items(Joi.object().keys({
      'from': Joi.string().required(),
      'to': Joi.string().required(),
      'ignore': Joi.string()
    })),

    'options': Joi.object().keys({
      'ignore': Joi.array().items(Joi.string())
    })
  }),

  'mini': Joi.object().keys({
    'compile': Joi.object().keys({
      'exclude': Joi.array().items(Joi.string()),
      'include': Joi.array().items(Joi.string())
    }),
    'customFilesTypes': Joi.object().keys({
      'TEMPL': Joi.string(),
      'STYLE': Joi.string(),
      'SCRIPT': Joi.string(),
      'CONFIG': Joi.string()
    }),
    'webpackChain': Joi.func(),
    'commonChunks': Joi.alternatives(Joi.func(), Joi.array().items(Joi.string())),
    'addChunkPages': Joi.func(),
    'output': Joi.object(),
    'postcss': Joi.object(), // 第三方配置
    'cssLoaderOption': Joi.object(), // 第三方配置
    'styleLoaderOption': Joi.object(), // 第三方配置
    'sassLoaderOption': Joi.object(), // 第三方配置
    'lessLoaderOption': Joi.object(), // 第三方配置
    'stylusLoaderOption': Joi.object(), // 第三方配置
    'mediaUrlLoaderOption': Joi.object(), // 第三方配置
    'fontUrlLoaderOption': Joi.object(), // 第三方配置
    'imageUrlLoaderOption': Joi.object(), // 第三方配置
    'miniCssExtractPluginOption': Joi.object(), // 第三方配置
    'jsxAttributeNameReplace': Joi.object().pattern(
      Joi.string(), Joi.string()
    )
  }),

  'alias': Joi.object().pattern(
    Joi.string(), Joi.string()
  ),

  'babel': Joi.object(),
  'csso': Joi.object().keys({
    'enable': Joi.bool(),
    'config': Joi.object()
  }),
  'uglify': Joi.object().keys({
    'enable': Joi.bool(),
    'config': Joi.object()
  }),
  'sass': Joi.object().keys({
    'resource': Joi.alternatives(Joi.array(), Joi.string()),
    'projectDirectory': Joi.string(),
    'data': Joi.string()
  }),

  'h5': Joi.object().keys({
    'devServer': Joi.object(), // 第三方配置
    'publicPath': Joi.string(),
    'staticDirectory': Joi.string(),
    'chunkDirectory': Joi.string(),
    'webpackChain': Joi.func(),
    'output': Joi.object(),

    'esnextModules': Joi.array().items(Joi.string()),

    // DEPRECATED: https://nervjs.github.io/taro/docs/config-detail.html#deprecated-h5webpack
    'webpack': Joi.forbidden(),

    // https://webpack.js.org/configuration/resolve/#resolve-alias
    'alias': Joi.object().pattern(
      Joi.string(), Joi.string().strict()
    ),

    // https://webpack.js.org/configuration/entry-context/#entry
    'entry': Joi.alternatives(
      Joi.string(),
      Joi.array().items(Joi.alternatives(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.alternatives(
            Joi.string(),
            Joi.array().items(Joi.string())
          )
        )
      )),
      Joi.func()
    ),
    'enableSourceMap': Joi.bool(),
    'enableExtract': Joi.bool(),
    'transformOnly': Joi.bool(),
    'cssLoaderOption': Joi.object(), // 第三方配置
    'styleLoaderOption': Joi.object(), // 第三方配置
    'sassLoaderOption': Joi.object(), // 第三方配置
    'lessLoaderOption': Joi.object(), // 第三方配置
    'stylusLoaderOption': Joi.object(), // 第三方配置
    'mediaUrlLoaderOption': Joi.object(), // 第三方配置
    'fontUrlLoaderOption': Joi.object(), // 第三方配置
    'imageUrlLoaderOption': Joi.object(), // 第三方配置
    'miniCssExtractPluginOption': Joi.object(), // 第三方配置

    'postcss': Joi.object().pattern(
      Joi.string(),
      Joi.object().keys({
        'enable': Joi.bool(),
        'config': Joi.object() // 第三方配置
      })
    )
  })
})

export default schema
