import { IPluginContext } from '@tarojs/service'
<% if (['plugin-build'].includes(type)) { -%>
import webpackChain from 'webpack-chain';
<% } -%>

<% if (['plugin-command'].includes(type)) { -%>
/**
 * 命令行扩展
 */
export default (ctx: IPluginContext, pluginOpts) => {
  ctx.registerCommand({
    // 命令名
    name: 'say',
    // 参数说明，执行 taro say --help 时输出的 options 信息
    optionsMap: {
      '--msg': '输出的信息',
    },
    // 执行 taro say --help 时输出的使用例子的信息
    synopsisList: ['taro say --msg Hello!'],
    // 命令钩子
    async fn() {
      console.log('插件入参：', pluginOpts)
      const { msg } = ctx.runOpts.options
      console.log('Taro say:', msg)
    },
  })
}
<% } -%>

<% if (['plugin-build'].includes(type)) { -%>
/**
 * 编译过程扩展
 */
export default (ctx: IPluginContext, pluginOpts) => {
  ctx.onBuildStart(() => {
    console.log('插件入参：', pluginOpts)
    console.log('编译开始')
  })

  ctx.modifyWebpackChain(({ chain }: { chain: webpackChain }) => {
    console.log('这里可以修改webpack配置')
    // 示例：利用webpackChain向html中插入脚本
    if (process.env.TARO_ENV !== 'h5') return
    chain
      .plugin('htmlWebpackPlugin')
      .tap(([pluginConfig]) => {
        return [
          {
            ...pluginConfig,
            script: pluginConfig.script + 'console.log("向html中插入代码");'
          }
        ]
      });
  });

  ctx.onBuildComplete(() => {
    console.log('Taro 构建完成！')
  })

  ctx.modifyBuildAssets(({ assets }) => {
    console.log('修改编译后的结果')
    // 示例：修改html产物内容
    const indexHtml = assets['index.html']
    if (indexHtml && indexHtml._value) {
      indexHtml._value = indexHtml._value.replace(/<title>(.*?)<\/title>/,'<title>被插件修改过的标题</title>');
    }
  });

  ctx.onBuildFinish(() => {
    console.log('Webpack 编译结束！')
  })
}
<% } -%>
