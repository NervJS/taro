{{#if typescript }}import type { UserConfigExport } from "@tarojs/cli"{{/if}}

export default {
  mini: {},
  h5: {
    {{#if buildEs5 }}
      {{#if (eq compiler 'Vite')}}
    // 确保产物为 es5
    legacy: true,
      {{else if (eq compiler 'Webpack5')}}
    compile: {
      include: [
        // 确保产物为 es5
        filename => /node_modules\/(?!(@babel|core-js|style-loader|css-loader|react|react-dom))/.test(filename)
      ]
    },
      {{/if}}
    {{/if}}
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain) {
    //   /**
    //    * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
    //    * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
    //    */
    //   chain.plugin('analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    //   /**
    //    * 如果 h5 端首屏加载时间过长，可以使用 prerender-spa-plugin 插件预加载首页。
    //    * @docs https://github.com/chrisvfritz/prerender-spa-plugin
    //    */
    //   const path = require('path')
    //   const Prerender = require('prerender-spa-plugin')
    //   const staticDir = path.join(__dirname, '..', 'dist')
    //   chain
    //     .plugin('prerender')
    //     .use(new Prerender({
    //       staticDir,
    //       routes: [ '/pages/index/index' ],
    //       postProcess: (context) => ({ ...context, outputPath: path.join(staticDir, 'index.html') })
    //     }))
    // }
  }
}{{#if typescript }} satisfies UserConfigExport<'{{ to_lower_case compiler }}'>{{/if}}
