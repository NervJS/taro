import type { IPluginContext } from '@tarojs/service'
<% if (['plugin-build'].includes(type)) { -%>
import webpackChain from 'webpack-chain'

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
      })
  })

  ctx.onBuildComplete(() => {
    console.log('Taro 构建完成！')
  })

  ctx.modifyBuildAssets(({ assets }) => {
    console.log('修改编译后的结果')
    // 示例：修改html产物内容
    const indexHtml = assets['index.html']
    if (indexHtml && indexHtml._value) {
      indexHtml._value = indexHtml._value.replace(/<title>(.*?)<\/title>/,'<title>被插件修改过的标题</title>')
    }
  })

  ctx.onBuildFinish(() => {
    console.log('Webpack 编译结束！')
  })
}
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
<% if (['plugin-template'].includes(type)) { -%>
import * as fs from 'fs-extra'
const path = require('path')
const download = require('download')
const unzip = require("unzip")
/**
 * 创建 page 自定义模版
 */

interface ITemplateInfo {
  css: 'none' | 'sass' | 'stylus' | 'less'
  typescript?: boolean
  compiler?: 'webpack4' | 'webpack5' | 'vite'
  template?: string
}

type TCustomTemplateInfo = Omit<ITemplateInfo & {
  isCustomTemplate?: boolean
  customTemplatePath?: string
}, 'template'>

type TSetCustomTemplateConfig = (customTemplateConfig: TCustomTemplateInfo) => void

interface IPluginOpts extends ITemplateInfo {
  installPath: string
}

export default (ctx: IPluginContext, pluginOpts:IPluginOpts) => {
 ctx.modifyCreateTemplate(async (setCustomTemplateConfig: TSetCustomTemplateConfig)=> {
  const { installPath, css, typescript, compiler } = pluginOpts
  const templateName = 'mobx'
  const templatePath = path.join(installPath, templateName)
  const customTemplateConfig = {
    //自定义模版路径
    customTemplatePath: templatePath,
    css,
    typescript,
    compiler
  }

   /**
    * 下载模版到电脑本地，可以自行进行判断，看是否需要重新下载
    * 从哪里下载，如何下载，taro 官方不做限定
    * 模版格式和社区模版一样
    * 只要保证下载后的文件目录为 `${templatePath}` 即可，taro 会在该目录下获取模版
    * 如果下载模版失败，请不要调用 setCustomTemplateConfig，taro 会根据默认流程进行兜底创建
    */
   if (!fs.existsSync(templatePath)) {
    //如果文件不存在，就下载文件到指定路径
     await downloadTemplate(customTemplateConfig)
  }

   if (fs.existsSync(templatePath)) {
    //如果文件下载成功，调用 setCustomTemplateConfig
     setCustomTemplateConfig(customTemplateConfig)
   }
 })
}


const downloadTemplate = async (customTemplateConfig) => {
  return new Promise<void>(async (resolve, reject)=>{
    const url = 'https://storage.360buyimg.com/olympic-models-test/mobx.zip'
    const { name, templatePath } = customTemplateConfig
    const zipName = `${name}.zip`
    const zipPath = path.join(templatePath, zipName)
    fs.writeFileSync(zipPath, await download(url))
    const extract = unzip.Extract({ path: templatePath })
    fs.createReadStream(zipPath).pipe(extract)
    extract.on('close', function () {
      console.log("解压完成!!")
      //删除
       fs.unlinkSync(zipPath)
      resolve()
    })
    extract.on('error', function (err) {
      console.log(err)
      reject()
    })
  })
}
<% } -%>
