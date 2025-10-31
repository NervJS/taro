import { defineConfig{{#if typescript }}, type UserConfigExport{{/if}} } from '@tarojs/cli'
{{#if typescript }}{{#unless (eq compiler "Vite")}}import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'{{/unless}}{{/if}}
import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig{{#if typescript }}<'{{ to_lower_case compiler }}'>{{/if}}(async (merge, { command, mode }) => {
  const baseConfig{{#if typescript }}: UserConfigExport<'{{ to_lower_case compiler }}'>{{/if}} = {
    projectName: '{{ projectName }}',
    date: '{{ date }}',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
      "@tarojs/plugin-generator"
    ],
    defineConstants: {
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: '{{ to_lower_case framework }}',
    compiler: '{{ to_lower_case compiler }}',{{#if (eq compiler "Webpack5") }}
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },{{/if}}
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },{{#if typescript }}{{#unless (eq compiler "Vite")}}
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      }{{/unless}}{{/if}}
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      {{#unless (eq compiler "Vite")}}
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },{{/unless}}
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }{{#if typescript }},{{#unless (eq compiler "Vite")}}
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      }{{/unless}}{{/if}}
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }

  {{#if buildEs5 }}
  process.env.BROWSERSLIST_ENV = process.env.NODE_ENV
  {{/if}}

  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
