import { IPluginContext } from '@tarojs/service'
import * as minimist from 'minimist'
import { IOptions } from './BaseCi'
import WeappCI from './WeappCI'
import TTCI from './TTCI'

export default (ctx: IPluginContext, pluginOpts: IOptions) => {
  ctx.addPluginOptsSchema((joi) => {
    return joi
      .object()
      .keys({
        /** 微信小程序上传配置 */
        weapp: joi.object({
          appid: joi.string().required(),
          projectPath: joi.string(),
          privateKeyPath: joi.string().required(),
          type: joi.string().valid('miniProgram', 'miniProgramPlugin', 'miniGame', 'miniGamePlugin'),
          ignores: joi.array().items(joi.string().required())
        }),
        /** 字节跳动小程序上传配置 */
        tt: joi.object({
          email: joi.string().required(),
          password: joi.string().required()
        }),
        version: joi.string(),
        desc: joi.string()
      })
      .required()
  })

  ctx.onBuildFinish(async () => {
    const args = minimist(process.argv.slice(2), {
      boolean: ['open', 'upload', 'preview']
    })
    const { printLog, processTypeEnum } = ctx.helper
    const platform = ctx.runOpts.options.platform
    let ci
    switch (platform) {
      case 'weapp':
        ci = new WeappCI(ctx, pluginOpts)
        break
      case 'tt':
        ci = new TTCI(ctx, pluginOpts)
        break
      default:
        break
    }
    if (!ci) {
      printLog(processTypeEnum.WARNING, `"@tarojs/plugin-mini-ci" 插件暂时不支持 "${platform}" 平台`)
      return
    }
    switch (true) {
      case args.open:
        ci.open()
        break
      case args.upload:
        ci.upload()
        break
      case args.preview:
        ci.preview()
        break
      default:
        break
    }
  })
}
