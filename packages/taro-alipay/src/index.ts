import Alipay from './program'
import type { IPluginContext } from '@tarojs/service'

// 让其它平台插件可以继承此平台
export { Alipay }

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'alipay',
    useConfigName: 'mini',
    async fn ({ config }) {
      modifyPageTemplate(ctx)

      const program = new Alipay(ctx, config)
      await program.start()
    }
  })
}

// 支付宝小程序中，如果某个页面依赖了原生小程序组件，
// 那么这个页面不能使用公共模板 base.axml，
// 而需要把公共模板的内容在此页面的模板中复制一份, 。
function modifyPageTemplate (ctx: IPluginContext) {
  ctx.modifyBuildAssets(({ assets, miniPlugin }) => {
    const pages: string[] = []

    // 筛选出使用了自定义组件的页面
    miniPlugin.pages.forEach(page => {
      const config = miniPlugin.filesConfig[miniPlugin.getConfigFilePath(page.name)].content
      if (config?.hasOwnProperty('usingComponents') && Object.keys(config.usingComponents).length) {
        pages.push(page.name)
      }
    })

    if (!pages.length) return

    const baseXml = assets['base.axml'].source()

    pages.forEach(page => {
      const templateName = `${page}.axml`
      const src = assets[templateName].source()
      let relativePath
      const templateCaller = src.replace(/<import src="(.*)base\.axml"\/>/, function (_, $1) {
        relativePath = $1
        return ''
      })
      const main = baseXml.replace(/<import-sjs name="xs" from="(.*)utils.sjs" \/>/, function () {
        return `<import-sjs name="xs" from="${relativePath}utils.sjs" />`
      })

      const res = `${templateCaller}
${main}`
      assets[templateName] = {
        size: () => res.length,
        source: () => res
      }
    })
  })
}
